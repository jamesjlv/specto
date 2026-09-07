import { HttpClient, HttpMethod, HttpStatusCode } from "@/data/protocols";
import { GetShowEpisodeServiceNamespace } from "@/domain/services";

export class RemoteGetShowEpisodesService implements GetShowEpisodeServiceNamespace.Interface {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
  ) {}

  async exec(params: GetShowEpisodeServiceNamespace.Params): Promise<GetShowEpisodeServiceNamespace.Model> {
    const response = await this.httpClient.request<GetShowEpisodeServiceNamespace.Model>({
      url: this.url,
      method: HttpMethod.Get,
      params,
    });

    switch (response.statusCode) {
      case HttpStatusCode.Ok:
        return response.data;
      case HttpStatusCode.NotFound:
        throw new Error("Show episodes not found.");
      case HttpStatusCode.TooManyRequests:
        throw new Error("Rate limit exceeded. Please try again later.");
      default:
        throw new Error("Unexpected error occurred while fetching show episodes.");
    }
  }
}
