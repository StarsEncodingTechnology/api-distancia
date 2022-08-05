import { Controller, Post } from "@overnightjs/core";
import { Consumo, ConsumoDia, User } from "@src/models/user";
import { DataAtual } from "@src/util/dataAtual";
import { Request, Response } from "express";

@Controller("users")
export class UsersController {
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
      res.status(400).send({ code: 400, error: (error as Error).message });
    }
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
