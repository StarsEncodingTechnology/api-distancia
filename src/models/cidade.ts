

export interface infoCidadesDistancia {
    cidade: string,
    UF: string,
    distancia: number
}

export interface Cidade {
    _id?: string;
    UF: string;
    nome_UF: string;
    codigo_UF: string;
    municipio: string;
    codigo_municipio_completo: string;
    nome_municipio: string;
    distancia?: {[key: string]: infoCidadesDistancia};
}
