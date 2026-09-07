import { IShowSeason } from "@/domain/models";

interface IGetShowSeasonsService {
  exec: (params: GetShowSeasonsServiceNamespace.Params) => Promise<GetShowSeasonsServiceNamespace.Model>;
}

export namespace GetShowSeasonsServiceNamespace {
  export type Params = { specials?: string };

  export type Model = IShowSeason[];

  export type Interface = IGetShowSeasonsService;
}
