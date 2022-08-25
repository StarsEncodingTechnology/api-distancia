import config, { IConfig } from "config";
import { connect as mongooseConnect, connection } from "mongoose";
import logger from "./logger";

const db: IConfig = config.get("App.database");

const dbConfig: IConfig = config.get("App.database");

export const connect = async (
  urlDB: string = dbConfig.get("mongoUrl")
): Promise<void> => {
  // conectado o server com o DB

  const linkDB: string = urlDB
    .replace("LOGIN_DB", db.get("LOGIN_DB") as string)
    .replace("SENHA_DB", db.get("SENHA_DB") as string)
    .replace("CONFIG_DB", db.get("CONFIG_DB") as string);

  
  await mongooseConnect(linkDB);
  logger.info("Conectado");
};

export const close = (): Promise<void> => connection.close();
