import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { fetchJson } from "@ethersproject/web";
import { Signer , ethers } from "ethers";
import { ERC721Factory, ERC777, ERC777Factory, TokenManagerFactory, ViewsFactory } from "typechain-types";
import { AppService } from "./appService";

export class W3Service {
    public static APPROVE_MAX: BigNumber;
    constructor(private appService: AppService) {
        W3Service.APPROVE_MAX = this.utilService.toPrecision(1000000000000);
    }
    get utilService() {
        return this.appService.utilService;
    }
    async mintFakeLand(size = 1, x = 1, y = 1) {
        const user = await this.appService.web3Service.getSigner()
        const address = await user.getAddress();
        const landContract = await this.appService.fakeLandContractRW();
        await (await landContract.mintQuad(address, size, x, y, [])).wait();
        return this.appService.utilService.landId(x, y, landContract);
    }

    async partitionLand(contractAddress: string, tokenId: BigNumberish, supply: BigNumberish, skipMeta = false) {
        const user = await this.appService.web3Service.getSigner()
        const address = await user.getAddress();
        const tokenGenerator = await this.appService.tokenGeneratorRW();
        const erc721Contract = new ERC721Factory().attach(contractAddress).connect(user);
        const allowance = await erc721Contract.getApproved(tokenId)
        if (!this.utilService.compareAddress(allowance, address)) {
            await (await erc721Contract.approve(tokenGenerator.address, tokenId)).wait()
        }
        const meta = await this.getMetadata(contractAddress, tokenId, user);
        if(!skipMeta && !meta){
            throw "partition.meta.not_found";
        }
        const metaModel:LandMeta<ethers.utils.Bytes> =meta?{
            name: ethers.utils.toUtf8Bytes(meta!.name),
            description: ethers.utils.toUtf8Bytes(meta!.description),
            image: ethers.utils.toUtf8Bytes(meta!.image),
            json: ethers.utils.toUtf8Bytes(JSON.stringify(meta!)),
        }:{
            name: ethers.utils.toUtf8Bytes("Land"),
            description: ethers.utils.toUtf8Bytes(""),
            image: ethers.utils.toUtf8Bytes(""),
            json:ethers.utils.toUtf8Bytes(JSON.stringify({}))
        }
        await (await tokenGenerator.mint(contractAddress, tokenId, supply,1,true,metaModel)).wait();
    }

    async createBuyOfferCoin(offer: { amount: BigNumberish, cost: BigNumberish, fillOrKill: boolean }, managerAddress: string) {
        const { amount, cost, fillOrKill } = offer;
        const user = await this.appService.web3Service.getSigner()
        const address = await user.getAddress();
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        const depositPrecision = this.utilService.toPrecision(cost);
        const amountPrecision = this.utilService.toPrecision(amount);
        await (await manager.makeBuyOrderCoin(amountPrecision, fillOrKill, { value: depositPrecision })).wait();
        const offerIds = await manager.seeBuyOrderIdsFor(address);
        return offerIds[offerIds.length - 1];
    }

    async createBuyOfferToken(offer: { amount: BigNumberish, cost: BigNumberish, currency: string, fillOrKill: boolean }, managerAddress: string) {
        const { amount, currency, cost, fillOrKill } = offer;
        const user = await this.appService.web3Service.getSigner()
        const address = await user.getAddress();
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        const erc20Contract = new ERC777Factory().attach(currency).connect(user);
        const depositPrecision = this.utilService.toPrecision(cost);
        const amountPrecision = this.utilService.toPrecision(amount);
        const allowance = await erc20Contract.allowance(address, manager.address)
        if (allowance.lt(depositPrecision)) {
            await (await erc20Contract.approve(manager.address, W3Service.APPROVE_MAX)).wait()
        }
        await (await manager.makeBuyOrderToken(amountPrecision, depositPrecision, erc20Contract.address, fillOrKill)).wait();
        const offerIds = await manager.seeBuyOrderIdsFor(address);
        return offerIds[offerIds.length - 1];
    }

