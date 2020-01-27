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


type alias Model =
    { data : Dict String (List Entry)
    , rawData : String
    , parsingErrors : List ( String, List Parser.DeadEnd )
    , requested : Set String
    , searchInput : Maybe String
    , searchResult : List Entry
    , searchRawResult : List Entry
    , maxLineLength : Int
    }


type SearchMode
    = SearchRawString
    | SearchDict


type DataFromIndexedDb
    = IndexedDbData { content : String, filename : String }
    | NoData String


type Msg
    = GetData
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


entryView : Entry -> Element Msg
entryView e =
    column
        [ spacing 10 ]
        [ el [ Font.bold ] (text e.key)
        , case e.reading of
            Just r ->
                text <| "reading: " ++ r

            Nothing ->
                Element.none
        , text <| "kind: " ++ String.join ", " (List.map kindToStr e.kind)
        , text <| "meaning: " ++ e.meaning
        , case e.abr of
            Just abr ->
                text <| "abbr: " ++ abr

            Nothing ->
                Element.none
        ]


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { data = Dict.empty
      , rawData = ""
      , requested = Set.empty
      , parsingErrors = []
      , searchInput = Nothing
      , searchResult = []
      , searchRawResult = []
      , maxLineLength = 0
      }
    , Cmd.none
    )


nbrFiles =
    50


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
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
                        --    ( errors, entries ) =
                        --        String.lines str
                        --            |> List.foldr
                        --                (\s ( errs, es ) ->
                        --                    case parseEntry s of
                        --                        Ok e ->
                        --                            ( errs, e :: es )
                        --                        Err err ->
                        --                            ( ( s, err ) :: errs, es )
                        --                )
                        --                ( [], [] )
                        --    newData =
                        --        List.foldr
                        --            (\e acc ->
                        --                Dict.update
                        --                    e.key
                        --                    (\mbv ->
                        --                        case mbv of
                        --                            Just v ->
                        --                                Just <| e :: v
                        --                            Nothing ->
                        --                                Just [ e ]
                        --                    )
                        --                    acc
                        --            )
                        --            model.data
                        --            entries
                        maxLineLength =
                            String.lines str
                                |> List.foldr (\s acc -> max (String.length s) acc) model.maxLineLength
                    in
                    ( { model
                        | data = Dict.empty --newData
                        , rawData = model.rawData ++ String.cons '\n' str

                        --, parsingErrors = errors ++ model.parsingErrors
                        , requested = Set.remove path model.requested
                        , maxLineLength = maxLineLength
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
                decodeDataFromIndexedDb =
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
            case D.decodeValue decodeDataFromIndexedDb value of
                Ok (IndexedDbData { filename, content }) ->
                    let
                        maxLineLength =
                            String.lines content
                                |> List.foldr
                                    (\s acc -> max (String.length s) acc)
                                    model.maxLineLength
                    in
                    ( { model
                        | data = Dict.empty
                        , rawData = model.rawData ++ String.cons '\n' content
                        , requested = Set.remove filename model.requested
                        , maxLineLength = maxLineLength
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

                        --searchRawResult =
                        --    String.indexes s model.rawData
                        --        |> List.map getMatch
                        --        |> List.map (parseEntry >> Result.toMaybe)
                        --        |> List.filterMap identity
                        --        |> List.sortBy (\e -> sift3Distance e.key s)
                        --searchRawResult =
                        --    case parseEntries s model.rawData of
                        --        Ok res ->
                        --            List.sortBy (\e -> sift3Distance e.key s) res
                        --        Err _ ->
                        --            []
                        searchRawResult =
                            String.indexes s model.rawData
                                |> List.map (\n -> String.slice (n - model.maxLineLength) (n + model.maxLineLength) model.rawData)
                                |> List.map String.lines
                                |> List.map (List.filter (String.contains s))
                                |> List.map (List.head >> Maybe.withDefault "")
                                |> Set.fromList
                                |> Set.toList
                                |> List.map (parseEntry >> Result.toMaybe)
                                |> List.filterMap identity
                                |> List.sortBy (\e -> sift3Distance e.key s)
                    in
                    ( { model
                        | searchResult =
                            Dict.get s model.data |> Maybe.withDefault []
                        , searchRawResult = searchRawResult
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
        |= (getChompedString <|
                succeed ()
                    |. chompWhile (\c -> c /= ' ' && c /= '/')
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
                [ row
                    [ spacing 15 ]
                    [ Input.text
                        []
                        { onChange = SearchInput
                        , text = model.searchInput |> Maybe.withDefault ""
                        , placeholder = Nothing
                        , label = Input.labelHidden "searchInput"
                        }
                    , Input.button
                        []
                        { onPress = Just Search
                        , label = text <| "search"
                        }
                    ]
                , column
                    [ spacing 15 ]
                    (List.map entryView model.searchResult)
                , column
                    [ spacing 15 ]
                    (List.map entryView model.searchRawResult)
                , Input.button
                    []
                    { onPress = Just GetData
                    , label = text <| "get Data"
                    }
                , text <| String.fromInt (Set.size model.requested)
                , text <| String.fromInt model.maxLineLength

                --, text <|
                --    if Set.size model.requested > 0 then
                --        "processing..."
                --    else
                --        String.fromInt (List.length model.parsingErrors)
                --, text <|
                --    if Set.size model.requested > 0 then
                --        "processing..."
                --    else
                --        String.fromInt (Dict.size model.data)
                --, text <|
                --    if Set.size model.requested > 0 then
                --        "processing..."
                --    else
                --        String.fromInt
                --            (Dict.foldr
                --                (\k v acc -> List.length v + acc)
                --                0
                --                model.data
                --            )
                --, if Set.size model.requested > 0 then
                --    Element.none
                --  else
                --    column [ spacing 15 ]
                --        (List.take 10 model.parsingErrors
                --            |> List.map (\( s, es ) -> s)
                --            --(s,List.map Debug.toString)
                --            |> List.map (\s -> row [] [ text s ])
                --        )
                ]
            )
        ]
    }


main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


subscriptions model =
    Sub.batch
        [ loadedFromIndexedDb GotDataFromIndexedDb ]


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
