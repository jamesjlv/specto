import { HttpClient, HttpMethod, HttpStatusCode } from "@/data/protocols";
import { GetShowInfoServiceNamespace } from "@/domain/services";

export class RemoteGetShowInfoService implements GetShowInfoServiceNamespace.Interface {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
  ) {}

  async exec(params: GetShowInfoServiceNamespace.Params): Promise<GetShowInfoServiceNamespace.Model> {
    const response = await this.httpClient.request<GetShowInfoServiceNamespace.Model>({
      url: this.url,
      method: HttpMethod.Get,
      params,
    });

    switch (response.statusCode) {
      case HttpStatusCode.Ok:
        return response.data;
      case HttpStatusCode.NotFound:
        throw new Error("Show information not found.");
      case HttpStatusCode.TooManyRequests:
        throw new Error("Rate limit exceeded. Please try again later.");
      default:
        throw new Error("Unexpected error occurred while fetching show information.");
    }
  }
}
