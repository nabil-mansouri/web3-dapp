import { BigNumber, ethers, providers } from "ethers";
import { verifyInjectedProvider, checkInjectedProviders, IProviderInfo, getChainId, CHAIN_DATA_LIST, EventController } from "web3modal";
import * as web3Modal from "web3modal";
import { Web3Id, Web3Provider,IProviderControllerOptions, NetworkId, IProviderOptionsExt } from "./web3Provider";
import {Web3Errors} from "./web3Errors";

export class Web3Wrapper{
    forceAddress?:string;
    public state: { signature?: string } = {
        signature: undefined
    }
    constructor(public provider: providers.Web3Provider, public w3Provider: Web3Provider) { };
    static isProviderAvailable(id: Web3Id) {
        const injected = web3Modal.injected as any;
        const providers = web3Modal.providers as any;
        let info: IProviderInfo = injected[id];
        if (info) {
            const isAvailable = verifyInjectedProvider(info.check);
            return isAvailable;
        }
        info = providers[id];
        if (info) {
            //SHOULD we test non injected provider?
            //const isAvailable = verifyInjectedProvider(info.check);
            return true;
        }
        return false;
    }

    static getCached(options: Partial<Web3APiConnectOptions>): Web3Id {
        const web3Modal = new Web3Provider(options);
        return web3Modal.cachedProvider as any;
    }

    static async create(id: Web3Id, options: Partial<Web3APiConnectOptions>): Promise<Web3Wrapper> {
        const web3Modal = new Web3Provider(options);
        const provider = await web3Modal.connectTo(id);
        const wallet = new providers.Web3Provider(provider, 'any');
        const web3W = new Web3Wrapper(wallet, web3Modal);
        await web3W.provider.ready;
        //force chain if needed
        if (options.switchToNetwork && options.network) {
            const chainId = await web3W.getChainId();
            const forcedChainId = Web3Wrapper.getChainId(options.network as NetworkId);
            if (forcedChainId != chainId) {
                await web3W.switchToChain(forcedChainId, !!options.createNetworkIfNeeded, options.createNetworkIfNeeded);
            }
            const reload = async () => {
                const chainId = await web3W.getChainId();
                if (forcedChainId != chainId) {
                    await web3W.switchToChain(forcedChainId, !!options.createNetworkIfNeeded, options.createNetworkIfNeeded);
                }
            }
            //autoswitch
            web3W.onNetworkChanged(reload);
        }
        //sign if needed
        if (options.signMessage) {
            try {
                const signature = await web3W.signMessage(options.signMessage!);
                if (!signature) {
                    throw new Error(Web3Errors.SignFailed);
                }
                web3W.state.signature = signature;
            } catch (e) {
                throw new Error(Web3Errors.SignFailed);
            }
        }
        return web3W;
    }

    getBalance(address: string) { return this.provider.getBalance(address); }

    async getMyBalance() { return this.getBalance(await this.getAddress()); }

    getSigner() { return this.provider.getSigner(); }

    getSignerForUser(address: string) { return this.provider.getSigner(address); }

    getChainId(): Promise<number> { return this.provider.send("eth_chainId", []); }

    async getAddress(): Promise<string> { 
        if(this.forceAddress){
            return this.forceAddress!;
        }
        return (this.provider).listAccounts().then(e => e[0]!); 
    }

    signMessage(message: string) { return this.getSigner().signMessage(message); }

    onMessage(callback: () => void) {
        (this.provider.provider as any).on("message", callback);
    }

    onAccounChanged(callback: (accounts: string[]) => void) {
        (this.provider.provider as any).on("accountsChanged", callback);
    }

    onChainChanged(callback: (chain: number) => void) {
        (this.provider.provider as any).on("chainChanged", callback);
    }

    onConnectChanged(callback: (info: { chainId: number }) => void) {
        (this.provider.provider as any).on("connect", callback);
    }

    onDisconnectChanged(callback: (error: { code: number; message: string }) => void) {
        (this.provider.provider as any).on("disconnect", callback);
    }

    onUpdate(callback: (error: { code: number; message: string }) => void) {
        (this.provider.provider as any).on("update", callback);
    }

    onNetworkChanged(callback: (newNetwork: providers.Network, oldNetwork?: providers.Network) => void) {
        this.provider.on("network", callback);
    }

    async switchToChain(chainId: number, createIfNotExists: boolean, network?: Web3Network) {
        try {
            const toHex = ethers.utils.hexStripZeros(BigNumber.from(chainId).toHexString());
            await this.provider.send("wallet_switchEthereumChain", [{ chainId: toHex }]);
        } catch (error) {
            if ((error as any).code === 4902) {
                if (createIfNotExists) {
                    await this.createNetwork(network!);
                } else {
                    throw Web3Errors.NetworkNotFound;
                }
            } else {
                console.error("[switchToChain] ", error);
            }
        }
    }

    async createNetwork(network: Web3Network) {
        try {
            await this.provider.send("wallet_addEthereumChain", [network]);
        } catch (error) {
            throw Web3Errors.NetworkCreateFailed
        }
    }

    static getChainId(network: NetworkId) {
        if (!CHAIN_DATA_LIST[97]) {
            CHAIN_DATA_LIST[97] = {
                chainId: 97,
                chain: "BSCTest",
                network: "binance-test",
                networkId: 97
            };
        }
        if (!CHAIN_DATA_LIST[31337]) {
            CHAIN_DATA_LIST[31337] = {
                chainId: 31337,
                chain: "HardhatLocal",
                network: "hardhat-local",
                networkId: 31337
            };

        }
        if(network == "binance-test"){
            return 97;
        }
        return getChainId(network);
    }
    static checkInjectedProvider(id: Web3Id) {
        return verifyInjectedProvider(id);
    }

    static getAvailableInjectedProvider() {
        return checkInjectedProviders();
    }
}
export type {Web3Id, NetworkId, IProviderControllerOptions,IProviderOptionsExt};
export type Web3APiConnectOptions = IProviderControllerOptions & { switchToNetwork: boolean, signMessage: string, createNetworkIfNeeded: Web3Network }
export type Web3Network = { chainId: string, chainName: string, rpcUrls: string[], nativeCurrency: { name: string, symbol: string, decimals: number, blockExplorerUrls: string[] } }
