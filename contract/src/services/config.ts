import {IProviderOptionsExt,NetworkId, Web3Network} from "../web3/web3Wrapper";
export type MetaspliConfig = {
    enableFakeMint?:boolean;
    corsProxy?:string;
    contracts:{
        splitToken: string;
        tokenGenerator: string
        fakeLand: string
        views: string
    }
    landContracts:Array<{name:string, address:string}>,
    authenticate: {
        network?:NetworkId
        signMessage: string,
        switchToNetwork: boolean,
        providerOptions?:IProviderOptionsExt,
        createNetworkIfNeeded?: Web3Network
    }
    chainId:number
}