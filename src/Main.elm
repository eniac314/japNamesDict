port module Main exposing (..)

import Browser
import Browser.Dom exposing (getElement, setViewport)
import Browser.Events exposing (onAnimationFrame)
import Codec exposing (decoder, encoder)
import Common exposing (..)
import Dict exposing (..)
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Element.Lazy as Lazy
import Html.Attributes as HtmlAttr
import Http exposing (..)
import Json.Decode as D
import Json.Encode as E
import Parser exposing (..)
import Set exposing (..)
import String.Extra exposing (leftOf, rightOfBack)
import StringDistance exposing (sift3Distance)
import Task exposing (perform)
import Time exposing (..)


port toNameDict : E.Value -> Cmd msg


port toDict : E.Value -> Cmd msg


port toKanjiDict : E.Value -> Cmd msg


port fromDicts : (D.Value -> msg) -> Sub msg


port serviceWorkerMessage : (String -> msg) -> Sub msg


type alias Model =
    { searchInput : Maybe String
    , nameDictSearchResult : { res : List NameDictEntry, showing : Int }
    , dictSearchResult : { res : List DictEntry, showing : Int }
    , kanjiDictSearchResult : { res : List KanjiDictEntry, showing : Int }
    , workersState : { nameDict : WorkerState, dict : WorkerState, kanjiDict : WorkerState }
    , appState : AppState
    , lastInputTimestamp : Maybe Time.Posix
    , useAutoSearch : Bool
    , serviceWorkerMessages : List String
    }


type WorkerState
    = WorkerLoading
        { progress : Int
        , message : String
        , status : Status
        }
    | WorkerSearching Status


type AppState
    = Loading Status
    | Ready


type Msg
    = SearchInput String
    | SetTimeStamp Time.Posix
    | Tick Time.Posix
    | ScrollTo String
    | ShowMore Worker
    | GotServiceWorkerMsg String
    | ProcessLoadingStatus
        Worker
        { progress : Int
        , message : String
        , status : Status
        }
    | ProcessSearchResult SearchResultMeta
    | Search
    | NoOp


type alias Flags =
    ()


main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { searchInput = Nothing
      , nameDictSearchResult = { res = [], showing = 15 }
      , dictSearchResult = { res = [], showing = 15 }
      , kanjiDictSearchResult = { res = [], showing = 15 }
      , workersState =
            { nameDict = WorkerLoading { progress = 0, message = "", status = Initial }
            , dict = WorkerLoading { progress = 0, message = "", status = Initial }
            , kanjiDict = WorkerLoading { progress = 0, message = "", status = Initial }
            }
      , appState = Loading Initial
      , lastInputTimestamp = Nothing
      , useAutoSearch = True
      , serviceWorkerMessages = []
      }
    , Cmd.batch
        []
    )