    async createSellOfferCoin(offer: { amount: BigNumberish, cost: BigNumberish, fillOrKill: boolean }, managerAddress: string) {
        const currency = this.utilService.ZERO_ADDRESS;
        return this.createSellOfferToken({ ...offer, currency }, managerAddress);
    }

    async createSellOfferToken(offer: { amount: BigNumberish, cost: BigNumberish, currency: string, fillOrKill: boolean }, managerAddress: string) {
        const { amount, currency, cost, fillOrKill } = offer;
        const user = await this.appService.web3Service.getSigner()
        const address = await user.getAddress();
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        const costPrecision = this.utilService.toPrecision(cost);
        const amountPrecision = this.utilService.toPrecision(amount);
        await (await manager.makeSellOrder(amountPrecision, costPrecision, currency, fillOrKill)).wait();
        const offerIds = await manager.seeSellOrderIdsFor(address);
        return offerIds[offerIds.length - 1];
    }

    async acceptBuyOrder(id: BigNumberish, managerAddress: string) {
        const user = await this.appService.web3Service.getSigner()
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        await (await manager.acceptBuyOrder(id)).wait();
        const buyOffer = await manager.buyOrders(id);
        return buyOffer;
    }

    async acceptSellOrder(id: BigNumberish, payment: BigNumberish, managerAddress: string) {
        const user = await this.appService.web3Service.getSigner()
        const address = await user.getAddress();
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        const sellOffer = await manager.sellOrders(id);
        const erc20Contract = new ERC777Factory().attach(sellOffer.currency).connect(user);
        const paymentPrecision = this.utilService.toPrecision(payment);
        if (this.utilService.compareAddress(this.utilService.ZERO_ADDRESS, sellOffer.currency)) {
            await (await manager.acceptSellOrder(id, paymentPrecision, { value: paymentPrecision })).wait();
        } else {
            const allowance = await erc20Contract.allowance(address, manager.address);
            if (allowance.lt(paymentPrecision)) {
                await (await erc20Contract.approve(manager.address, paymentPrecision)).wait();
            }
            await (await manager.acceptSellOrder(id, paymentPrecision)).wait();
        }
        const sellOfferAfter = await manager.sellOrders(id);
        return sellOfferAfter;
    }

    async deleteBuyOrder(id: BigNumberish, managerAddress: string) {
        const user = await this.appService.web3Service.getSigner()
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        await (await manager.connect(user).deleteBuyOrder(id)).wait();
    }

    async deleteSellOrder(id: BigNumberish, managerAddress: string) {
        const user = await this.appService.web3Service.getSigner()
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        await (await manager.connect(user).deleteSellOrder(id)).wait();
    }

    async withdrawLand(managerAddress: string) {
        const user = await this.appService.web3Service.getSigner()
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        await (await manager.connect(user).withdraw()).wait();
    }

    async getFakeLandId(x: number, y: number) {
        const fakeLand = await this.appService.fakeLandContractR();
        return this.utilService.landId(x, y, fakeLand);
    }

    async getFakeLandBalance(address: string) {
        const fakeLand = await this.appService.fakeLandContractR();
        return fakeLand.balanceOf(address);
    }

    async getFakeLandOwnerOf(id: BigNumberish) {
        const fakeLand = await this.appService.fakeLandContractR();
        return fakeLand.ownerOf(id);
    }

    async getMetadata(address: string, id: BigNumberish, signer?: Signer, showError = true) {
        try {
            const user = signer || await this.appService.web3Service.getSigner();
            const contract = new ERC721Factory().attach(address).connect(user);
            let metadataUri = await contract.tokenURI(id)
            if (this.appService.appConf.corsProxy) {
                metadataUri = `${this.appService.appConf.corsProxy}${metadataUri}`
            }
            const detail = await fetchJson(metadataUri);
            return detail as SandBoxDetails;
        } catch (e) {
            showError && console.error("Could not found nft: ", address, id, e)
            return null;
        }
    }

