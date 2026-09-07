import axios, { AxiosError, AxiosResponse } from "axios";
import { HttpClient, HttpMethod, HttpRequest, HttpResponse, HttpStatusCode } from "@/data/protocols";

export class AxiosHttpClient implements HttpClient {
  private readonly timeoutMs: number;

  constructor(timeoutMs: number = 10000) {
    this.timeoutMs = timeoutMs;
  }

  async request<TResponse = unknown, TBody = unknown>(config: HttpRequest<TBody>): Promise<HttpResponse<TResponse>> {
    let axiosResponse: AxiosResponse<TResponse>;

    try {
      axiosResponse = await axios.request<TResponse>({
        url: config.url,
        method: config.method ?? HttpMethod.Get,
        data: config.body,
        params: config.params,
        headers: config.headers,
        timeout: this.timeoutMs,
        validateStatus: () => true,
      });
    } catch (rawError) {
      const error = rawError as AxiosError;

      // Handle offline or client-side timeout drops
      if (error.code === "ECONNABORTED" || !error.response) {
        return {
          statusCode: HttpStatusCode.ServiceUnavailable,
          data: null as unknown as TResponse,
          headers: {},
        };
      }

      axiosResponse = error.response as AxiosResponse<TResponse>;
    }

    const rateLimitHeader = axiosResponse.headers?.["x-ratelimit-remaining"];
    const rateLimitRemaining = rateLimitHeader ? parseInt(rateLimitHeader, 10) : undefined;

    return {
      statusCode: axiosResponse.status as HttpStatusCode,
      data: axiosResponse.data,
      headers: axiosResponse.headers as Record<string, string>,
      rateLimitRemaining,
    };
  }
}
