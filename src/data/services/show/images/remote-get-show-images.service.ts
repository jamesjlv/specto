import { HttpClient, HttpMethod, HttpStatusCode } from "@/data/protocols";
import { GetShowImagesServiceNamespace } from "@/domain/services";

export class RemoteGetShowImagesService implements GetShowImagesServiceNamespace.Interface {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
  ) {}

  async exec(params: GetShowImagesServiceNamespace.Params): Promise<GetShowImagesServiceNamespace.Model> {
    const response = await this.httpClient.request<GetShowImagesServiceNamespace.Model>({
      url: this.url,
      method: HttpMethod.Get,
      params,
    });

    switch (response.statusCode) {
      case HttpStatusCode.Ok:
        return response.data;
      case HttpStatusCode.NotFound:
        throw new Error("Show images not found.");
      case HttpStatusCode.TooManyRequests:
        throw new Error("Rate limit exceeded. Please try again later.");
      default:
        throw new Error("Unexpected error occurred while fetching show images.");
    }
  }
}
