import { HttpClient, HttpMethod, HttpStatusCode } from "@/data/protocols";
import { GetShowsServiceNamespace } from "@/domain/services";

export class RemoteGetShowsService implements GetShowsServiceNamespace.Interface {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
  ) {}

  async exec(params: GetShowsServiceNamespace.Params): Promise<GetShowsServiceNamespace.Model> {
    const response = await this.httpClient.request<GetShowsServiceNamespace.Model>({
      url: this.url,
      method: HttpMethod.Get,
      params,
    });

    switch (response.statusCode) {
      case HttpStatusCode.Ok:
        return response.data ?? [];
      case HttpStatusCode.NotFound:
        return [];
      case HttpStatusCode.TooManyRequests:
        throw new Error("Rate limit exceeded. Please try again later.");
      default:
        throw new Error("Unexpected error occurred while fetching shows.");
    }
  }
}
