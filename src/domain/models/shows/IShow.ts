export interface ILink {
  href: string;
  name?: string;
}

export interface ILinks {
  self: ILink;
  show?: ILink;
  previousepisode?: ILink;
  nextepisode?: ILink;
}

export interface IImage {
  medium: string;
  original: string;
}

export interface ICountry {
  name: string;
  code: string;
  timezone: string;
}

export interface IRating {
  average: number | null;
}

export interface ISchedule {
  time: string;
  days: string[];
}

export interface IExternals {
  tvrage: number | null;
  thetvdb: number | null;
  imdb: string | null;
}

export interface INetwork {
  id: number;
  name: string;
  country: ICountry | null;
  officialSite: string | null;
}

export interface IPerson {
  id: number;
  url: string;
  name: string;
  country: ICountry | null;
  birthday: string | null;
  deathday: string | null;
  gender: string | null;
  image: IImage | null;
  updated: number;
  _links: Pick<ILinks, "self">;
}

export interface ICharacter {
  id: number;
  url: string;
  name: string;
  image: IImage | null;
  _links: Pick<ILinks, "self">;
}

export interface IEpisode {
  id: number;
  url: string;
  name: string;
  season: number;
  number: number | null;
  type: string;
  airdate: string;
  airtime: string;
  airstamp: string;
  runtime: number | null;
  rating: IRating;
  image: IImage | null;
  summary: string | null;
  _links: Pick<ILinks, "self" | "show">;
}

export interface IShow {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string | null;
  genres: string[];
  status: string;
  runtime: number | null;
  averageRuntime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  schedule: ISchedule;
  rating: IRating;
  weight: number;
  network: INetwork | null;
  webChannel: INetwork | null;
  dvdCountry: ICountry | null;
  externals: IExternals;
  image: IImage | null;
  summary: string | null;
  updated: number;
  _links: ILinks;
}

export interface IScheduledEpisode extends IEpisode {
  _embedded: {
    show: IShow;
  };
}

export interface IShowCrewItem {
  type: string;
  person: IPerson;
}

export type TShowCrew = IShowCrewItem[];

export interface IShowEpisode extends IEpisode {}

export type TShowEpisodes = IShowEpisode[];

export interface IShowSeason {
  id: number;
  url: string;
  number: number;
  name: string;
  episodeOrder: number | null;
  premiereDate: string | null;
  endDate: string | null;
  network: INetwork | null;
  webChannel: INetwork | null;
  image: IImage | null;
  summary: string | null;
  _links: Pick<ILinks, "self">;
}

export type TShowSeasons = IShowSeason[];

export interface IShowCastItem {
  person: IPerson;
  character: ICharacter;
  self: boolean;
  voice: boolean;
}

export type TShowCast = IShowCastItem[];

export interface IShowMainInfo extends IShow {}

export type TShowMainInfo = IShowMainInfo;

export interface IFullScheduleItem extends IScheduledEpisode {}

export type TFullSchedule = IFullScheduleItem[];

export interface IScheduleWebItem extends IScheduledEpisode {}

export type TScheduleWeb = IScheduleWebItem[];

export interface ISearchPeopleItem {
  score: number;
  person: IPerson;
}

export type TSearchPeople = ISearchPeopleItem[];

export interface IMultipleShowSearchItem {
  score: number;
  show: IShow;
}

export type TMultipleShowSearch = IMultipleShowSearchItem[];

export interface ISingleShowSearch extends IShow {}

export type TSingleShowSearch = ISingleShowSearch;

export interface IShowImage {
  id: number;
  type: string;
  main: boolean;
  resolutions: IResolutions;
}

export interface IResolutions {
  original: IMedium;
  medium: IMedium;
}

export interface IMedium {
  url: string;
  width: number;
  height: number;
}
