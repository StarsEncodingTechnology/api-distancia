import "./util/module-alias";
import { Server } from "@overnightjs/core";
import bodyParser from "body-parser";

import { DistanciaController } from "./controllers/distancia";
import { Application } from "express";

import * as database from "@src/database";
import { UsersController } from "./controllers/users";

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.dataBaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const distanciaController = new DistanciaController();
    const usersController = new UsersController();
    this.addControllers([distanciaController, usersController]);
  }

  private async dataBaseSetup(): Promise<void> {
    await database.connect();
  }

  public close(): void {
    database.close();
  }

  
  public getApp(): Application {
    return this.app;
  }


  public start(): void {
    console.log("UAI")
    this.app.listen(this.port, () => {
      console.info("Server rodando em: " + this.port)
    })
  }
}
