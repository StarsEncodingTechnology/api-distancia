import * as dotenv from "dotenv";
dotenv.config({path: "/.env"})

import { connect as mongooseConnect, connection } from "mongoose";
import logger from "./logger";

export const connect = async (
  urlDB: string = (process.env.MONGOURL as string)
): Promise<void> => {
  // conectado o server com o DB

  const linkDB: string = urlDB
    .replace("LOGIN_DB", process.env.LOGIN_DB as string)
    .replace("SENHA_DB", process.env.SENHA_DB as string)
    .replace("CONFIG_DB", process.env.CONFIG_DB as string);

  
  await mongooseConnect(linkDB);
  logger.info("Conectado");
};

export const close = (): Promise<void> => connection.close();
