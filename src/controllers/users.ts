import { Controller, Middleware, Post } from "@overnightjs/core";
import { User } from "@src/models/user";
import AuthService from "@src/services/auth";
import { DataAtual } from "@src/util/dataAtual";
import ApiError from "@src/util/errors/api-error";
import { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import { BaseController } from ".";

const rateLimiter = rateLimit({
  // middleware de limitador d requisições
  windowMs: 1 * 60 * 1000,
  // minutos * segundos * milisegundos
  max: 15,
  keyGenerator(req: Request): string {
    return req.ip;
  },
  handler(_, res: Response): void {
    res.status(429).send(
      ApiError.format({
        code: 429,
        message: "Limite de 15 requisições atingido",
      })
    );
  },
});

@Controller("users")
export class UsersController extends BaseController {
  @Post("")
  @Middleware(rateLimiter)
  public async create(req: Request, res: Response): Promise<void> {
    // faz a criação de novo perfil
    try {
      // res.send(
      //   ApiError.format({
      //     code: 203,
      //     message: "Não estamos aceitando cadastros",
      //   })
      // );
      // return;
      const dataAtual = new DataAtual();

      const consumo = {
        consumo: {
          [dataAtual.mesAtual() + dataAtual.anoAtual()]: {
            [dataAtual.diaAtual()]: 0,
          },
        },
      };

      const userInfo: User = { ...req.body, ...consumo };

      const user = new User(userInfo);
      const newUser = await user.save();

      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post("authenticate")
  public async authenticate(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    // cria o token
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return this.SendErrorResponse(res, {
        code: 401,
        message: "User not found!",
      });
    }

    if (!(await AuthService.comparePassword(password, user.password))) {
      return this.SendErrorResponse(res, {
        code: 401,
        message: "Password does not match!",
      });
    }

    const token = AuthService.generateToken(user.toJSON());
    return res.status(200).send({ ...user.toJSON(), ...{ token } });
  }
}
