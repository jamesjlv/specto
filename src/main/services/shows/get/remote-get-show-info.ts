import { RemoteGetShowInfoService } from "@/data/services";
import { manufactureApiUrl, manufactureHttpClient } from "@/main/factories";

export const manufactureRemoteGetShowInfo = (showId: number): RemoteGetShowInfoService =>
  new RemoteGetShowInfoService(manufactureHttpClient(), manufactureApiUrl(`shows/${showId}`));
