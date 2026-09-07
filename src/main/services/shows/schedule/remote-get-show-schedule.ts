import { RemoteGetShowScheduleService } from "@/data/services";
import { manufactureApiUrl, manufactureHttpClient } from "@/main/factories";

/**
 * Supports TVMaze params:
 * - standard TV schedule: /schedule
 * - web streaming schedule: /schedule/web
 * - full archive schedule: /schedule/full
 */
export const manufactureRemoteGetShowSchedule = (
  endpoint: "schedule" | "schedule/web" | "schedule/full" = "schedule",
): RemoteGetShowScheduleService =>
  new RemoteGetShowScheduleService(manufactureHttpClient(), manufactureApiUrl(endpoint));
