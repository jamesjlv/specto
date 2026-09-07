import { TSearchPeople } from "@/domain/models";

interface ISearchPeopleService {
  exec: (params: SearchPeopleServiceNamespace.Params) => Promise<SearchPeopleServiceNamespace.Model>;
}

export namespace SearchPeopleServiceNamespace {
  export type Params = { q?: string };

  export type Model = TSearchPeople;

  export type Interface = ISearchPeopleService;
}
