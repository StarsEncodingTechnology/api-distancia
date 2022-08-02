import "./util/module-alias";
import { Server } from "@overnightjs/core";
import bodyParser from "body-parser";
import { DistanciaController } from "./controllers/distancia";
import { Application } from "express";
import * as database from "@src/database";

export class SetupServer extends Server {
  constructor(private port: Number = 3000) {
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
    this.addControllers([distanciaController]);
  }

  public getApp(): Application {
    return this.app;
  }

  private async dataBaseSetup(): Promise<void> {
    await database.connect();
  }

  public close(): void {
    database.close();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info("Server rodando em: " + this.port)
    })
  }
}
