import mongoose, { Document, mongo } from "mongoose";

export interface infoCidadesDistancia {
  cidade: string;
  UF: string;
  distancia: number;
}

export interface Cidade {
  _id?: string;
  UF: string;
  nome_UF: string;
  codigo_UF: string;
  municipio: string;
  codigo_municipio_completo: string;
  nome_municipio: string;
  distancia?: { [key: string]: infoCidadesDistancia };
}

const schema = new mongoose.Schema({
    UF: {type: String, required: true},
    nome_UF: {type: String, required: true},
    codigo_UF: {type: String, required: true},
    municipio: {type: String, required: true},
    codigo_municipio_completo: {type: String, required: true, unique: true},
    nome_municipio: {type: String, required: true},
    distancia: {type: Object}
},{
    toJSON: {
        transform: (_, ret): void => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

interface CidadeModel extends Omit<Cidade, "_id">, Document {}

export const Cidade = mongoose.model<CidadeModel>("Cidade", schema)