import axios, { AxiosError, AxiosResponse } from "axios";
import { HttpClient, HttpMethod, HttpRequest, HttpResponse, HttpStatusCode } from "@/data/protocols";

export class AxiosHttpClient implements HttpClient {
  private readonly timeoutMs: number;

  constructor(timeoutMs: number = 12000) {
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
        headers: {
          Accept: "application/json",
          "User-Agent": "SpectoMobileApp/1.0",
          ...config.headers,
        },
        timeout: this.timeoutMs,
        validateStatus: () => true, // Allows 4xx and 5xx to be handled by the Data Layer
      });
    } catch (rawError) {
      const error = rawError as AxiosError;
      console.error(`[AxiosHttpClient Error] ${config.method ?? "GET"} ${config.url}:`, error.message);

      return {
        statusCode: HttpStatusCode.ServiceUnavailable,
        data: null as unknown as TResponse,
        headers: {},
      };
    }

    const rateLimitHeader = axiosResponse.headers?.["x-ratelimit-remaining"];
    const rateLimitRemaining = rateLimitHeader ? parseInt(rateLimitHeader, 10) : undefined;

    return {
      statusCode: axiosResponse.status as HttpStatusCode,
      data: axiosResponse.data,
      headers: (axiosResponse.headers ?? {}) as Record<string, string>,
      rateLimitRemaining,
    };
  }
}
