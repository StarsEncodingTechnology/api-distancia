import { ClassMiddleware, Controller, Post } from "@overnightjs/core";
import { authMiddleware } from "@src/middlewares/auth";
import { Cidade } from "@src/models/cidade";
import { DistanciaDados } from "@src/services/calculoDistancia";
import { AtualizaConsumo } from "@src/services/consumo";
import { Request, Response } from "express";
import { BaseController } from ".";

@Controller("distancia")
@ClassMiddleware(authMiddleware)
export class DistanciaController extends BaseController {
  @Post("")
  public async pegaDistanciaUsuarioLogado(
    // rota  aonde se pega a distancia entre as cidades
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
        AtualizaConsumo.adicionaUmConsumo(req);
      } catch (error) {
        this.sendCreateUpdateErrorResponse(res, error);
      }
    }
  }
}