    async getManagersDetail(): Promise<LandNotifier> {
        const user = await this.appService.web3Service.getSigner();
        const managers = await this.getManagers();
        let callback: Array<() => void> = []
        const self = this;
        const details: LandDetails[] = managers.map(model => ({ model }));
        const notify = () => {
            callback.forEach(cb => cb());
        }
        const notifier: LandNotifier = {
            details,
            onChange(cb) {
                callback.push(cb);
                return () => {
                    callback = callback.filter(e => e !== cb);
                }
            },
            async loadMeta() {
                const promises = []
                for (const d of details) {
                    const m = d.model;
                    promises.push(self.getMetadata(m._nftaddr, m._nftid, user).then(meta => {
                        meta && (d.metadata = meta);
                        notify();
                        return d;
                    }));
                }
                await Promise.all(promises)
            }
        }
        return notifier
    }

    private async fixManagers(managers:Promise<Array<LandModel<ethers.utils.Bytes | string>>>):Promise<LandModel<string>[]>{
        const list = await managers;
        const parseSilently = (text:string)=>{
            try{
                return JSON.parse(text);
            }catch(e){
                return {};
            }
        }
        return list.map(e=>{
            return {...e,_meta:{
                name: ethers.utils.toUtf8String(e._meta.name),
                image: ethers.utils.toUtf8String(e._meta.image),
                description: ethers.utils.toUtf8String(e._meta.description),
                json: parseSilently(ethers.utils.toUtf8String(e._meta.json)),
            }}
        })
    }

    async getManagers() {
        const tokenGenerator = this.appService.tokenGeneratorContract.address;
        const views = await this.appService.viewsR();
        return this.fixManagers(views.seeManagers(tokenGenerator));
    }

    async getManagersFor(address: string) {
        const tokenGenerator = this.appService.tokenGeneratorContract.address;
        const views = await this.appService.viewsR();
        return this.fixManagers(views.seeManagersFor(tokenGenerator, address));
    }

    async getTradeCounter(managerAddress: string) {
        const user = await this.appService.web3Service.getSigner();
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        return manager.tradeCounter();
    }

    async getBuyCounter(managerAddress: string) {
        const user = await this.appService.web3Service.getSigner();
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        return manager.buyCounter();
    }

    async getSellCounter(managerAddress: string) {
        const user = await this.appService.web3Service.getSigner();
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        return manager.sellCounter();
    }

    async getBalanceOfManager(managerAddress: string, address?: string) {
        const user = await this.appService.web3Service.getSigner();
        const addr = address || await user.getAddress()
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        return manager.balanceOf(addr)
    }

    async getTotalSupplyOfManager(managerAddress: string) {
        const user = await this.appService.web3Service.getSigner();
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        return manager.totalSupply()
    }

    async getBuyOfferByOwner(managerAddress: string, address?: string) {
        const user = await this.appService.web3Service.getSigner();
        const addr = address || await user.getAddress()
        const manager = await this.appService.viewsR();
        return manager.seeBuyOfferFor(managerAddress, addr)
    }

    async getSellOfferByOwner(managerAddress: string, address?: string) {
        const user = await this.appService.web3Service.getSigner();
        const addr = address || await user.getAddress()
        const manager = await this.appService.viewsR();
        return manager.seeSellOfferFor(managerAddress, addr)
    }

    async getTradesByAddress(managerAddress: string, address?: string) {
        const user = await this.appService.web3Service.getSigner();
        const addr = address || await user.getAddress()
        const manager = await this.appService.viewsR();
        return manager.seeTradesFor(managerAddress, addr)
    }

    async getBuyOfferIds(managerAddress: string, address: string) {
        const user = await this.appService.web3Service.getSigner();
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        return manager.seeBuyOrderIdsFor(address);
    }

    async getSellOfferIds(managerAddress: string, address: string) {
        const user = await this.appService.web3Service.getSigner();
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        return manager.seeSellOrderIdsFor(address);
    }

