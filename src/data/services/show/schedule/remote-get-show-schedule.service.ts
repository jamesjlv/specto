import { HttpClient, HttpMethod, HttpStatusCode } from "@/data/protocols";
import { GetShowScheduleServiceNamespace } from "@/domain/services";

export class RemoteGetShowScheduleService implements GetShowScheduleServiceNamespace.Interface {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
  ) {}

  async exec(params: GetShowScheduleServiceNamespace.Params): Promise<GetShowScheduleServiceNamespace.Model> {
    const response = await this.httpClient.request<GetShowScheduleServiceNamespace.Model>({
      url: this.url,
      method: HttpMethod.Get,
      params,
    });

    switch (response.statusCode) {
      case HttpStatusCode.Ok:
        return response.data;
      case HttpStatusCode.NotFound:
        throw new Error("Show schedule not found.");
      case HttpStatusCode.TooManyRequests:
        throw new Error("Rate limit exceeded. Please try again later.");
      default:
        throw new Error("Unexpected error occurred while fetching show schedule.");
    }
  }
}
