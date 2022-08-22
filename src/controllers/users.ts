import { Controller, Post } from "@overnightjs/core";
import {  User } from "@src/models/user";
import AuthService from "@src/services/auth";
import { DataAtual } from "@src/util/dataAtual";
import { Request, Response } from "express";
import { BaseController } from ".";

@Controller("users")
export class UsersController extends BaseController {
  @Post("")
  public async create(req: Request, res: Response): Promise<void> {
    try {
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
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).send({
        code: 401,
        error: "User not found!",
      });
    }

    if (!(await AuthService.comparePassword(password, user.password))) {
      return res.status(401).send({
        code: 401,
        error: 'Password does not match!'
      })
    }

    const token = AuthService.generateToken(user.toJSON());
    return res.status(200).send({ token: token });
  }
}

/*
const user: User = {
    name: "pedro",
    email: "pedro_eliias",
    password: "1234",
    consumo: {
        "012022": {
            "01": 5,
            "02": 2
        }
    }
}
*/
