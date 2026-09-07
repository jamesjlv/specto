import { HttpClient, HttpMethod, HttpStatusCode } from "@/data/protocols";
import { GetShowCastServiceNamespace } from "@/domain/services";

export class RemoteGetShowCastService implements GetShowCastServiceNamespace.Interface {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
  ) {}

  async exec(params: GetShowCastServiceNamespace.Params): Promise<GetShowCastServiceNamespace.Model> {
    const response = await this.httpClient.request<GetShowCastServiceNamespace.Model>({
      url: this.url,
      method: HttpMethod.Get,
      params,
    });

    switch (response.statusCode) {
      case HttpStatusCode.Ok:
        return response.data;
      case HttpStatusCode.NotFound:
        throw new Error("Show cast not found.");
      case HttpStatusCode.TooManyRequests:
        throw new Error("Rate limit exceeded. Please try again later.");
      default:
        throw new Error("Unexpected error occurred while fetching show cast.");
    }
  }
}
