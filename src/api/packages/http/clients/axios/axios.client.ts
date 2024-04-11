import axios, { AxiosInstance } from "axios";
import {
  HttpClient,
  HttpClientConfig,
  HttpClientResponse,
} from "../clients.types.ts";
import { wrapAxiosErrorsInterceptor } from "./axios.interceptors.ts";
import { mergeWithHeadersFromRequestContext } from "./axios.requestContext.ts";
import {AsyncHooksRequestContextProvider} from '@packages-be/requestContext'

class AxiosHttpClient implements HttpClient {
  private clientConfig: HttpClientConfig;
  private axiosInstance: AxiosInstance;

  constructor(clientConfig: HttpClientConfig) {
    this.axiosInstance = axios.create();
    this.configureInterceptors();
    this.clientConfig = {
      ...clientConfig,
    };
  }

  private configureInterceptors() {
    this.axiosInstance.interceptors.response.use(
      wrapAxiosErrorsInterceptor.onFulfilled,
      wrapAxiosErrorsInterceptor.onRejected
    );
  }

  async makeRequest(): Promise<HttpClientResponse> {
    const { url, method, responseType, headers, timeoutInMilliseconds, data } =
      this.clientConfig.options;
    return await this.axiosInstance({
      url,
      method: method?.toLowerCase(),
      responseType: responseType?.toLowerCase() as any,
      headers: mergeWithHeadersFromRequestContext(
        AsyncHooksRequestContextProvider.getInstance(),
        this.clientConfig.headersToForwardFromRequestContext,
        headers
      ),
      data,
      timeout: timeoutInMilliseconds ?? 3000,
    });
  }
}

export { AxiosHttpClient };