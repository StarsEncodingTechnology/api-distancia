import config, { IConfig } from "config";
import { connect as mongooseConnect, connection } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const dbConfig: IConfig = config.get("App.database");

export const connect = async (): Promise<void> => {
  // conectado o server com o DB
  const urlDB: string = dbConfig.get("mongoUrl");
  const linkDB: string = urlDB
    .replace("LOGIN_DB", (process.env["LOGIN_DB"] as string))
    .replace("SENHA_DB", (process.env["SENHA_DB"] as string))
    .replace("CONFIG_DB", (process.env["CONFIG_DB"] as string));

  await mongooseConnect(linkDB);
  console.log("Conectado")
};

export const close = (): Promise<void> => connection.close();
