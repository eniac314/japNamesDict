port module NameDictWorker exposing (..)

import Codec exposing (decoder, encoder)
import Common exposing (..)
import Http exposing (..)
import Json.Decode as D
import Json.Encode as E
import List.Extra exposing (unique)
import Parser exposing (..)
import Set exposing (..)
import String.Extra exposing (leftOf, rightOfBack)
import StringDistance exposing (sift3Distance)


port outbound : E.Value -> Cmd msg


port saveToIndexedDb : E.Value -> Cmd msg


port loadFromIndexedDb : String -> Cmd msg


port inbound : (D.Value -> msg) -> Sub msg


port loadedFromIndexedDb : (E.Value -> msg) -> Sub msg


port indexedDbStatus : (E.Value -> msg) -> Sub msg


type alias Model =
    { rawData : String
    , requested : Set String
    , maxLineLength : Int
    , indexedDbStatusStr : String
    }


type DataFromIndexedDb
    = IndexedDbData { content : String, filename : String }
    | NoData String


type Msg
    = GotIndexedDbStatus E.Value
    | GetData
    | GotRemoteData String (Result Http.Error String)
    | GotDataFromIndexedDb E.Value
    | Search String
    | NoOp


main : Program Flags Model Msg
main =
    Platform.worker
        { init = init
        , update = update
        , subscriptions = subscriptions
        }


type alias Flags =
    ()


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        ids =
            List.range 0 (nbrFiles - 1)
    in
    ( { rawData = ""
      , requested = Set.fromList (List.map dataPath ids)
      , maxLineLength = 0
      , indexedDbStatusStr = "loading indexedDb..."
      }
    , Cmd.none
    )


nbrFiles =
    60


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotIndexedDbStatus value ->
            let
                statusDecoder =
                    D.field "indexedDbReady" D.bool
            in
            case D.decodeValue statusDecoder value of
                Ok True ->
                    ( { model | indexedDbStatusStr = "indexedDb is ready" }
                    , Set.toList model.requested
                        |> List.map loadFromIndexedDb
                        |> Cmd.batch
                    )

                _ ->
                    ( { model | indexedDbStatusStr = "indexedDb error" }, Cmd.none )

        GetData ->
            let
                ids =
                    List.range 0 (nbrFiles - 1)
            in
            ( { model | requested = Set.fromList (List.map dataPath ids) }
            , List.map dataPath ids
                |> List.map loadFromIndexedDb
                |> Cmd.batch
            )

        GotRemoteData path res ->
            case res of
                Ok str ->
                    let
                        maxLineLength =
                            String.lines str
                                |> List.foldr (\s acc -> max (String.length s) acc) model.maxLineLength

                        filename =
                            rightOfBack "/" path

                        requested =
                            Set.remove path model.requested
                    in
                    ( { model
                        | rawData = model.rawData ++ String.cons '\n' str
                        , requested = requested
                        , maxLineLength = maxLineLength
                      }
                    , Cmd.batch
                        [ E.object
                            [ ( "filename", E.string path )
                            , ( "content", E.string str )
                            ]
                            |> saveToIndexedDb
                        , { progress = round <| 100 * toFloat (nbrFiles - Set.size requested) / toFloat nbrFiles
                          , message = "Loaded " ++ filename ++ " from network"
                          , status =
                                if requested == Set.empty then
                                    Success

                                else
                                    Pending
                          }
                            |> LoadingStatusMsg NameDictWorker
                            |> Codec.encoder workerMsgCodec
                            |> outbound
                        ]
                    )

                Err _ ->
                    ( model, getData path )

        GotDataFromIndexedDb value ->
            let
                dataFromIndexedDbSecoder =
                    D.oneOf
                        [ D.map2
                            (\f c ->
                                IndexedDbData { filename = f, content = c }
                            )
                            (D.field "filename" D.string)
                            (D.field "content" D.string)
                        , D.map NoData (D.field "noData" D.string)
                        ]
            in
            case D.decodeValue dataFromIndexedDbSecoder value of
                Ok (IndexedDbData { filename, content }) ->
                    let
                        maxLineLength =
                            String.lines content
                                |> List.foldr
                                    (\s acc -> max (String.length s) acc)
                                    model.maxLineLength

                        filename_ =
                            rightOfBack "/" filename

                        requested =
                            Set.remove filename model.requested
                    in
                    ( { model
                        | rawData = model.rawData ++ String.cons '\n' content
                        , requested = requested
                        , maxLineLength = maxLineLength
                      }
                    , { progress = round <| 100 * toFloat (nbrFiles - Set.size requested) / toFloat nbrFiles
                      , message = "Loaded " ++ filename_ ++ " from local backup"
                      , status =
                            if requested == Set.empty then
                                Success

                            else
                                Pending
                      }
                        |> LoadingStatusMsg NameDictWorker
                        |> Codec.encoder workerMsgCodec
                        |> outbound
                    )

                Ok (NoData path) ->
                    ( model, getData path )

                Err _ ->
                    ( model, Cmd.none )

        Search s ->
            let
                getMatch n s_ =
                    let
                        rigthStr =
                            String.dropLeft n s_
                                |> leftOf "\n"

                        leftStr =
                            String.left n s_
                                |> rightOfBack "\n"
                    in
                    leftStr ++ rigthStr

                searchResult =
                    String.indexes s model.rawData
                        |> List.map (\n -> String.slice (n - model.maxLineLength) (n + model.maxLineLength) model.rawData)
                        |> List.map (getMatch model.maxLineLength)
                        |> List.Extra.unique
                        |> List.map (parseNameDictEntry >> Result.toMaybe)
                        |> List.filterMap identity
                        |> (if List.all Char.isAlphaNum (String.toList s) then
                                List.filter
                                    (\e ->
                                        List.member (String.toLower s)
                                            (String.words <| String.toLower e.meaning)
                                    )

                            else
                                List.filter (\e -> String.contains s e.key)
                           )
                        |> List.sortBy (\e -> sift3Distance e.key s)
            in
            ( model
            , Codec.encoder workerMsgCodec
                (SearchResultMsg
                    { searchString = s
                    , result = NameDictResult searchResult
                    }
                )
                |> outbound
            )

        NoOp ->
            ( model, Cmd.none )


