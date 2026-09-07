import { TShowCrew } from "@/domain/models";

interface IShowCrewService {
  exec: (params: GetShowCrewServiceNamespace.Params) => Promise<GetShowCrewServiceNamespace.Model>;
}

export namespace GetShowCrewServiceNamespace {
  export type Params = { q?: string };

  export type Model = TShowCrew;

  export type Interface = IShowCrewService;
}
