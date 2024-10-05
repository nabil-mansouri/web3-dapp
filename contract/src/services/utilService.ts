import { BigNumberish,ethers,BigNumber } from "ethers";
import { Land, TokenManagerFactory } from "../../typechain-types";
import { AppService } from "./appService";


export class UtilService{
    public ZERO_ADDRESS= ethers.constants.AddressZero;
    constructor(private appService:AppService){}
    
    public compareAddress(address?:string, other?:string){
        return address?.toLowerCase() == other?.toLowerCase();
    }

    public async landId(x:number, y:number, contract: Land){
        const GRID_SIZE = await contract.height();
        return BigNumber.from(x).add(GRID_SIZE.mul(y));
    }

    public getManager(address:string){
        return new TokenManagerFactory().attach(address);
    }

    public fromPrecision(numb:BigNumberish, precision = 18):number{
        return parseFloat(ethers.utils.formatUnits(numb, precision));
    }

    public fromPrecisionBignumber(numb:BigNumberish, precision = 18):BigNumber{
        return BigNumber.from(ethers.utils.formatUnits(numb, precision));
    }

    public toPrecision(numb:BigNumberish, precision = 18):BigNumber{
        return ethers.utils.parseUnits(numb.toString(), precision);
    }
    
    public formatError(e:any){
        let message = `${((e as any).data && (e as any).data.message) || ((e as any).message) || e}`;
        message = message.replace("Error: VM Exception while processing transaction: reverted with reason string '","");
        if(message.endsWith("'")){
            message = message.substring(0, message.length-1);
        }
        return message;
    }
}