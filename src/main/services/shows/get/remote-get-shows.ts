import { RemoteGetShowsService } from "@/data/services";
import { manufactureApiUrl, manufactureHttpClient } from "@/main/factories";

export const manufactureRemoteGetShows = (): RemoteGetShowsService =>
  new RemoteGetShowsService(manufactureHttpClient(), manufactureApiUrl("shows"));
