/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { IERC777Sender } from "./IERC777Sender";

export class IERC777SenderFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IERC777Sender {
    return new Contract(address, _abi, signerOrProvider) as IERC777Sender;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "operatorData",
        type: "bytes",
      },
    ],
    name: "tokensToSend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