    async getTradesIds(managerAddress: string, address: string) {
        const user = await this.appService.web3Service.getSigner();
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        return manager.seeTradesIdsFor(address);
    }

    async getBuyOffers(managerAddress: string) {
        const manager = await this.appService.viewsR();
        return manager.seeBuyOrders(managerAddress);
    }

    async getSellOffers(managerAddress: string) {
        const manager = await this.appService.viewsR();
        return manager.seeSellOrders(managerAddress);
    }

    async getTrades(managerAddress: string) {
        const manager = await this.appService.viewsR();
        return manager.seeTrades(managerAddress);
    }

    async getBalanceOf(managerAddress: string, holder: string) {
        const user = await this.appService.web3Service.getSigner();
        const manager = new TokenManagerFactory().attach(managerAddress).connect(user);
        return manager.balanceOf(holder);
    }

    async getLockedAmount(managerAddress: string, holder: string):Promise<LockedAmount> {
        const view = await this.appService.viewsR();
        const sells = await view.seeSellOrderFor(managerAddress, holder);
        return sells.reduce((sell1, sell2)=>{
            return {
                count: sell1.count +1,
                amount: sell1.amount.add(sell2.amount),
                amountExecuted: sell1.amountExecuted.add(sell2.amountExecuted),
                cost: sell1.cost.add(sell2.cost),
                costExecuted: sell1.costExecuted.add(sell2.costExecuted),
            }
        }, {
            count: 0,
            amount: BigNumber.from(0),
            amountExecuted: BigNumber.from(0),
            cost: BigNumber.from(0),
            costExecuted: BigNumber.from(0),
        })
    }

    async findNewId(realMeta = true, run = 100000) {
        const user = await this.appService.web3Service.getSigner();
        const contract = await this.appService.fakeLandContractR();
        const maxId: BigNumber = await contract.maxQuad();
        const GRID_SIZE = await contract.height();
        const y = 1;
        let lastX = maxId.gt(0) ? maxId.sub(GRID_SIZE) : BigNumber.from(0);
        let index = 1;
        while (index < run) {
            const newX = lastX.add(index).toNumber();
            index++;
            const id = BigNumber.from(newX).add(GRID_SIZE.mul(y)).toNumber();
            let exists = false;
            if (realMeta) {
                try {
                    const metaPromise = this.getMetadata(contract.address, id, user, false);
                    try {
                        await contract.x(id)
                        exists = true;
                    } catch (e) { }
                    const meta = await metaPromise;
                    if (!exists && meta) {
                        return { exists, meta: meta!, newX, y, lastX, run: index, id }
                    }
                } catch (e) { }
            } else {
                try {
                    await contract.x(id)
                    exists = true;
                } catch (e) { }
                if (!exists) {
                    return { exists, meta: undefined, newX, y, lastX, run: index, id }
                }
            }
        }
        return undefined;
    }
}

export type LandMeta<T> = {
    name: T;
    description: T;
    image: T;
    json: T;
}
export type LandModel<T>={
    _id: BigNumber;
    _address: string;
    _owner: string;
    _supply: BigNumber;
    _nftaddr: string;
    _nftid: BigNumber;
    _quantity: BigNumber;
    _erc721:boolean
    _meta:LandMeta<T>
}
export interface LandNotifier {
    details: LandDetails[]
    loadMeta(): Promise<void>
    onChange(cb: () => void): () => void;
}
export type LandDetails = {
    metadata?: SandBoxDetails,
    model: LandModel<string>
}
export type SandBoxDetails = {
    "name": string,
    "description": string,
    "image": string,
    "sandbox": {},
    "properties": [
        {
            "trait_type": "Land X" | "Land Y",
            "value": number,
            "max_value": number,
            "display_type": "number" | "string"
        }
    ],
    "external_url": string
}

export type LockedAmount={
    count: number;
    amount: BigNumber;
    amountExecuted: BigNumber;
    cost: BigNumber;
    costExecuted: BigNumber;
}