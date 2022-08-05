import mongoose, { Document } from "mongoose";



export interface ConsumoDia {
    [key: string]: number;
}

export interface Consumo {
    [key: string]: ConsumoDia
    // a key é o mes+ano
}

export interface User {
    _id?: string;
    name: string;
    email: string;
    password: string;
    consumo: Consumo
}


interface UserModel extends Omit<User, "_id">, Document {
}

const schema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    consumo: {type: Object, required: true}
},
{
    toJSON: {
        transform: (_, ret): void => {
            ret.id = ret._id,
            delete ret._id,
            delete ret.__v
        }
    }
})


export const User = mongoose.model<UserModel>("User", schema)