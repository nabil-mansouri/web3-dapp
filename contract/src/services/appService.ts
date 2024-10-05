import { BigNumber } from "ethers";
import { Web3Service } from "./web3Service";
import { W3Service } from "./splitService";
import { appConf } from "@config";
import { Land, LandFactory, SplitToken, SplitTokenFactory, TokenGenerator, TokenGeneratorFactory, Views, ViewsFactory } from "typechain-types";
import { MetaspliConfig } from "./config";
import { UtilService } from "./utilService";
import { TokenService } from "./tokenService";
import { Web3Id } from "../web3/web3Wrapper";

export type W3Contracts = { 
    splitToken: SplitToken
    tokenGenerator: TokenGenerator
    views: Views
    fakeLand: Land
};

export type AppServiceOptions = Partial<W3Contracts> & {};

export class AppService {
    public utilService = new UtilService(this);
    public web3Service = new Web3Service(this);
    public metaService = new W3Service(this);
    public tokenService = new TokenService(this);
    private contracts: W3Contracts;
    constructor(options: AppServiceOptions) {
        const { contracts } = appConf;
        this.contracts = {
            splitToken: options?.splitToken || (new SplitTokenFactory()).attach(contracts.splitToken),
            tokenGenerator: options?.tokenGenerator || (new TokenGeneratorFactory()).attach(contracts.tokenGenerator),
            fakeLand: options?.fakeLand || (new LandFactory()).attach(contracts.fakeLand),
            views: options?.views || (new ViewsFactory()).attach(contracts.views)
        }
    }

    public get tokenGeneratorContract() { return this.contracts.tokenGenerator; }
    public get fakeLandContract() { return this.contracts.fakeLand; }
    async tokenGeneratorRW() {
        const signer = await this.web3Service.getSigner();
        return this.contracts.tokenGenerator.connect(signer) as TokenGenerator;
    }
    async tokenGeneratorR() {
        const signer = await this.web3Service.getProvider();
        return this.contracts.tokenGenerator.connect(signer.provider) as TokenGenerator;
    }
    async viewsRW() {
        const signer = await this.web3Service.getSigner();
        return this.contracts.views.connect(signer) as Views;
    }
    async viewsR() {
        const signer = await this.web3Service.getProvider();
        return this.contracts.views.connect(signer.provider) as Views;
    }
    async fakeLandContractRW() {
        const signer = await this.web3Service.getSigner();
        return this.contracts.fakeLand.connect(signer) as Land;
    }
    async fakeLandContractR() {
        const signer = await this.web3Service.getProvider();
        return this.contracts.fakeLand.connect(signer.provider) as Land;
    }
    async splitTokenRW() {
        const signer = await this.web3Service.getSigner();
        return this.contracts.splitToken.connect(signer) as SplitToken;
    }
    async splitTokenR() {
        const signer = await this.web3Service.getProvider();
        return this.contracts.splitToken.connect(signer.provider) as SplitToken;
    }
    public get appConf() { return appConf as MetaspliConfig }
    public get currentAddress() { return this.web3Service?.currentUserAddress; }
    public get isNode(): boolean { return typeof window === 'undefined'; }

}
export type {TokenGenerator, Web3Id}
export { BigNumber};