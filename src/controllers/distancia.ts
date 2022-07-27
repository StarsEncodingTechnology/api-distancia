import { Controller, Get, Post } from "@overnightjs/core";
import { Request, Response } from "express";

@Controller("distancia")
export class DistanciaController {
  @Get("")
  public pegaDistanciaUsuarioLogado(_: Request, res: Response): void {
    res.send({
      origem: {
        cidade: "Franca",
        estado: "SP",
        codIbge: "3513207",
      },
      destino: {
        cidade: "Franca",
        estado: "SP",
        codIbge: "3513207",
      },
      distancia: 21,
    });
  }
}
