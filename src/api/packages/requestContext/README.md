# `@packages-be/request-context`

This package is designed to provide out of the box access to an express request anywhere in your micro-service

## Requirements
You must have an up to date version of the following to use this package
* express 4.x

## Installation

```sh
npm install @packages/request-context
```

## Usage

To configure add the following to your app.middleware.ts part of your code where you register express middleware.
```ts
import {requestContextMiddleware} from "@packages/request-context";

app.use(makeRequestContextMiddleware());
```
NOTE: by default the above code will use the built in request context provider `RequestContextProvider.getInstance();`
by default.

If you want to provide you own custom contextProvider then you can provide one that follows the IRequestContextProvider
interface
```ts
/**
 * Type for the things you'd like direct access to
 */
type RequestContext = {
    originalUrl: string;
    headers: { [key: string]: any };
    query: { [key: string]: any };
    params: { [key: string]: any };
};

/**
 * Interface for context provider used for setting/getting request context
 */
interface IRequestContextProvider {
    set(req: Request, res: Response, context: RequestContext, nextFunction: NextFunction): void; // set context when new request received
    get(): RequestContext; // Get current requestContext
}
```
then you can do the following
```ts
import {requestContextMiddleware, RequestContextProvider} from "@packages/request-context";

const customContextProvider = {
    setAndContinueMiddlewareChain: (req: Request, res: Response, nextFunction: NextFunction, context: RequestContext) => {/* your implementation*/}
    get: () => {/* your implementation*/}
}
app.use(makeRequestContextMiddleware(customContextProvider));
```

To use the package to access the current request, simply do the following:

```ts
import {RequestContextProvider} from "@packages/request-context"

const context: RequestContext = RequestContextProvider.getInstance().get()

// Get the current Query
console.log(context.query);

// Get path params
console.log(context.params);

// Get request headers
console.log(context.headers);

// Get original request URL
console.log(context.originalUrl);
```