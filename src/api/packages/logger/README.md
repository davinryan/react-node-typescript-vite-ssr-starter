`@packages/logger`

This package is designed to provide out of the box JSON logging and correlationId middleware for microservices.

## Requirements
You must have an up to date version of the following to use this package
* express 4.x

## Installation

```sh
npm install @packages-be/logger
```

## Usage

To configure add the following to your server.ts or root level typescript file. Make sure this runs first before
your express app and middleware is setup
```ts
import {Logger} from "@packages/logger";
import {RequestContext} from "@packages/request-context"

// Optional - add if you want to support automatic logging of correlation Ids for every request/response
const contextProvider: IRequestContextProvider = RequestContext.getInstance();

// Configure logger
// NOTE: if you want correlationId support you MUST map your correlationId header name to 'correlationId'. The following
// configuration does this
Logger.configure({"X-Organisation-Correlation-Id": "correlationId"}, config.logger.level, contextProvider)
```
To use the package to log things and errors, simply do the following

```ts
import {ILogger, Logger} from "@packages/logger";

const logger: ILogger = new Logger("location or fileName");

logger.info('your message', {some: "meta", data: "to show"});
// => {"level":"info","timestamp":"2023-10-05T20:28:55.387Z", "location":"location or filename", "correlationId":"12345","message":"your message","some":"meta","data":"to show"}


logger.error(new Error("oops"));
/* => {"level":"error","timestamp":"2023-10-05T20:32:49.483Z", "location":"location or filename", "correlationId":"12345","message":"Ooops","stack":["Error: Ooops","    at UsersController
.getUsers (...)"," at UsersController.descriptor.value...} */

```
To use the package to log data for each express request/response including correlationIds you can add it as middleware

```ts
import {Logger} from "@packages/logger";

app.use(new Logger("app.middleware").middleware())
/* => {"level":"info","timestamp":"2023-10-05T20:36:32.371Z","location":"app.middleware", "message":"GET /users?email=someEmail@southerncross.co.nz 200 18ms","meta":{"req":{"url":"/u
sers?email=someEmail@southerncross.co.nz","headers":{"x-organisation-correlation-id":"12345","user-agent":"PostmanRuntime/7.33.0","accept"
:"*\/*","postman-token":"8f68f476-f3b3-43e4-98ff-e82a3dfda206","host":"localhost:3000","accept-encoding":"gzip, deflate, br","connection":"keep-alive
"},"method":"GET","httpVersion":"1.1","originalUrl":"/users?email=someEmail@southerncross.co.nz","query":{"email":"someEmail@southerncross.co.nz"}
},"res":{"statusCode":200},"responseTime":18}}
*/
```