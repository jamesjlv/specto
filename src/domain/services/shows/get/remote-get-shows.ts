import { IShow } from "@/domain/models";

interface IGetShowsService {
  exec: (params: GetShowsServiceNamespace.Params) => Promise<GetShowsServiceNamespace.Model>;
}

export namespace GetShowsServiceNamespace {
  export type Params = { page?: number };

  export type Model = IShow[];

  export type Interface = IGetShowsService;
}
