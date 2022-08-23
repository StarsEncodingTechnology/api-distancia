import AuthService from "@src/services/auth";
import mongoose, { Document } from "mongoose";


export interface ConsumoDia {
  [key: string]: number;
}

export interface Consumo {
  [key: string]: ConsumoDia;
  // a key é o mes+ano
  // 012022
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  consumo: Consumo;
}

export enum CUSTOM_VALIDATION {
  DUPLICATED = "DUPLICATED",
}

interface UserModel extends Omit<User, "_id">, Document {}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    consumo: { type: Object, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        (ret.id = ret._id), delete ret._id, delete ret.__v;
      },
    },
  }
);

schema.path("email").validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  "already exists in the database.",
  CUSTOM_VALIDATION.DUPLICATED
);


schema.pre<UserModel>("save", async function (): Promise<void> {
  if (!this.password || !this.isModified("password")) {
    return;
  }

  try {
    const hashedPassword = await AuthService.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (err) {
    console.error(`Error hashing the password for the user ${this.name}`);
  }
});
 
export const User = mongoose.model<UserModel>("User", schema);
