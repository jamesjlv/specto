import { IEpisode } from "@/domain/models";

interface IGetShowEpisodesService {
  exec: (params: GetShowEpisodeServiceNamespace.Params) => Promise<GetShowEpisodeServiceNamespace.Model>;
}

export namespace GetShowEpisodeServiceNamespace {
  export type Params = { specials?: string };

  export type Model = IEpisode[];

  export type Interface = IGetShowEpisodesService;
}
