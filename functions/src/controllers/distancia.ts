import {
  ClassMiddleware,
  Controller,
  Middleware,
  Post,
} from "@overnightjs/core";
import { authMiddleware } from "@src/middlewares/auth";
import { Cidade } from "@src/models/cidade";
import { DistanciaDados } from "@src/services/calculoDistancia";
import { AtualizaConsumo } from "@src/services/consumo";
import ApiError from "@src/util/errors/api-error";
import { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import { BaseController } from ".";



// const rateLimiter = rateLimit({
//   // middleware de limitador d requisições
//   windowMs: 1 * 2 * 1000,
//   // minutos * segundos * milisegundos
//   max: 1,
//   keyGenerator(req: Request): string {
//     return req.ip;
//   },
//   handler(_, res: Response): void {
//     res
//       .status(429)
//       .send(ApiError.format({ code: 429, message: "Limite de 10 requisições atingido" }));
//   },
// });

const distanciaDados = new DistanciaDados();

@Controller("distancia")
@ClassMiddleware(authMiddleware)
export class DistanciaController extends BaseController {
  @Post("")
  // @Middleware(rateLimiter)
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

        await AtualizaConsumo.adicionaUmConsumo(req);
      } catch (error) {
        this.sendCreateUpdateErrorResponse(res, error);
      }
    }
  }
}
