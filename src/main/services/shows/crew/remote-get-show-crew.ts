import { RemoteGetShowCrewService } from "@/data/services";
import { manufactureApiUrl, manufactureHttpClient } from "@/main/factories";

export const manufactureRemoteGetShowCrew = (showId: number): RemoteGetShowCrewService =>
  new RemoteGetShowCrewService(manufactureHttpClient(), manufactureApiUrl(`shows/${showId}/crew`));
