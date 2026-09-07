import { RemoteGetShowSeasonsService } from "@/data/services";
import { manufactureApiUrl, manufactureHttpClient } from "@/main/factories";

export const manufactureRemoteGetShowSeasons = (showId: number): RemoteGetShowSeasonsService =>
  new RemoteGetShowSeasonsService(manufactureHttpClient(), manufactureApiUrl(`shows/${showId}/seasons`));
