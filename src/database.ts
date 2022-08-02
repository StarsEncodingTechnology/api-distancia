import config, { IConfig } from "config";
import { connect as mongooseConnect, connection } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const dbConfig: IConfig = config.get("App.database");

export const connect = async (): Promise<void> => {
  const urlDB: string = dbConfig.get("mongoUrl");
  const linkDB: string = urlDB
    .replace("LOGIN_DB", process.env["LOGIN_DB"])
    .replace("SENHA_DB", process.env["SENHA_DB"])
    .replace("CONFIG_DB", process.env["CONFIG_DB"]);

  await mongooseConnect(linkDB);
  console.log("Conectado")
};

export const close = (): Promise<void> => connection.close();
