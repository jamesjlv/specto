import { RemoteGetShowCastService } from "@/data/services";
import { manufactureApiUrl, manufactureHttpClient } from "@/main/factories";

export const manufactureRemoteGetShowCast = (showId: number): RemoteGetShowCastService =>
  new RemoteGetShowCastService(manufactureHttpClient(), manufactureApiUrl(`shows/${showId}/cast`));
