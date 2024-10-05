import { Signer, providers, BigNumber } from "ethers";
import { Web3Provider } from "../web3/web3Provider";
import { ERC777, ERC777Factory } from "typechain-types";
import { EventController } from "web3modal";
import { Web3Id, Web3Wrapper } from "../web3/web3Wrapper";
import { AppService } from "./appService";


export class Web3Service{
    public static web3ProviderSource: () => Promise<Web3Id> = () => {
        throw "web3.provider.not_found";
    }
    private _user?: User;
    private erc20 = new Map<string, ERC777>();
    private _wrapper?: Web3Wrapper;
    private symbols = new Map<string, string>();
    private eventController = new EventController;
    public ready?:Promise<Web3Wrapper|undefined>; 
    constructor(private appService:AppService){}

    public get utilService() {
        return this.appService.utilService;
    }
    public get currentUserAddress() {
        return this._user?.address;
    }

    get isAuthenticated() {
        const res = this._user;
        return typeof res != "undefined" && res != null;
    }

    async getProvider() {
        if (this._wrapper) {
            return this._wrapper;
        }
        const source = await Web3Service.web3ProviderSource();
        return this.connect(source);
    }

    async getSigner(): Promise<Signer> {
        const wallet = await this.getProvider();
        return wallet.getSignerForUser(this._user?.address!);
    }

    async tryConnect(logoutIfNeeded:boolean):Promise<Web3Wrapper|undefined>{
        const r = async ()=>{
            if(this.appService.isNode) return;
            const { signMessage, switchToNetwork, createNetworkIfNeeded, providerOptions, network } = this.appService.appConf.authenticate;
            const cached = Web3Wrapper.getCached({ network, createNetworkIfNeeded, providerOptions, signMessage, switchToNetwork, cacheProvider: true })
            try{
                if(logoutIfNeeded){
                    await this.logout();
                }
                const res = await this.connect(cached);
                return res;
            }catch(e){
                return undefined;
            }
        }
        this.ready = r();
        return this.ready;
    }

    async connect(source:Web3Id){
        if (this._wrapper) {
            return this._wrapper;
        }
        if(!source){
            throw "web3.provider.not_found";
        }
        const { signMessage, switchToNetwork, createNetworkIfNeeded, providerOptions, network } = this.appService.appConf.authenticate;
        this._wrapper = await Web3Wrapper.create(source, { network, createNetworkIfNeeded, providerOptions, signMessage, switchToNetwork, cacheProvider: true })
        this._user = { address: await this._wrapper.getAddress() };
        this._wrapper.onConnectChanged(()=>{
            this.eventController.trigger(Web3Events.CONNECT);
        })
        this._wrapper.onDisconnectChanged(()=>{
            this.eventController.trigger(Web3Events.DISCONNECT);
        })
        this._wrapper.onAccounChanged(async ()=>{
            this.eventController.trigger(Web3Events.ACCOUNT_CHANGED);
        })
        this._wrapper.onNetworkChanged(()=>{
            this.eventController.trigger(Web3Events.NETWORK_CHANGED);
        })
        this._wrapper.onChainChanged(()=>{
            this.eventController.trigger(Web3Events.NETWORK_CHANGED);
        })
        this.eventController.trigger(Web3Events.AUTHENTICATE)
        return this._wrapper;
    }

    async logout() {
        try{
            localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
        }catch(e){}
        this._wrapper?.w3Provider.clearCachedProvider();
        this._wrapper = undefined;
        this._user = undefined;
    }

    async checkCurrentNetwork(){
        if(!this._wrapper){
            throw "web3.provider.not_authenticated";
        }
        const { network } = this.appService.appConf.authenticate;
        const forcedChainId = Web3Wrapper.getChainId(network!);
        const chainId = await this._wrapper?.getChainId();
        return chainId == forcedChainId;
    }

    isProviderAvailable(id: Web3Id) { return Web3Wrapper.isProviderAvailable(id); }

    onAuthenticated(callback: () => void): () => void {
        return this.registerCallback(Web3Events.AUTHENTICATE, callback);
    }

    onConnect(callback: () => void): () => void {
        return this.registerCallback(Web3Events.CONNECT, callback);
    }

    onDisconnect(callback: () => void) {
        return this.registerCallback(Web3Events.DISCONNECT, callback);
    }

    onAccountChanged(callback: () => void) {
        return this.registerCallback(Web3Events.ACCOUNT_CHANGED, callback);
    }

    onNetworkChanged(callback: () => void) {
        return this.registerCallback(Web3Events.NETWORK_CHANGED, callback);
    }

    checkInjectedProvider(id:Web3Id){
        return Web3Wrapper.checkInjectedProvider(id);
    }

    getAvailableInjectedProvider(){
        return Web3Wrapper.getAvailableInjectedProvider();
    }