subscriptions model =
    Sub.batch
        [ loadedFromIndexedDb GotDataFromIndexedDb
        , indexedDbStatus GotIndexedDbStatus
        , inbound
            (\c ->
                case D.decodeValue (Codec.decoder workerCmdCodec) c of
                    Ok (SearchCmd s) ->
                        Search s

                    Ok LoadAssets ->
                        GetData

                    _ ->
                        NoOp
            )
        ]


dataPath id =
    "/data/names"
        ++ (String.fromInt id
                |> String.padLeft 2 '0'
           )
        ++ ".dat"


getData path =
    Http.get
        { url = path
        , expect = expectString (GotRemoteData path)
        }



-------------------------------------------------------------------------------


parseNameDictEntry e =
    Parser.run entryParser e


parseEntries s es =
    Parser.run (entriesParsers s) es


entriesParsers s =
    let
        go xs =
            Parser.oneOf
                [ backtrackable <|
                    succeed (\match -> Loop (match :: xs))
                        |= matchingNameDictEntryParser s
                , succeed (Loop xs)
                    |. chompUntil "\n"
                    |. symbol "\n"
                , succeed ()
                    |> Parser.map (\_ -> Done xs)
                ]
    in
    Parser.loop
        []
        go


matchingNameDictEntryParser s =
    succeed NameDictEntry
        |= matchParser s
        |= readingParser
        |. symbol "/"
        |= kindParser
        |= meaningParser
        |. symbol "/"
        |= abrParser


entryParser =
    succeed NameDictEntry
        |= keyParser
        |= readingParser
        |. symbol "/"
        |= kindParser
        |= meaningParser
        |. symbol "/"
        |= abrParser


keyParser =
    succeed identity
        |. spaces
        |= (getChompedString <|
                succeed ()
                    |. chompWhile
                        (\c -> c /= ' ' && c /= '/' && c /= '[' && c /= ']')
           )
        |. spaces


matchParser s =
    keyParser
        |> Parser.andThen
            (\k ->
                if String.contains s k then
                    succeed k

                else
                    problem "wrong match"
            )


readingParser =
    Parser.oneOf
        [ backtrackable
            (succeed Just
                |. symbol "["
                |. spaces
                |= (getChompedString <|
                        succeed ()
                            |. chompWhile (\c -> c /= ']')
                   )
                |. symbol "]"
                |. spaces
            )
        , succeed Nothing
        ]


kindParser =
    succeed
        (\res ->
            String.split "," res
                |> List.map stringToKing
        )
        |. symbol "("
        |= (getChompedString <|
                succeed ()
                    |. chompWhile (\c -> Char.isAlphaNum c || c == ',')
           )
        |. symbol ")"


meaningParser =
    succeed identity
        |. spaces
        |= (getChompedString <|
                succeed ()
                    |. chompWhile (\c -> c /= '/' && c /= '\n')
           )
        |. spaces


abrParser =
    Parser.oneOf
        [ backtrackable
            (succeed Just
                |= (getChompedString <|
                        succeed ()
                            |. chompWhile (\c -> c /= '/' && c /= '\n')
                   )
                |. symbol "/"
            )
        , succeed Nothing
        ]
