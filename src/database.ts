import config, { IConfig } from "config";
import { connect as mongooseConnect, connection } from "mongoose";

const db: IConfig = config.get(
  "App.database"
);

const dbConfig: IConfig = config.get("App.database");

export const connect = async (): Promise<void> => {
  // conectado o server com o DB
  const urlDB: string = dbConfig.get("mongoUrl");
  const linkDB: string = urlDB
    .replace("LOGIN_DB", (db.get('LOGIN_DB') as string))
    .replace("SENHA_DB", (db.get("SENHA_DB") as string))
    .replace("CONFIG_DB", (db.get("CONFIG_DB") as string));

  await mongooseConnect(linkDB);
  console.log("Conectado")
};

export const close = (): Promise<void> => connection.close();
