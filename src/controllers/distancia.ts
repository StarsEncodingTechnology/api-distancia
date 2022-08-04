import { Controller, Get, Post } from "@overnightjs/core";
import { Cidade } from "@src/models/cidade";
import { DistanciaDados } from "@src/services/calculoDistancia";
import { Request, Response } from "express";
import mongoose from "mongoose";

@Controller("distancia")
export class DistanciaController {
  @Post("")
  public async pegaDistanciaUsuarioLogado(
    req: Request,
    res: Response
  ): Promise<void> {
    const ibgeOrigem = req.body.ibge_origem;
    const ibgeDestino = req.body.ibge_destino;

    if (!ibgeOrigem || !ibgeDestino) {
      res.status(400).send({
        code: 400,
        message: "ibge_origem or ibge_destino Not Found",
      });
    } else {
      try {
        const dadosOrigem = await Cidade.findOne({
          codigo_municipio_completo: ibgeOrigem,
        });
        const dadosDestino = await Cidade.findOne({
          codigo_municipio_completo: ibgeDestino,
        });

        const distanciaDados = new DistanciaDados();

        if (dadosOrigem != null && dadosDestino != null) {
          const result = await distanciaDados.processandoDadosCidades(
            dadosOrigem,
            dadosDestino
          );

          res.status(200).send(result);
        } else {
          res.status(400).send({
            code: 400,
            message: "ibge_origem or ibge_destino Invalid",
          });
        }
      } catch (error) {
        if ((error as Error) instanceof mongoose.Error.ValidationError) {
          res.status(422).send({ error: (error as Error).message });
        } else {
          res.status(500).send({ error: "Internal Server Error" });
        }
      }
    }
  }
}