dashboardHeight =
    120


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SearchInput s ->
            ( { model
                | searchInput =
                    if s == "" then
                        Nothing

                    else
                        Just s
              }
            , Task.perform SetTimeStamp Time.now
            )

        SetTimeStamp t ->
            ( { model | lastInputTimestamp = Just t }, Cmd.none )

        Tick t ->
            case model.lastInputTimestamp of
                Just t1 ->
                    if Time.posixToMillis t - Time.posixToMillis t1 > 300 then
                        case Maybe.map String.toList model.searchInput of
                            Just (c :: cs) ->
                                if List.member c kanji then
                                    update Search { model | lastInputTimestamp = Nothing }

                                else if List.all Char.isAlphaNum cs && (List.length cs > 3) then
                                    update Search { model | lastInputTimestamp = Nothing }

                                else if List.length cs > 1 then
                                    update Search { model | lastInputTimestamp = Nothing }

                                else
                                    ( { model | lastInputTimestamp = Nothing }, Cmd.none )

                            _ ->
                                ( { model | lastInputTimestamp = Nothing }, Cmd.none )

                    else
                        ( model, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

        ScrollTo id ->
            ( model, scrollTo id )

        ShowMore w ->
            case w of
                NameDictWorker ->
                    let
                        x =
                            model.nameDictSearchResult
                    in
                    ( { model
                        | nameDictSearchResult = { x | showing = x.showing + 15 }
                      }
                    , Cmd.none
                    )

                DictWorker ->
                    let
                        x =
                            model.dictSearchResult
                    in
                    ( { model
                        | dictSearchResult = { x | showing = x.showing + 15 }
                      }
                    , Cmd.none
                    )

                KanjiDictWorker ->
                    let
                        x =
                            model.kanjiDictSearchResult
                    in
                    ( { model
                        | kanjiDictSearchResult = { x | showing = x.showing + 15 }
                      }
                    , Cmd.none
                    )

        GotServiceWorkerMsg message ->
            ( { model | serviceWorkerMessages = message :: model.serviceWorkerMessages }
            , Cmd.none
            )

        ProcessLoadingStatus w s ->
            let
                cws =
                    model.workersState

                workersState =
                    case w of
                        NameDictWorker ->
                            { cws | nameDict = WorkerLoading s }

                        DictWorker ->
                            { cws | dict = WorkerLoading s }

                        KanjiDictWorker ->
                            { cws | kanjiDict = WorkerLoading s }
            in
            ( { model
                | appState =
                    case ( workersState.nameDict, workersState.dict, workersState.dict ) of
                        ( WorkerLoading st1, WorkerLoading st2, WorkerLoading st3 ) ->
                            case ( st1.status, st2.status, st3.status ) of
                                ( Success, Success, Success ) ->
                                    Ready

                                _ ->
                                    model.appState

                        _ ->
                            model.appState
                , workersState = workersState
              }
            , Cmd.none
            )

        ProcessSearchResult { searchString, result } ->
            if Just searchString == model.searchInput then
                let
                    wcs =
                        model.workersState
                in
                case result of
                    NameDictResult xs ->
                        ( { model
                            | nameDictSearchResult = { res = xs, showing = 15 }
                            , workersState = { wcs | nameDict = WorkerSearching Success }
                          }
                        , Cmd.none
                        )

                    DictResult xs ->
                        ( { model
                            | dictSearchResult = { res = xs, showing = 15 }
                            , workersState = { wcs | dict = WorkerSearching Success }
                          }
                        , Cmd.none
                        )

                    KanjiDictResult xs ->
                        ( { model
                            | kanjiDictSearchResult = { res = xs, showing = 15 }
                            , workersState = { wcs | kanjiDict = WorkerSearching Success }
                          }
                        , Cmd.none
                        )

            else
                let
                    resetWorkerState =
                        { dict = WorkerSearching Initial
                        , nameDict = WorkerSearching Initial
                        , kanjiDict = WorkerSearching Initial
                        }
                in
                update Search { model | workersState = resetWorkerState }

        Search ->
            case ( model.searchInput, canSearch model ) of
                ( Just s, True ) ->
                    ( { model
                        | workersState =
                            { nameDict = WorkerSearching Pending
                            , dict = WorkerSearching Pending
                            , kanjiDict = WorkerSearching Pending
                            }
                      }
                    , Cmd.batch
                        [ Codec.encoder workerCmdCodec (SearchCmd s)
                            |> toNameDict
                        , Codec.encoder workerCmdCodec (SearchCmd s)
                            |> toDict
                        , Codec.encoder workerCmdCodec (SearchCmd s)
                            |> toKanjiDict
                        ]
                    )

                _ ->
                    ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


canSearch model =
    (model.workersState.nameDict
        /= WorkerSearching Pending
    )
        && (model.workersState.dict
                /= WorkerSearching Pending
           )
        && (model.workersState.kanjiDict
                /= WorkerSearching Pending
           )


subscriptions model =
    Sub.batch
        [ serviceWorkerMessage GotServiceWorkerMsg
        , case ( model.lastInputTimestamp, model.useAutoSearch ) of
            ( Just _, True ) ->
                onAnimationFrame Tick

            _ ->
                Sub.none
        , fromDicts
            (\c ->
                case D.decodeValue (Codec.decoder workerMsgCodec) c of
                    Ok (LoadingStatusMsg w s) ->
                        ProcessLoadingStatus w s

                    Ok (SearchResultMsg m) ->
                        ProcessSearchResult m

                    _ ->
                        NoOp
            )
        ]


view : Model -> Browser.Document Msg
view model =
    { title = ""
    , body =
        [ layout
            (case model.appState of
                Loading s ->
                    []

                Ready ->
                    [ inFront (searchDashboardview model) ]
            )
            (column
                [ width fill
                , centerX
                ]
                [ case model.appState of
                    Loading s ->
                        loadingView model s

                    Ready ->
                        searchResultView model
                ]
            )
        ]
    }


loadingView model status =
    let
        ( nameDictProgress, nameDictMessage ) =
            case model.workersState.nameDict of
                WorkerLoading s ->
                    ( s.progress, s.message )

                _ ->
                    ( 0, "" )

        ( dictProgress, dictMessage ) =
            case model.workersState.dict of
                WorkerLoading s ->
                    ( s.progress, s.message )

                _ ->
                    ( 0, "" )

        ( kanjiDictProgress, kanjiDictMessage ) =
            case model.workersState.kanjiDict of
                WorkerLoading s ->
                    ( s.progress, s.message )

                _ ->
                    ( 0, "" )
    in
    column
        [ spacing 15
        , padding 15
        , width fill
        ]
        [ nameDictProgress
            |> progressBar
            |> el [ centerX ]
        , el [ Font.size 14, centerX ] (text <| nameDictMessage)
        , dictProgress
            |> progressBar
            |> el [ centerX ]
        , el [ Font.size 14, centerX ] (text <| dictMessage)
        , kanjiDictProgress
            |> progressBar
            |> el [ centerX ]
        , el [ Font.size 14, centerX ] (text <| kanjiDictMessage)
        , column
            [ Font.size 12, centerX ]
            (List.map text model.serviceWorkerMessages
                |> List.reverse
            )
        ]


searchDashboardview model =
    let
        nbrMatchesNameDict =
            List.length model.nameDictSearchResult.res

        nbrMatchesDict =
            List.length model.dictSearchResult.res

        nbrMatchesKanjiDict =
            List.length model.kanjiDictSearchResult.res

        wcs =
            model.workersState

        nameDictSearchStatus =
            case wcs.nameDict of
                WorkerSearching s ->
                    s

                WorkerLoading s ->
                    s.status

        dictSearchStatus =
            case wcs.dict of
                WorkerSearching s ->
                    s

                WorkerLoading s ->
                    s.status

        kanjiDictSearchStatus =
            case wcs.kanjiDict of
                WorkerSearching s ->
                    s

                WorkerLoading s ->
                    s.status

        searchStatusBox s =
            el
                [ width (px 10)
                , height (px 10)
                , Border.rounded 10
                , Background.color <|
                    case s of
                        Pending ->
                            rgb255 255 127 0

                        Failure ->
                            rgb255 224 38 50

                        _ ->
                            rgba255 147 202 118 1
                ]
                Element.none
    in
    column
        [ width fill

        --, height (px dashboardHeight)
        , spacing 15
        , padding 15
        , Background.color (rgb255 255 255 255)
        ]
        [ row
            [ width fill
            , spacing 15
            , Font.size 14
            ]
            [ row
                [ spacing 10
                , Events.onClick (ScrollTo "nameDict")
                ]
                [ el [] (text "人名地名")
                , searchStatusBox nameDictSearchStatus
                , el [ Font.size 12 ] (text <| String.fromInt nbrMatchesNameDict)
                ]
            , row
                [ spacing 10
                , Events.onClick (ScrollTo "japDict")
                ]
                [ el [] (text "和英")
                , searchStatusBox dictSearchStatus
                , el [ Font.size 12 ] (text <| String.fromInt nbrMatchesDict)
                ]
            , row
                [ spacing 10
                , Events.onClick (ScrollTo "kanjiDict")
                ]
                [ el [] (text "漢字")
                , searchStatusBox kanjiDictSearchStatus
                , el [ Font.size 12 ] (text <| String.fromInt nbrMatchesKanjiDict)
                ]
            ]
        , row
            [ spacing 15
            , width fill
            ]
            [ Input.text
                [ padding 6 ]
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
        ]


searchResultView model =
    let
        nameDictResults =
            List.take model.nameDictSearchResult.showing model.nameDictSearchResult.res

        dictResults =
            List.take model.dictSearchResult.showing model.dictSearchResult.res

        kanjiDictResults =
            List.take model.kanjiDictSearchResult.showing model.kanjiDictSearchResult.res

        showMoreView res w =
            if (res.showing >= List.length res.res) || (List.length res.res == 0) then
                Element.none

            else
                row
                    [ padding 10
                    , width fill
                    ]
                    [ el
                        [ centerX
                        , Font.size 14
                        , Events.onClick (ShowMore w)
                        ]
                        (text "Show more")
                    ]
    in
    column
        [ width fill
        ]
        [ el [ width fill, height (px dashboardHeight) ] Element.none
        , column
            [ width fill
            , htmlAttribute <| HtmlAttr.id "nameDict"
            ]
            (List.indexedMap (Lazy.lazy2 nameEntryView) nameDictResults
                ++ [ showMoreView model.nameDictSearchResult NameDictWorker ]
            )
        , column
            [ width fill
            , htmlAttribute <| HtmlAttr.id "japDict"
            ]
            (List.indexedMap (Lazy.lazy2 dictEntryView) dictResults
                ++ [ showMoreView model.dictSearchResult DictWorker ]
            )
        , column
            [ width fill
            , htmlAttribute <| HtmlAttr.id "kanjiDict"
            ]
            (List.indexedMap (Lazy.lazy2 kanjiDictEntryView) kanjiDictResults
                ++ [ showMoreView model.kanjiDictSearchResult KanjiDictWorker ]
            )
        ]


dictEntryView : Int -> DictEntry -> Element Msg
dictEntryView n e =
    column
        [ width fill
        , spacing 10
        , padding 10
        , Background.color
            (if modBy 2 n == 0 then
                rgba255 253 222 165 1

             else
                rgba255 252 226 196 1
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
        , column
            [ Font.size 15 ]
            (List.map (\m -> paragraph [] [ text m ]) e.meanings)
        ]


nameEntryView : Int -> NameDictEntry -> Element Msg
nameEntryView n e =
    column
        [ width fill
        , spacing 10
        , padding 10
        , Background.color
            (if modBy 2 n == 0 then
                rgba255 221 220 214 1

             else
                rgba255 192 198 201 1
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


kanjiDictEntryView : Int -> KanjiDictEntry -> Element Msg
kanjiDictEntryView n e =
    let
        kunYomiView k =
            case String.split "." k of
                rad :: declension :: [] ->
                    row
                        [ Font.size 16, Font.bold ]
                        [ el [] (text rad)
                        , el [ Font.color (rgb255 127 127 127) ] (text declension)
                        ]

                _ ->
                    el [ Font.size 16, Font.bold ] (text k)

        onYomiView o =
            el [ Font.size 14 ] (text o)
    in
    column
        [ width fill
        , spacing 10
        , padding 10
        , Background.color
            (if modBy 2 n == 0 then
                rgba255 186 220 173 1

             else
                rgba255 147 202 118 1
            )
        ]
        [ wrappedRow
            [ width fill
            , spacing 15
            ]
            [ column
                [ padding 15 ]
                [ row
                    [ spacing 20 ]
                    [ el
                        [ Font.size 45
                        ]
                        (text e.key)
                    , column
                        [ spacing 15
                        , width (minimum 100 fill)
                        ]
                        [ wrappedRow
                            [ spacing 15 ]
                            (List.map onYomiView e.onYomi)
                        , wrappedRow
                            [ spacing 15 ]
                            (List.map kunYomiView e.kunYomi)
                        ]
                    ]
                ]
            , paragraph [ Font.size 14 ] [ text (String.join ", " e.meanings) ]
            ]
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


scrollTo : String -> Cmd Msg
scrollTo destId =
    getElement destId
        |> Task.andThen
            (\el ->
                setViewport
                    0
                    (el.element.y
                        - dashboardHeight
                    )
            )
        |> Task.attempt (\_ -> NoOp)
