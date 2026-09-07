import { RemoteSearchShowsService } from "@/data/services";
import { manufactureApiUrl, manufactureHttpClient } from "@/main/factories";

export const manufactureRemoteSearchShows = (): RemoteSearchShowsService =>
  new RemoteSearchShowsService(manufactureHttpClient(), manufactureApiUrl("search/shows"));
