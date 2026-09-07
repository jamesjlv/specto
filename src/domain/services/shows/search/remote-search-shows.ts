import { TMultipleShowSearch } from "@/domain/models";

interface ISearchShowsService {
  exec: (params: SearchShowsServiceNamespace.Params) => Promise<SearchShowsServiceNamespace.Model>;
}

export namespace SearchShowsServiceNamespace {
  export type Params = { q?: string };

  export type Model = TMultipleShowSearch;

  export type Interface = ISearchShowsService;
}