    protected registerCallback<T>(event:Web3Events, callback: (arg?:T) => void){
        const eventObj = { event, callback };
        this.eventController.on(eventObj)
        return () => {
            this.eventController.off(eventObj)
        }
    }

    forceProvider(provider: providers.Web3Provider) {
        const { providerOptions, network } = this.appService.appConf.authenticate;
        const web3Modal = typeof window.navigator=="undefined"?null: new Web3Provider({ providerOptions, network });
        this._wrapper = new Web3Wrapper(provider, web3Modal!);
    }

    forceUser(address: string) {
        this._user = { address };
        this._wrapper && (this._wrapper.forceAddress = address);
    }
    
    async getBalanceCoin(){
        const wallet = await this.getProvider();
        const user = await this.getSigner();
        const address = await user.getAddress()
        const balance = await wallet.getBalance(address);
        return balance;
    }
    
    async getBalanceCoinNoPrecision(){
        const wallet = await this.getProvider();
        const user = await this.getSigner();
        const address = await user.getAddress()
        const balance = await wallet.getBalance(address);
        return this.utilService.fromPrecision(balance);
    }
    
    async getBalanceCoinFor(address:string){
        const wallet = await this.getProvider();
        const balance = await wallet.getBalance(address);
        return balance;
    }

    async getBalanceToken(tokenAddr: string): Promise<{balance:number, symbol:string}> {
        const signer = await this.getSigner();
        const address = await signer.getAddress()
        const tokenContract = await this.getERC20(tokenAddr);
        const symbol = await this.getSymbol(tokenAddr);
        const balanceOf = await tokenContract.connect(signer).balanceOf(address);
        const balance = this.utilService.fromPrecision(balanceOf);
        return {balance, symbol};
    }

    async getBalanceTokenFor(tokenAddr: string, address:string): Promise<{balance:BigNumber, symbol:string}> {
        const signer = await this.getSigner();
        const tokenContract = await this.getERC20(tokenAddr);
        const symbol = await this.getSymbol(tokenAddr);
        const balance = await tokenContract.connect(signer).balanceOf(address);
        return {balance, symbol};
    }
    
    async getBalanceSplitNoPrecision(){
        const addr = this.appService.appConf.contracts.splitToken;
        const value = await this.getBalanceToken(addr)
        return this.utilService.fromPrecision(value.balance);
    }
    async onSplitTokenChange(callback: (balance: string) => void) {
        const provider = await this.getProvider();
        const signer = await this.getSigner();
        const address = await signer.getAddress()
        const tokenContract = await this.appService.splitTokenR();
        let loading = false;
        let previous: string;
        const cb = async () => {
            try {
                if (loading) return;
                loading = true;
                const balanceOf = await tokenContract.balanceOf(address);
                const balance = this.utilService.fromPrecision(balanceOf);
                //add native balance if missing
                const current = balance.toFixed(2);
                if (current != previous) {
                    callback(current);
                    previous = current;
                }
            } finally {
                loading = false;
            }
        };
        provider.provider.on("block", cb)
        return () => provider.provider.off("block", cb)
    }


    async onBalanceChange(callback: (balance: string) => void) {
        const provider = await this.getProvider();
        const signer = await this.getSigner();
        const address = await signer.getAddress()
        let loading = false;
        let previous: string;
        const cb = async () => {
            try {
                if (loading) return;
                loading = true;
                const balanceOf = await provider.getBalance(address);
                const balance = this.utilService.fromPrecision(balanceOf);
                //add native balance if missing
                const current = balance.toString();
                if (current != previous) {
                    callback(current);
                    previous = current;
                }
            } finally {
                loading = false;
            }
        };
        provider.provider.on("block", cb)
        return () => provider.provider.off("block", cb)
    }

    public async getERC20(tokenAddr: string) {
        if (!this.erc20.has(tokenAddr)) {
            const erc20Contract = new ERC777Factory().attach(tokenAddr);
            this.erc20.set(tokenAddr, erc20Contract);
        }
        return this.erc20.get(tokenAddr)!;
    }

    protected async getSymbol(tokenAddr: string) {
        const signer = await this.getSigner();
        const erc20 = await this.getERC20(tokenAddr);
        if (!this.symbols.has(tokenAddr)) {
            this.symbols.set(tokenAddr, await erc20.connect(signer).symbol());
        }
        return this.symbols.get(tokenAddr)!;
    }
}
enum Web3Events{
    CONNECT= 'CONNECT',
    AUTHENTICATE= 'AUTHENTICATE',
    DISCONNECT= 'DISCONNECT',
    ACCOUNT_CHANGED = 'ACCOUNT_CHANGED',
    NETWORK_CHANGED = 'NETWORK_CHANGED'
}
export type User = {
    address: string;
}
export type {Web3Id}