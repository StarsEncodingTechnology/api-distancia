

export interface Destino {
    cidade: string;
    uf: string;
}

export interface Origem extends Destino {}


export class GoogleDistance {

    public async buscaDistancia(destino: Destino, origem: Origem): Promise<{}>{
        return Promise.resolve({})
    }

}