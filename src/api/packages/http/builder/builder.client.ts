import {
  HttpClient,
  HttpClientConfig,
  HttpClientRequestOptions,
} from "../clients/clients.types";
import { validateBuilder } from "./builder.validation";
import { AxiosHttpClient } from "../clients/axios/axios.client";

class HttpClientBuilder {
  config: HttpClientConfig;

  static make = (): HttpClientBuilder => new HttpClientBuilder();

  private constructor() {
    // Set default options
    this.config = {
      options: {
        url: "",
        method: "GET",
        responseType: "JSON",
      },
    };
  }

  requestOptions(options: HttpClientRequestOptions): HttpClientBuilder {
    this.config.options = {
      ...this.config.options,
      ...options,
    };
    return this;
  }

  forwardHeadersFromRequestContext(headersToForward: string[]) {
    this.config.headersToForwardFromRequestContext = [...headersToForward];
    return this;
  }

  build(): HttpClient {
    validateBuilder(this);
    return new AxiosHttpClient(this.config);
  }
}

export { HttpClientBuilder };