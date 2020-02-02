port module KanjiDictWorker exposing (..)

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
    , startedLoading : Bool
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
      , startedLoading = False
      }
    , Cmd.none
    )


nbrFiles =
    30


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
                    if model.startedLoading then
                        ( model, Cmd.none )

                    else
                        ( { model
                            | indexedDbStatusStr = "indexedDb is ready"
                            , startedLoading = True
                          }
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
                            |> LoadingStatusMsg KanjiDictWorker
                            |> Codec.encoder workerMsgCodec
                            |> outbound
                        ]
                    )

                Err _ ->
                    ( model, Cmd.none )

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
                        |> LoadingStatusMsg KanjiDictWorker
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

                searchResult s_ =
                    String.indexes s_ model.rawData
                        |> List.map (\n -> String.slice (n - model.maxLineLength) (n + model.maxLineLength) model.rawData)
                        |> List.map (getMatch model.maxLineLength)
                        |> List.Extra.unique
                        |> List.map readKanjiEntry
                        |> List.filterMap identity
                        |> (if List.all Char.isAlphaNum (String.toList s_) then
                                List.filter
                                    (\e ->
                                        List.member (String.toLower s_)
                                            (List.concatMap (String.words << String.toLower) e.meanings)
                                    )

                            else
                                List.filter (\e -> String.contains s_ e.key)
                           )
                        |> List.sortBy (\e -> sift3Distance e.key s_)
            in
            ( model
            , Codec.encoder workerMsgCodec
                (SearchResultMsg
                    { searchString = s
                    , result =
                        if List.all Char.isAlphaNum (String.toList s) then
                            KanjiDictResult <| searchResult s

                        else
                            String.toList s
                                |> List.filter (\c -> List.member c kanji)
                                |> List.map String.fromChar
                                |> List.concatMap searchResult
                                |> KanjiDictResult
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
    "/data/kanji"
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


type MetaKind
    = Pradical (Maybe Int)
    | Pgrade (Maybe Int)
    | Pstrokes (Maybe Int)
    | Pfrequency (Maybe Int)
    | PclassicNelson (Maybe Int)
    | PnewNelson (Maybe Int)
    | Phalpern (Maybe Int)
    | Phenshall (Maybe Int)
    | Pskip (Maybe ( Int, Int, Int ))
    | Ppinyin (Maybe ( String, Int ))
    | PkanjiKentei (Maybe Int)


readKanjiEntry : String -> Maybe KanjiDictEntry
readKanjiEntry l =
    case String.split "|" l of
        k :: met :: r :: n :: u :: m :: [] ->
            { key = k
            , meta = parseKanjiMeta met
            , onYomi = getOnYomi r
            , kunYomi = getKunYomi r
            , nanori = String.words n
            , meanings = String.split "," m
            }
                |> Just

        _ ->
            Nothing


parseKanjiMeta met =
    List.foldr
        (\e acc ->
            case Parser.run parseMetaKind e of
                Ok (Pradical res) ->
                    { acc | radical = res }

                Ok (Pgrade res) ->
                    { acc | grade = res }

                Ok (Pstrokes res) ->
                    { acc | strokes = res }

                Ok (Pfrequency res) ->
                    { acc | frequency = res }

                Ok (PclassicNelson res) ->
                    { acc | classicNelson = res }

                Ok (PnewNelson res) ->
                    { acc | newNelson = res }

                Ok (Phalpern res) ->
                    { acc | halpern = res }

                Ok (Phenshall res) ->
                    { acc | henshall = res }

                Ok (Pskip res) ->
                    { acc | skip = res }

                Ok (Ppinyin res) ->
                    { acc | pinyin = res }

                Ok (PkanjiKentei res) ->
                    { acc | kanjiKentei = res }

                _ ->
                    acc
        )
        defaultMeta
        (String.words met)


parseMetaKind =
    Parser.oneOf
        [ succeed (\r -> Pradical (Just r))
            |. symbol "B"
            |= Parser.int
        , succeed (\r -> Pgrade (Just r))
            |. symbol "G"
            |= Parser.int
        , succeed (\r -> Pstrokes (Just r))
            |. symbol "S"
            |= Parser.int
        , succeed (\r -> Pfrequency (Just r))
            |. symbol "F"
            |= Parser.int
        , succeed (\r -> PclassicNelson (Just r))
            |. symbol "N"
            |= Parser.int
        , succeed (\r -> PnewNelson (Just r))
            |. symbol "V"
            |= Parser.int
        , succeed (\r -> Phalpern (Just r))
            |. symbol "H"
            |= Parser.int
        , succeed (\r -> Phenshall (Just r))
            |. symbol "E"
            |= Parser.int
        , succeed
            (\a b c -> Pskip (Just ( a, b, c )))
            |. symbol "P"
            |= Parser.int
            |. symbol "-"
            |= Parser.int
            |. symbol "-"
            |= Parser.int
        , succeed (\r n -> Ppinyin (Just ( r, n )))
            |. symbol "Y"
            |= getChompedString (chompWhile Char.isAlpha)
            |= Parser.int
        , succeed (\r -> PkanjiKentei (Just r))
            |. symbol "KK"
            |= Parser.int
        ]


getOnYomi r =
    String.words r
        |> List.filter
            (String.toList
                >> List.all (\c -> List.member c katakana)
            )


getKunYomi r =
    String.words r
        |> List.filter
            (String.toList
                >> List.all (\c -> c == '.' || List.member c hiragana)
            )



---------------------
