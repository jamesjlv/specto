import { TSearchPeople } from "@/domain/models";

interface IShowCastService {
  exec: (params: GetShowCastServiceNamespace.Params) => Promise<GetShowCastServiceNamespace.Model>;
}

export namespace GetShowCastServiceNamespace {
  export type Params = { q?: string };

  export type Model = TSearchPeople;

  export type Interface = IShowCastService;
}
