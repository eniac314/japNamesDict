port module Worker exposing (..)

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
import Time exposing (..)


port outbound : E.Value -> Cmd msg


port inbound : (D.Value -> msg) -> Sub msg


type alias Model =
    { rawData : String
    , toRequest : Set String
    , pendingRequests : Set String
    , maxLineLength : Int
    , pathbase : String
    , nbrFiles : Int
    }


type Msg
    = GetData
    | GotRemoteData String (Result Http.Error String)
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
    { pathbase : String
    , nbrFiles : Int
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        ids =
            List.range 0 (flags.nbrFiles - 1)

        pendingRequests =
            List.map (dataPath flags.pathbase)
                (List.take nbrConcurentRequest ids)
    in
    ( { rawData = ""
      , toRequest = Set.fromList (List.map (dataPath flags.pathbase) ids)
      , pendingRequests =
            pendingRequests
                |> Set.fromList
      , maxLineLength = 0
      , pathbase = flags.pathbase
      , nbrFiles = flags.nbrFiles
      }
    , pendingRequests
        |> List.map getData
        |> Cmd.batch
    )


nbrConcurentRequest =
    5


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GetData ->
            let
                ids =
                    List.range 0 (model.nbrFiles - 1)
            in
            ( { model | toRequest = Set.fromList (List.map (dataPath model.pathbase) ids) }
            , List.map (dataPath model.pathbase) ids
                |> List.map getData
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

                        toRequest =
                            Set.remove path model.toRequest

                        pendingRequests =
                            if Set.remove path model.pendingRequests == empty then
                                List.take nbrConcurentRequest (Set.toList toRequest)
                                    |> Set.fromList

                            else
                                Set.remove path model.pendingRequests
                    in
                    ( { model
                        | rawData = model.rawData ++ String.cons '\n' str
                        , toRequest = toRequest
                        , pendingRequests = pendingRequests
                        , maxLineLength = maxLineLength
                      }
                    , Cmd.batch
                        [ { progress = round <| 100 * toFloat (model.nbrFiles - Set.size toRequest) / toFloat model.nbrFiles
                          , message = "Loaded " ++ filename ++ " from network"
                          , status =
                                if toRequest == Set.empty then
                                    Success

                                else
                                    Pending
                          }
                            |> LoadingStatusMsg (getWorker model.pathbase)
                            |> Codec.encoder workerMsgCodec
                            |> outbound
                        , if Set.size pendingRequests == nbrConcurentRequest then
                            Set.toList pendingRequests
                                |> List.map getData
                                |> Cmd.batch

                          else
                            Cmd.none
                        ]
                    )

                Err _ ->
                    ( model
                    , { progress = round <| 100 * toFloat (model.nbrFiles - Set.size model.toRequest) / toFloat model.nbrFiles
                      , message = "Network Error: " ++ path
                      , status =
                            Pending
                      }
                        |> LoadingStatusMsg (getWorker model.pathbase)
                        |> Codec.encoder workerMsgCodec
                        |> outbound
                    )

        Search s ->
            case getWorker model.pathbase of
                KanjiDictWorker ->
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

                DictWorker ->
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
                                |> List.map (parseDictEntry >> Result.toMaybe)
                                |> List.filterMap identity
                                |> (if List.all Char.isAlphaNum (String.toList s) then
                                        List.filter
                                            (\e ->
                                                List.member (String.toLower s)
                                                    (List.concatMap (String.words << String.toLower) e.meanings)
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
                            , result = DictResult searchResult
                            }
                        )
                        |> outbound
                    )

                NameDictWorker ->
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
        [ inbound
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


dataPath basePath id =
    "/data/"
        ++ basePath
        ++ (String.fromInt id
                |> String.padLeft 2 '0'
           )
        ++ ".dat"


getWorker basePath =
    if
        basePath
            == "kanji"
    then
        KanjiDictWorker

    else if
        basePath
            == "names"
    then
        NameDictWorker

    else
        DictWorker


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



-----------------------------------------------------------------------------------


parseDictEntry e =
    Parser.run dictEntryParser e


dictEntryParser =
    succeed DictEntry
        |= keyParser
        |= readingParser
        |. symbol "/"
        |= synonymsParser
        |> Parser.map
            (\e -> { e | meanings = groupMeanings e.meanings })


synonymsParser =
    let
        meaningParser_ =
            succeed identity
                |. spaces
                |= (getChompedString <|
                        succeed ()
                            |. chompWhile (\c -> c /= '/')
                   )
                |. spaces

        go xs =
            Parser.oneOf
                [ backtrackable <|
                    succeed (\match -> Loop (match :: xs))
                        |= meaningParser_
                        |. symbol "/"
                , succeed ()
                    |> Parser.map (\_ -> Done (List.reverse xs))
                ]
    in
    Parser.loop
        []
        go



---------------------


meaningNbrParser n =
    succeed ()
        |. spaces
        |. symbol "("
        |. token (String.fromInt n)
        |. symbol ")"


nbrMeaningParser n =
    succeed (\l nbr r -> l ++ " " ++ nbr ++ " " ++ r)
        |= getChompedString
            (succeed
                identity
                |. symbol "("
                |. (getChompedString <|
                        succeed ()
                            |. chompWhile (\c -> Char.isAlphaNum c || c == ',' || c == '-')
                   )
                |. symbol ")"
            )
        |= getChompedString (meaningNbrParser n)
        |= meaningParser


groupMeanings xs =
    let
        ( ( _, last ), rest, isNumbered ) =
            List.foldl
                (\x ( ( n, currentMeaning ), res, isNumbered_ ) ->
                    case ( Parser.run (nbrMeaningParser n) x, currentMeaning ) of
                        ( Ok valid, "" ) ->
                            ( ( n + 1, valid ), res, True )

                        ( Ok valid, rs ) ->
                            ( ( n + 1, valid ), res ++ [ currentMeaning ], True )

                        ( Err _, _ ) ->
                            case ( Parser.run meaningParser x, currentMeaning ) of
                                ( Ok valid, "" ) ->
                                    ( ( n, "" ), res ++ [ valid ], isNumbered_ )

                                ( Ok valid, rs ) ->
                                    ( ( n, rs ++ ", " ++ valid ), res, isNumbered_ )

                                _ ->
                                    ( ( n, currentMeaning ), res, isNumbered_ )
                )
                ( ( 1, "" ), [], False )
                xs

        result =
            if last == "" then
                rest

            else
                rest ++ [ last ]
    in
    if isNumbered then
        result

    else
        [ String.join ", " result ]
