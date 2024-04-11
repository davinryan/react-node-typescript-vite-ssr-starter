type HttpClientRequestHeaders = Record<string, string>;
type HttpClientResponseHeaders = Record<string, string>;

type HttpClientResponse = {
  originalUrl: string;
  headers: HttpClientResponseHeaders;
  data: any;
  status: number;
  statusText: string;
  config: any;
};

type HttpClientRequestOptions = {
  /* indicates the type of data that the server will respond with
   * options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
   * browser only: 'blob'
   */
  responseType?: "JSON" | "TEXT";
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | string;
  headers?: HttpClientRequestHeaders;
  data?: any;
  /* Default is 3000 milliseconds) */
  timeoutInMilliseconds?: number;
};

interface HttpClient {
  makeRequest(): Promise<HttpClientResponse>;
}

interface HttpClientConfig {
  options: HttpClientRequestOptions;
  headersToForwardFromRequestContext?: string[];
}

export type {
  HttpClient,
  HttpClientRequestOptions,
  HttpClientRequestHeaders,
  HttpClientResponse,
  HttpClientResponseHeaders,
  HttpClientConfig,
};