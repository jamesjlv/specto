import { HttpClient, HttpMethod, HttpStatusCode } from "@/data/protocols";
import { SearchShowsServiceNamespace } from "@/domain/services";

export class RemoteSearchShowsService implements SearchShowsServiceNamespace.Interface {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
  ) {}

  async exec(params: SearchShowsServiceNamespace.Params): Promise<SearchShowsServiceNamespace.Model> {
    const response = await this.httpClient.request<SearchShowsServiceNamespace.Model>({
      url: this.url,
      method: HttpMethod.Get,
      params,
    });

    switch (response.statusCode) {
      case HttpStatusCode.Ok:
        return response.data;
      case HttpStatusCode.NotFound:
        throw new Error("Shows not found.");
      case HttpStatusCode.TooManyRequests:
        throw new Error("Rate limit exceeded. Please try again later.");
      default:
        throw new Error("Unexpected error occurred while searching shows.");
    }
  }
}
