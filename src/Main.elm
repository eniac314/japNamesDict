port module Main exposing (..)

import Browser
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


port fromDicts : (D.Value -> msg) -> Sub msg


port serviceWorkerMessage : (String -> msg) -> Sub msg


type alias Model =
    { searchInput : Maybe String
    , nameDictSearchResult : { res : List NameDictEntry, showing : Int }
    , dictSearchResult : { res : List DictEntry, showing : Int }
    , workersState : { nameDict : WorkerState, dict : WorkerState }
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
    let
        ids =
            List.range 0 (nbrFiles - 1)
    in
    ( { searchInput = Nothing
      , nameDictSearchResult = { res = [], showing = 15 }
      , dictSearchResult = { res = [], showing = 15 }
      , workersState =
            { nameDict = WorkerLoading { progress = 0, message = "", status = Initial }
            , dict = WorkerLoading { progress = 0, message = "", status = Initial }
            }
      , appState = Loading Initial
      , lastInputTimestamp = Nothing
      , useAutoSearch = True
      , serviceWorkerMessages = []
      }
    , Cmd.batch
        []
    )


nbrFiles =
    50


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
                        update Search { model | lastInputTimestamp = Nothing }

                    else
                        ( model, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

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
            in
            ( { model
                | appState =
                    case ( workersState.nameDict, workersState.dict ) of
                        ( WorkerLoading st, WorkerLoading st_ ) ->
                            case ( st.status, st_.status ) of
                                ( Success, Success ) ->
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
                case result of
                    NameDictResult xs ->
                        ( { model | nameDictSearchResult = { res = xs, showing = 15 } }, Cmd.none )

                    DictResult xs ->
                        ( { model | dictSearchResult = { res = xs, showing = 15 } }, Cmd.none )

            else
                ( model, Cmd.none )

        Search ->
            case model.searchInput of
                Just s ->
                    ( model
                    , Cmd.batch
                        [ Codec.encoder workerCmdCodec (SearchCmd s)
                            |> toNameDict
                        , Codec.encoder workerCmdCodec (SearchCmd s)
                            |> toDict
                        ]
                    )

                Nothing ->
                    ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


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

        --, onAnimationFrame Tick
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
    in
    column
        [ spacing 15 ]
        [ nameDictProgress
            |> progressBar
            |> el [ centerX ]
        , el [ Font.size 14 ] (text <| nameDictMessage)
        , dictProgress
            |> progressBar
            |> el [ centerX ]
        , el [ Font.size 14 ] (text <| dictMessage)
        , column
            [ Font.size 12 ]
            (List.map text model.serviceWorkerMessages
                |> List.reverse
            )

        --, if status == Failure then
        --    Input.button
        --        []
        --        { onPress = Just GetData
        --        , label = text <| "reload data"
        --        }
        --else
        --  Element.none
        ]


searchView model =
    let
        nameDictResults =
            List.take model.nameDictSearchResult.showing model.nameDictSearchResult.res

        dictResults =
            List.take model.dictSearchResult.showing model.dictSearchResult.res
    in
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
            (List.indexedMap (Lazy.lazy2 nameEntryView) nameDictResults)
        , column
            [ width fill ]
            (List.indexedMap (Lazy.lazy2 dictEntryView) dictResults)
        ]


dictEntryView : Int -> DictEntry -> Element Msg
dictEntryView n e =
    column
        [ width fill
        , spacing 10
        , padding 10
        , Background.color
            (if modBy 2 n == 0 then
                rgba255 187 110 217 0.6

             else
                rgba255 215 77 215 0.6
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
        , column [ Font.size 15 ] (List.map text e.meanings)
        ]


nameEntryView : Int -> NameDictEntry -> Element Msg
nameEntryView n e =
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
