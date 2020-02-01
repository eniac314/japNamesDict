module Common exposing (..)

import Codec exposing (..)
import Parser exposing (..)


type Worker
    = NameDictWorker
    | DictWorker
    | KanjiDictWorker


workerCodec =
    Codec.custom
        (\fNameDictWorker fDictWorker fKanjiDictWorker value ->
            case value of
                NameDictWorker ->
                    fNameDictWorker

                DictWorker ->
                    fDictWorker

                KanjiDictWorker ->
                    fKanjiDictWorker
        )
        |> Codec.variant0 "NameDictWorker" NameDictWorker
        |> Codec.variant0 "DictWorker" DictWorker
        |> Codec.variant0 "KanjiDictWorker" KanjiDictWorker
        |> Codec.buildCustom


type WorkerMsg
    = LoadingStatusMsg
        Worker
        { progress : Int
        , message : String
        , status : Status
        }
    | SearchResultMsg SearchResultMeta


workerMsgCodec =
    Codec.custom
        (\fLoadingStatusMsg fSearchResultMsg value ->
            case value of
                LoadingStatusMsg w s ->
                    fLoadingStatusMsg w s

                SearchResultMsg m ->
                    fSearchResultMsg m
        )
        |> Codec.variant2 "LoadingStatusMsg"
            LoadingStatusMsg
            workerCodec
            (Codec.object (\p m s -> { progress = p, message = m, status = s })
                |> Codec.field "progress" .progress Codec.int
                |> Codec.field "message" .message Codec.string
                |> Codec.field "status" .status statusCodec
                |> Codec.buildObject
            )
        |> Codec.variant1 "SearchResultMsg" SearchResultMsg searchResultMetaCodec
        |> Codec.buildCustom


type alias SearchResultMeta =
    { searchString : String
    , result : SearchResult
    }


searchResultMetaCodec =
    Codec.object SearchResultMeta
        |> Codec.field "searchString" .searchString Codec.string
        |> Codec.field "result" .result searchResultCodec
        |> Codec.buildObject


type SearchResult
    = NameDictResult (List NameDictEntry)
    | DictResult (List DictEntry)
    | KanjiDictResult (List KanjiDictEntry)


searchResultCodec =
    Codec.custom
        (\fNameDictResult fDictResult fKanjiDictResult value ->
            case value of
                NameDictResult xs ->
                    fNameDictResult xs

                DictResult xs ->
                    fDictResult xs

                KanjiDictResult xs ->
                    fKanjiDictResult xs
        )
        |> Codec.variant1 "NameDictResult" NameDictResult (Codec.list nameDictEntryCodec)
        |> Codec.variant1 "DictResult" DictResult (Codec.list dictEntryCodec)
        |> Codec.variant1 "KanjiDictResult" KanjiDictResult (Codec.list kanjiDictEntryCodec)
        |> Codec.buildCustom


type WorkerCmd
    = SearchCmd String
    | LoadAssets


workerCmdCodec =
    Codec.custom
        (\fSearchCmd fLoadAssets value ->
            case value of
                SearchCmd s ->
                    fSearchCmd s

                LoadAssets ->
                    fLoadAssets
        )
        |> Codec.variant1 "SearchCmd" SearchCmd Codec.string
        |> Codec.variant0 "LoadAssets" LoadAssets
        |> Codec.buildCustom


type Status
    = Initial
    | Pending
    | Success
    | Failure


statusCodec =
    Codec.custom
        (\fInitial fPending fSuccess fFailure value ->
            case value of
                Initial ->
                    fInitial

                Pending ->
                    fPending

                Success ->
                    fSuccess

                Failure ->
                    fFailure
        )
        |> Codec.variant0 "Initial" Initial
        |> Codec.variant0 "Pending" Pending
        |> Codec.variant0 "Success" Success
        |> Codec.variant0 "Failure" Failure
        |> Codec.buildCustom


type alias NameDictEntry =
    { key : String
    , reading : Maybe String
    , kind : List NameKind
    , meaning : String
    , abr : Maybe String
    }


nameDictEntryCodec : Codec NameDictEntry
nameDictEntryCodec =
    Codec.object NameDictEntry
        |> Codec.field "key" .key Codec.string
        |> Codec.field "reading" .reading (Codec.maybe Codec.string)
        |> Codec.field "kind" .kind (Codec.list nameKindCodec)
        |> Codec.field "meaning" .meaning Codec.string
        |> Codec.field "abr" .abr (Codec.maybe Codec.string)
        |> Codec.buildObject


type NameKind
    = Person
    | Female
    | Surname
    | Fullname
    | Given
    | Place
    | Station
    | Organisation
    | Product
    | Company
    | Unknown


