port module NameDictWorker exposing (..)

import Http exposing (..)
import Json.Decode as D
import Json.Encode as E
import Parser exposing (..)
import Set exposing (..)
import String.Extra exposing (leftOf, rightOfBack)
import StringDistance exposing (sift3Distance)


port outbound : E.Value -> Cmd msg


port saveToIndexedDb : E.Value -> Cmd msg


port loadFromIndexedDb : String -> Cmd msg


port inbound : (String -> msg) -> Sub msg


port loadedFromIndexedDb : (E.Value -> msg) -> Sub msg


port indexedDbStatus : (E.Value -> msg) -> Sub msg


type alias Model =
    { rawData : String
    , requested : Set String
    , searchResult : List Entry
    , maxLineLength : Int
    , indexedDbStatusStr : String
    , loadingStatusStr : String
    }


type Status
    = Initial
    | Pending
    | Success
    | Failure


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


type alias Entry =
    { key : String
    , reading : Maybe String
    , kind : List Kind
    , meaning : String
    , abr : Maybe String
    }


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
      , searchResult = []
      , maxLineLength = 0
      , indexedDbStatusStr = "loading indexedDb..."
      , loadingStatusStr = "loading..."
      }
    , Cmd.none
    )


nbrFiles =
    50


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
                        , loadingStatusStr = "Loaded " ++ filename ++ " from network"
                      }
                    , E.object
                        [ ( "filename", E.string path )
                        , ( "content", E.string str )
                        ]
                        |> saveToIndexedDb
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
                        , loadingStatusStr = "Loaded " ++ filename_ ++ " from local backup"
                      }
                    , Cmd.none
                    )

                Ok (NoData path) ->
                    ( model, getData path )

                Err _ ->
                    ( model, Cmd.none )

        Search s ->
            let
                getMatch n =
                    let
                        rigthStr =
                            String.dropLeft n model.rawData
                                |> leftOf "\n"

                        leftStr =
                            String.left n model.rawData
                                |> rightOfBack "\n"
                    in
                    leftStr ++ rigthStr

                searchResult =
                    String.indexes s model.rawData
                        |> List.map (\n -> String.slice (n - model.maxLineLength) (n + model.maxLineLength) model.rawData)
                        |> List.map String.lines
                        |> List.map (List.filter (String.contains s))
                        |> List.map (List.head >> Maybe.withDefault "")
                        |> Set.fromList
                        |> Set.toList
                        |> List.map (parseEntry >> Result.toMaybe)
                        |> List.filterMap identity
                        |> List.filter (\e -> String.contains s e.key)
                        |> List.sortBy (\e -> sift3Distance e.key s)
            in
            ( { model
                | searchResult = searchResult
              }
            , Cmd.none
            )

        NoOp ->
            ( model, Cmd.none )


subscriptions model =
    Sub.batch
        [ loadedFromIndexedDb GotDataFromIndexedDb
        , indexedDbStatus GotIndexedDbStatus
        , inbound Search
        ]


dataPath id =
    "data/names"
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


parseEntry e =
    Parser.run entryParser e


parseEntries s es =
    Parser.run (entriesParsers s) es


entriesParsers s =
    let
        go xs =
            Parser.oneOf
                [ backtrackable <|
                    succeed (\match -> Loop (match :: xs))
                        |= matchingEntryParser s
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


matchingEntryParser s =
    succeed Entry
        |= matchParser s
        |= readingParser
        |. symbol "/"
        |= kindParser
        |= meaningParser
        |. symbol "/"
        |= abrParser


entryParser =
    succeed Entry
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


stringToKing s =
    case s of
        "o" ->
            Organisation

        "pr" ->
            Product

        "c" ->
            Company

        "f" ->
            Female

        "p" ->
            Place

        "st" ->
            Station

        "u" ->
            Person

        "h" ->
            Fullname

        "s" ->
            Surname

        _ ->
            Unknown


kindToStr k =
    case k of
        Person ->
            "Person"

        Female ->
            "Female"

        Fullname ->
            "Fullname"

        Surname ->
            "Surname"

        Place ->
            "Place"

        Station ->
            "Station"

        Organisation ->
            "Organisation"

        Product ->
            "Product"

        Company ->
            "Company"

        Unknown ->
            "Unknown"


type Kind
    = Person
    | Female
    | Surname
    | Fullname
    | Place
    | Station
    | Organisation
    | Product
    | Company
    | Unknown
