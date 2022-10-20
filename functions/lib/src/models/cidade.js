"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cidade = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    UF: { type: String, required: true },
    nome_UF: { type: String, required: true },
    codigo_UF: { type: String, required: true },
    municipio: { type: String, required: true },
    codigo_municipio_completo: { type: String, required: true, unique: true },
    nome_municipio: { type: String, required: true },
    distancia: { type: Object },
}, {
    toJSON: {
        transform: (_, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
exports.Cidade = mongoose_1.default.model("Cidade", schema);
//# sourceMappingURL=cidade.js.map