nameKindCodec : Codec NameKind
nameKindCodec =
    Codec.custom
        (\fPerson fFemale fSurname fFullname fGiven fPlace fStation fOrganisation fProduct fCompany fUnknown value ->
            case value of
                Person ->
                    fPerson

                Female ->
                    fFemale

                Surname ->
                    fSurname

                Fullname ->
                    fFullname

                Given ->
                    fGiven

                Place ->
                    fPlace

                Station ->
                    fStation

                Organisation ->
                    fOrganisation

                Product ->
                    fProduct

                Company ->
                    fCompany

                Unknown ->
                    fUnknown
        )
        |> Codec.variant0 "Person" Person
        |> Codec.variant0 "Female" Female
        |> Codec.variant0 "Surname" Surname
        |> Codec.variant0 "Fullname" Fullname
        |> Codec.variant0 "Given" Given
        |> Codec.variant0 "Place" Place
        |> Codec.variant0 "Station" Station
        |> Codec.variant0 "Organisation" Organisation
        |> Codec.variant0 "Product" Product
        |> Codec.variant0 "Company" Company
        |> Codec.variant0 "Unknown" Unknown
        |> Codec.buildCustom


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

        "g" ->
            Given

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

        Given ->
            "Given"

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


type alias DictEntry =
    { key : String
    , reading : Maybe String
    , meanings : List String
    }



--type alias DictMeaning =
--    { kinds : List NameKind
--    , synonyms : List String
--    }


dictEntryCodec : Codec DictEntry
dictEntryCodec =
    Codec.object DictEntry
        |> Codec.field "key" .key Codec.string
        |> Codec.field "reading" .reading (Codec.maybe Codec.string)
        |> Codec.field "meanings" .meanings (Codec.list Codec.string)
        |> Codec.buildObject



-------------------------------------------------------------------------------


hiragana =
    List.range 0x3040 0x309F
        |> List.map Char.fromCode


katakana =
    List.range 0x30A0 0x30FF
        |> List.map Char.fromCode


kana =
    hiragana ++ katakana


kanji =
    List.range 0x4E00 0x9FBF
        |> List.map Char.fromCode



-------------------------------------------------------------------------------


type alias KanjiDictEntry =
    { key : String
    , meta : KanjiMeta
    , onYomi : List String
    , kunYomi : List String
    , nanori : List String
    , meanings : List String
    }


kanjiDictEntryCodec : Codec KanjiDictEntry
kanjiDictEntryCodec =
    Codec.object KanjiDictEntry
        |> Codec.field "key" .key Codec.string
        |> Codec.field "meta" .meta kanjiMetaCodec
        |> Codec.field "onYomi" .onYomi (Codec.list Codec.string)
        |> Codec.field "kunYomi" .kunYomi (Codec.list Codec.string)
        |> Codec.field "nanori" .nanori (Codec.list Codec.string)
        |> Codec.field "meanings" .meanings (Codec.list Codec.string)
        |> Codec.buildObject


type alias KanjiMeta =
    { radical : Maybe Int
    , grade : Maybe Int
    , strokes : Maybe Int
    , frequency : Maybe Int
    , classicNelson : Maybe Int
    , newNelson : Maybe Int
    , halpern : Maybe Int
    , henshall : Maybe Int
    , skip : Maybe ( Int, Int, Int )
    , pinyin : Maybe ( String, Int )
    , kanjiKentei : Maybe Int
    }


kanjiMetaCodec : Codec KanjiMeta
kanjiMetaCodec =
    Codec.object KanjiMeta
        |> Codec.field "radical" .radical (Codec.maybe Codec.int)
        |> Codec.field "grade" .grade (Codec.maybe Codec.int)
        |> Codec.field "strokes" .strokes (Codec.maybe Codec.int)
        |> Codec.field "frequency" .frequency (Codec.maybe Codec.int)
        |> Codec.field "classicNelson" .classicNelson (Codec.maybe Codec.int)
        |> Codec.field "newNelson" .newNelson (Codec.maybe Codec.int)
        |> Codec.field "halpern" .halpern (Codec.maybe Codec.int)
        |> Codec.field "henshall" .henshall (Codec.maybe Codec.int)
        |> Codec.field "skip" .skip (Codec.maybe (Codec.triple Codec.int Codec.int Codec.int))
        |> Codec.field "pinyin" .pinyin (Codec.maybe (Codec.tuple Codec.string Codec.int))
        |> Codec.field "kanjiKentei" .kanjiKentei (Codec.maybe Codec.int)
        |> Codec.buildObject


defaultMeta =
    { radical = Nothing
    , grade = Nothing
    , strokes = Nothing
    , frequency = Nothing
    , classicNelson = Nothing
    , newNelson = Nothing
    , halpern = Nothing
    , henshall = Nothing
    , skip = Nothing
    , pinyin = Nothing
    , kanjiKentei = Nothing
    }
