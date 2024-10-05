/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { ISettings } from "./ISettings";

export class ISettingsFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ISettings {
    return new Contract(address, _abi, signerOrProvider) as ISettings;
  }
}

const _abi = [
  {
    inputs: [],
    name: "feeReceiver",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
