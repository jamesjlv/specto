import { HttpClient, HttpMethod, HttpStatusCode } from "@/data/protocols";
import { SearchPeopleServiceNamespace } from "@/domain/services";

export class RemoteSearchPeopleService implements SearchPeopleServiceNamespace.Interface {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
  ) {}

  async exec(params: SearchPeopleServiceNamespace.Params): Promise<SearchPeopleServiceNamespace.Model> {
    const response = await this.httpClient.request<SearchPeopleServiceNamespace.Model>({
      url: this.url,
      method: HttpMethod.Get,
      params,
    });

    switch (response.statusCode) {
      case HttpStatusCode.Ok:
        return response.data;
      case HttpStatusCode.NotFound:
        throw new Error("People not found.");
      case HttpStatusCode.TooManyRequests:
        throw new Error("Rate limit exceeded. Please try again later.");
      default:
        throw new Error("Unexpected error occurred while searching people.");
    }
  }
}
