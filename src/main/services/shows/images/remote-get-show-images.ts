import { RemoteGetShowImagesService } from "@/data/services";
import { manufactureApiUrl, manufactureHttpClient } from "@/main/factories";

export const manufactureRemoteGetShowImages = (showId: number): RemoteGetShowImagesService =>
  new RemoteGetShowImagesService(manufactureHttpClient(), manufactureApiUrl(`shows/${showId}/images`));
