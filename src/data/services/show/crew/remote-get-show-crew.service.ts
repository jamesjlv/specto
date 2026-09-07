import { HttpClient, HttpMethod, HttpStatusCode } from "@/data/protocols";
import { GetShowCrewServiceNamespace } from "@/domain/services";

export class RemoteGetShowCrewService implements GetShowCrewServiceNamespace.Interface {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
  ) {}

  async exec(params: GetShowCrewServiceNamespace.Params): Promise<GetShowCrewServiceNamespace.Model> {
    const response = await this.httpClient.request<GetShowCrewServiceNamespace.Model>({
      url: this.url,
      method: HttpMethod.Get,
      params,
    });

    switch (response.statusCode) {
      case HttpStatusCode.Ok:
        return response.data;
      case HttpStatusCode.NotFound:
        throw new Error("Show crew not found.");
      case HttpStatusCode.TooManyRequests:
        throw new Error("Rate limit exceeded. Please try again later.");
      default:
        throw new Error("Unexpected error occurred while fetching show crew.");
    }
  }
}
