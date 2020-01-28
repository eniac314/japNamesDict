port module Main exposing (..)

import Browser
import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Html.Attributes as HtmlAttr
import Http exposing (..)
import Json.Decode as D
import Json.Encode as E
import Parser exposing (..)
import Set exposing (..)
import String.Extra exposing (leftOf, rightOfBack)
import StringDistance exposing (sift3Distance)


port saveToIndexedDb : E.Value -> Cmd msg


port loadFromIndexedDb : String -> Cmd msg


port loadedFromIndexedDb : (E.Value -> msg) -> Sub msg


port indexedDbStatus : (E.Value -> msg) -> Sub msg


type alias Model =
    { rawData : String
    , parsingErrors : List ( String, List Parser.DeadEnd )
    , requested : Set String
    , searchInput : Maybe String
    , searchResult : List Entry
    , maxLineLength : Int
    , appState : AppState
    , indexedDbStatusStr : String
    , loadingStatusStr : String
    }


type AppState
    = Loading Status
    | Ready


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
    | SearchInput String
    | Search
    | NoOp


type alias Entry =
    { key : String
    , reading : Maybe String
    , kind : List Kind
    , meaning : String
    , abr : Maybe String
    }


entryView : Int -> Entry -> Element Msg
entryView n e =
    column
        [ width fill
        , spacing 10
        , padding 10
        , Background.color
            (if modBy 2 n == 0 then
                rgba255 187 210 217 0.6

             else
                rgba255 215 177 215 0.6
            )
        ]
        [ wrappedRow
            [ spacing 15 ]
            [ el [ Font.bold ] (text e.key)
            , el [ Font.size 15 ]
                (case e.reading of
                    Just r ->
                        text <| "[" ++ r ++ "]"

                    Nothing ->
                        Element.none
                )
            ]
        , el
            [ Font.size 15
            , Font.color (Element.rgb255 77 129 144)
            ]
            (text <| String.join ", " (List.map kindToStr e.kind))
        , el [ Font.size 15 ] (text <| e.meaning)
        , case e.abr of
            Just abr ->
                text <| "abbr: " ++ abr

            Nothing ->
                Element.none
        ]


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        ids =
            List.range 0 (nbrFiles - 1)
    in
    ( { rawData = ""
      , requested = Set.fromList (List.map dataPath ids)
      , parsingErrors = []
      , searchInput = Nothing
      , searchResult = []
      , maxLineLength = 0
      , appState = Loading Initial
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
                        , appState =
                            if requested == Set.empty then
                                Ready

                            else
                                model.appState
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
                        , appState =
                            if requested == Set.empty then
                                Ready

                            else
                                model.appState
                      }
                    , Cmd.none
                    )

                Ok (NoData path) ->
                    ( model, getData path )

                Err _ ->
                    ( model, Cmd.none )

        SearchInput s ->
            ( { model
                | searchInput =
                    if s == "" then
                        Nothing

                    else
                        Just s
              }
            , Cmd.none
            )

        Search ->
            case model.searchInput of
                Just s ->
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

                Nothing ->
                    ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


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


type alias Flags =
    ()


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


view : Model -> Browser.Document Msg
view model =
    { title = ""
    , body =
        [ layout []
            (column
                [ padding 15
                , spacing 15
                , width fill
                , centerX
                ]
                [ case model.appState of
                    Loading s ->
                        loadingView model s

                    Ready ->
                        searchView model
                ]
            )
        ]
    }


loadingView model status =
    column
        [ spacing 15 ]
        [ (100 * (toFloat (nbrFiles - Set.size model.requested) / toFloat nbrFiles))
            |> round
            |> progressBar
            |> el [ centerX ]
        , el [ Font.size 14 ] (text <| model.indexedDbStatusStr)
        , el [ Font.size 14 ] (text <| model.loadingStatusStr)
        , if status == Failure then
            Input.button
                []
                { onPress = Just GetData
                , label = text <| "reload data"
                }

          else
            Element.none
        ]


searchView model =
    column
        [ spacing 15
        , width fill
        ]
        [ row
            [ spacing 15
            , width fill
            ]
            [ Input.text
                []
                { onChange = SearchInput
                , text = model.searchInput |> Maybe.withDefault ""
                , placeholder = Nothing
                , label = Input.labelHidden "searchInput"
                }
            , Input.button
                (buttonStyle True)
                { onPress = Just Search
                , label = text <| "search"
                }
            ]
        , column
            [ width fill ]
            (List.indexedMap entryView model.searchResult)
        ]


main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


subscriptions model =
    Sub.batch
        [ loadedFromIndexedDb GotDataFromIndexedDb
        , indexedDbStatus GotIndexedDbStatus
        ]


buttonStyle isActive =
    [ Border.rounded 5
    , Font.center
    , centerY
    , padding 5
    , focused [ Border.glow (rgb 1 1 1) 0 ]
    ]
        ++ (if isActive then
                [ Background.color (rgb 0.9 0.9 0.9)
                , mouseOver [ Font.color (rgb 255 255 255) ]
                , Border.width 1
                , Border.color (rgb 0.9 0.9 0.9)
                ]

            else
                [ Background.color (rgb 0.95 0.95 0.95)
                , Font.color (rgb 0.7 0.7 0.7)

                --, htmlAttribute <| HtmlAttr.style "cursor" "default"
                , Border.width 1
                , Border.color (rgb 0.95 0.95 0.95)
                ]
           )


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



-------------------------------------------------------------------------------


progressBar : Int -> Element msg
progressBar n =
    row
        [ width (px 200)
        , height (px 25)
        , Border.innerShadow
            { offset = ( 0, 1 )
            , size = 1
            , blur = 1
            , color = rgb255 127 127 127
            }
        , Background.color (rgb255 245 245 245)
        , Border.rounded 5
        , clip
        , inFront <|
            el
                [ width (px 200)
                , height (px 25)
                , Font.center
                ]
                (el
                    [ centerX
                    , centerY
                    ]
                    (String.fromInt n
                        |> String.padLeft 2 '0'
                        |> strCons "%"
                        |> text
                    )
                )
        ]
        [ el
            [ width (fillPortion n)
            , height fill
            , Background.color
                (if n < 25 then
                    rgb255 217 83 79

                 else if n < 50 then
                    rgb255 240 173 78

                 else if n < 75 then
                    rgb255 91 192 222

                 else
                    rgb255 92 184 92
                )
            , Font.center
            ]
            Element.none
        , el
            [ width (fillPortion (100 - n))
            , height fill
            ]
            Element.none
        ]


strCons : String -> String -> String
strCons tail head =
    head ++ tail
