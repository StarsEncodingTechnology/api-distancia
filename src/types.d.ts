import * as http from 'http';
import { DecodedUser } from './services/auth';

declare module 'express-serve-static-core' {
  // sobreescreve o Request com todos as seus elementos e mais o decoded
  // sendo ele não obrigatorio
  export interface Request extends http.IncomingMessage, Express.Request {
    decoded?: DecodedUser;
  }
}