import express, {Request, Response} from 'express'

const apiRouter = express.Router();

apiRouter.get('/health-check', (request: Request, response: Response) => {
  response.json({
    status: "Healthy"
  })
});

export {
  apiRouter
};