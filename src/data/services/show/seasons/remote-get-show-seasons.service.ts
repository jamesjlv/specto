import { HttpClient, HttpMethod, HttpStatusCode } from "@/data/protocols";
import { GetShowSeasonsServiceNamespace } from "@/domain/services";

export class RemoteGetShowSeasonsService implements GetShowSeasonsServiceNamespace.Interface {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
  ) {}

  async exec(params: GetShowSeasonsServiceNamespace.Params): Promise<GetShowSeasonsServiceNamespace.Model> {
    const response = await this.httpClient.request<GetShowSeasonsServiceNamespace.Model>({
      url: this.url,
      method: HttpMethod.Get,
      params,
    });

    switch (response.statusCode) {
      case HttpStatusCode.Ok:
        return response.data;
      case HttpStatusCode.NotFound:
        throw new Error("Show seasons not found.");
      case HttpStatusCode.TooManyRequests:
        throw new Error("Rate limit exceeded. Please try again later.");
      default:
        throw new Error("Unexpected error occurred while fetching show seasons.");
    }
  }
}
