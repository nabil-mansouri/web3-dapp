import { AppService } from "contract/dist/src/services/appService";
import { LockedAmount } from "contract/dist/src/services/splitService";
export type {LockedAmount};
export const appService = new AppService({});


export const ASSETS = {
    logo: '/assets/images/logo.png',
    native: '/assets/images/eth.png'
}


export function formatNumber(num:string): string | boolean{
    if (isNaN(+num) || +num < 0) {
        return false;
    }
    //remove zero right
    num = num.replace(/^0+/, '');
    if (num.startsWith(".")) {
        num = "0" + num;
    }
    if (num.trim() == "") {
        return "0"
    }
    return num;
}
export function formatInt(num:string): string | boolean{
    if (isNaN(+num) || +num < 0) {
        return false;
    }
    //remove zero right
    num = num.replace(/^0+/, '');
    num = num.replace(".", '');
    if (num.trim() == "") {
        return "0"
    }
    return num;
}