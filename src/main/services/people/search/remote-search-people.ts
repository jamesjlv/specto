import { RemoteSearchPeopleService } from "@/data/services";
import { manufactureApiUrl, manufactureHttpClient } from "@/main/factories";

export const manufactureRemoteSearchPeople = (): RemoteSearchPeopleService =>
  new RemoteSearchPeopleService(manufactureHttpClient(), manufactureApiUrl("search/people"));
