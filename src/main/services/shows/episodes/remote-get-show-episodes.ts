import { RemoteGetShowEpisodesService } from "@/data/services";
import { manufactureApiUrl, manufactureHttpClient } from "@/main/factories";

export const manufactureRemoteGetShowEpisodes = (showId: number): RemoteGetShowEpisodesService =>
  new RemoteGetShowEpisodesService(manufactureHttpClient(), manufactureApiUrl(`shows/${showId}/episodes`));
