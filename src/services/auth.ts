import * as dotenv from "dotenv";
dotenv.config({path: ".env"})

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@src/models/user";

export interface DecodedUser extends Omit<User, "_id"> {
  id: string;
}

export default class AuthService {
  // Obj para as funções de criptografia e autenticação
  public static async hashPassword(
    // converte a string em o hash
    password: string,
    salt = 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async comparePassword(
    // compara a senha ao hash
    password: string,
    hashPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }

  public static generateToken(payload: object): string {
    // gera um token com base nos valores passados
    return jwt.sign(payload, process.env.AUTHKEY as string, {
      expiresIn: process.env.AUTHTOKENEXPIRESIN,
    });
  }

  public static decodeToken(token: string): DecodedUser {
    // decodifica o token e verifica se ele é valido
    return jwt.verify(token, process.env.AUTHKEY as string) as DecodedUser;
  }
}
