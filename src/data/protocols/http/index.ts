export enum HttpMethod {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE",
}

export enum HttpStatusCode {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  UnprocessableEntity = 422,
  TooManyRequests = 429,
  InternalServerError = 500,
  ServiceUnavailable = 503,
}

export type QueryParams = Record<string, string | number | boolean | undefined | null | (string | number)[]>;

export type HttpRequest<TBody = unknown> = {
  /**
   * Endpoint path
   */
  url: string;
  method?: HttpMethod; // Defaults to GET
  params?: QueryParams; // Serialized into search query string
  body?: TBody;
  headers?: Record<string, string>;
};

export type HttpResponse<TData = unknown> = {
  statusCode: HttpStatusCode;
  data: TData;
  headers?: Record<string, string>;
  /**
   * Optional TVMaze rate-limit remaining counter from headers
   */
  rateLimitRemaining?: number;
};

export interface HttpClient {
  request<TResponse = unknown, TBody = unknown>(config: HttpRequest<TBody>): Promise<HttpResponse<TResponse>>;
}
