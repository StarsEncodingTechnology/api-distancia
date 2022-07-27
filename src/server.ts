import "./util/module-alias";
import { Server } from "@overnightjs/core";
import bodyParser from 'body-parser';
import { DistanciaController } from "./controllers/distancia";
import { Application } from "express";

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public  init(): void {
    this.setupExpress();
    this.setupControllers();
  }


  private setupExpress(): void {
    this.app.use(bodyParser.json())
  }

  private setupControllers ():void {
    const distanciaController = new DistanciaController();
    this.addControllers([distanciaController])
  }

  public getApp(): Application {
    return this.app;
  }


  public close(): void {
    
  }

}
