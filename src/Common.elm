module Common exposing (..)

import Codec exposing (..)


type Worker
    = NameDictWorker
    | DictWorker


workerCodec =
    Codec.custom
        (\fNameDictWorker fDictWorker value ->
            case value of
                NameDictWorker ->
                    fNameDictWorker

                DictWorker ->
                    fDictWorker
        )
        |> Codec.variant0 "NameDictWorker" NameDictWorker
        |> Codec.variant0 "DictWorker" DictWorker
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


searchResultCodec =
    Codec.custom
        (\fNameDictResult fDictResult value ->
            case value of
                NameDictResult xs ->
                    fNameDictResult xs

                DictResult xs ->
                    fDictResult xs
        )
        |> Codec.variant1 "NameDictResult" NameDictResult (Codec.list nameDictEntryCodec)
        |> Codec.variant1 "DictResult" DictResult (Codec.list dictEntryCodec)
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
