import { IFullScheduleItem } from "@/domain/models";

interface IGetShowScheduleService {
  exec: (params: GetShowScheduleServiceNamespace.Params) => Promise<GetShowScheduleServiceNamespace.Model>;
}

export namespace GetShowScheduleServiceNamespace {
  export type Params = { full?: boolean; web?: boolean; country?: string; date?: string };

  export type Model = IFullScheduleItem;

  export type Interface = IGetShowScheduleService;
}
