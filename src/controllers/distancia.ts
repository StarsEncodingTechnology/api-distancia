import { Controller, Get, Post } from "@overnightjs/core";
import { Request, Response } from "express";

@Controller("distancia")
export class DistanciaController {
  @Post("")
  public pegaDistanciaUsuarioLogado(_: Request, res: Response): void {
    
    res.status(200).send({});
  }
}
