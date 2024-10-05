import axios from "axios";
import {AppService} from "./appService";


export class TokenService{

    _cacheTokens?: Tokens;
    private _BASE_URL = 'https://api.1inch.exchange/v4.0/';
    constructor(private appService: AppService, private forceChain?: number) { }

    get baseUrl() {
        if (this.forceChain) {
            return this._BASE_URL + this.forceChain;
        }
        const chainId = this.appService.appConf.chainId;
        return this._BASE_URL + chainId;
    }
    async getListTokens(): Promise<Tokens> {
        return this.wrap(async () => {
            if (this._cacheTokens) return this._cacheTokens!;
            const url = `${this.baseUrl}/tokens`;
            const result = await axios.get(url);
            result.data.tokens = Object.values(result.data.tokens);
            const data: Tokens = result.data;
            this._cacheTokens = data;
            return data;
        })
    }

    private async wrap<T>(callback: () => Promise<T>): Promise<T> {
        try {
            const tmp = await callback();
            return tmp;
        } catch (e) {
            if ((e as any).response && (e as any).response.data) {
                throw (e as any).response.data;
            } else {
                throw e;
            }
        }
    }

}

export type  Token = {
    "symbol": string,
    "name": string,
    "address": string,
    "decimals": number,
    "logoURI": string
}
export type  Tokens = {
    "tokens": Token[]
}