import "./util/module-alias";
import { Server } from "@overnightjs/core";
import bodyParser from "body-parser";

import { DistanciaController } from "./controllers/distancia";
import { Application } from "express";

import * as database from "@src/database";
import { UsersController } from "./controllers/users";
import logger from "./logger";

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    // inicia as funções do server
    this.setupExpress();
    this.setupControllers();
    await this.dataBaseSetup();
  }

  private setupExpress(): void {
    // configurações do express
    this.app.use(bodyParser.json());
    
  }

  private setupControllers(): void {
    // inicia os controlers do sistemas e as rotas utilizadas
    const distanciaController = new DistanciaController();
    const usersController = new UsersController();
    this.addControllers([distanciaController, usersController]);
  }

  private async dataBaseSetup(): Promise<void> {
    // conecta com o DB
    await database.connect();
  }

   public async close(): Promise<void> {
    // fecha conexão com o DB
    await database.close();
  }

  
  public getApp(): Application {
    // retorna o app
    return this.app;
  }


  public start(): void {
    // inicia servidor
    this.app.listen(this.port, () => {
      logger.info("Server rodando em: " + this.port)
    })
  }
}
