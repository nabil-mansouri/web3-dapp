//must mock before
import 'mock-local-storage'
(global as any).window = {} as any;
(window as any).localStorage = global.localStorage;
global.XMLHttpRequest = require('xhr2');
(window as any).XMLHttpRequest = global.XMLHttpRequest;
global.btoa = require('btoa');
//load for ts-node
import 'tsconfig-paths/register';

import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { ethers, network } from 'hardhat';
import {SplitToken, Land, TokenGenerator, TokenManagerFactory, ERC777, Views, TokenManager} from "typechain-types";
import { UtilService } from "../src/services/utilService";
export class Helper {
    public utilService = new UtilService(undefined as any);
    public signerPromise = ethers.getSigners();
    public contractTokenPromise = ethers.getContractFactory("SplitToken").then(async Contract => {
        const contract = await Contract.deploy("TOK", "TOK", 20 * 10**6);
        await contract.deployed();
        return contract as SplitToken;
    })

    getProvider(){
        return network.provider;
    }

    public landPromise = async (owner:string)=>{
        const Contract = await ethers.getContractFactory("Land");
        const contract = await Contract.deploy(owner, owner);
        await contract.deployed();
        return await (contract as Land);
    }

    public viewsPromise = async (owner:string)=>{
        const Contract = await ethers.getContractFactory("Views");
        const contract = await Contract.deploy();
        await contract.deployed();
        return (contract as Views);
    }
    
    public tokenManagerLibPromise = async ()=>{
        const Contract = await ethers.getContractFactory("TokenManagerImpl");
        const contract = await Contract.deploy();
        await contract.deployed();
        return (contract as TokenManager);
    }
    public tokenFactoryPromise = async ()=>{
        const managerLib = await this.tokenManagerLibPromise();
        const Contract = await ethers.getContractFactory("TokenGenerator");
        const contract = await Contract.deploy(managerLib.address);
        await contract.deployed();
        return (contract as TokenGenerator);
    }

    public async createToken(symbol: string, amount: number): Promise<ERC777> {
        const Contract = await ethers.getContractFactory("SplitToken");
        const contract = await Contract.deploy(symbol, symbol, this.toPrecision(amount));
        await contract.deployed();
        return contract as ERC777;
    }

    public async landId(x:number, y:number, contract: Land){
        return this.utilService.landId(x,y,contract);
    }

    public getManager(address:string){
        return new TokenManagerFactory().attach(address);
    }

    public fromPrecision(numb:BigNumberish, precision = 18):number{
        return this.utilService.fromPrecision(numb, precision);
    }

    public toPrecision(numb:BigNumberish, precision = 18):BigNumber{
        return this.utilService.toPrecision(numb, precision);
    }
}
export const helper = new Helper();