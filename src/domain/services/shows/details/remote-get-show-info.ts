import { IShow } from "@/domain/models";

interface IGetShowInfoService {
  exec: (params: GetShowInfoServiceNamespace.Params) => Promise<GetShowInfoServiceNamespace.Model>;
}

export namespace GetShowInfoServiceNamespace {
  export type Params = { embed?: string };

  export type Model = IShow;

  export type Interface = IGetShowInfoService;
}
