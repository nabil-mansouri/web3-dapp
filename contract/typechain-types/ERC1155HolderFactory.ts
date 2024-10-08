/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { ERC1155Holder } from "./ERC1155Holder";

export class ERC1155HolderFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<ERC1155Holder> {
    return super.deploy(overrides || {}) as Promise<ERC1155Holder>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ERC1155Holder {
    return super.attach(address) as ERC1155Holder;
  }
  connect(signer: Signer): ERC1155HolderFactory {
    return super.connect(signer) as ERC1155HolderFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC1155Holder {
    return new Contract(address, _abi, signerOrProvider) as ERC1155Holder;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506103bb806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806301ffc9a714610046578063bc197c811461006e578063f23a6e61146100a6575b600080fd5b61005961005436600461030f565b6100c5565b60405190151581526020015b60405180910390f35b61008d61007c366004610206565b63bc197c8160e01b95945050505050565b6040516001600160e01b03199091168152602001610065565b61008d6100b43660046102ac565b63f23a6e6160e01b95945050505050565b60006001600160e01b03198216630271189760e51b14806100f657506301ffc9a760e01b6001600160e01b03198316145b92915050565b80356001600160a01b038116811461011357600080fd5b919050565b600082601f830112610128578081fd5b8135602067ffffffffffffffff8211156101445761014461036f565b8160051b61015382820161033e565b83815282810190868401838801850189101561016d578687fd5b8693505b8584101561018f578035835260019390930192918401918401610171565b50979650505050505050565b600082601f8301126101ab578081fd5b813567ffffffffffffffff8111156101c5576101c561036f565b6101d8601f8201601f191660200161033e565b8181528460208386010111156101ec578283fd5b816020850160208301379081016020019190915292915050565b600080600080600060a0868803121561021d578081fd5b610226866100fc565b9450610234602087016100fc565b9350604086013567ffffffffffffffff80821115610250578283fd5b61025c89838a01610118565b94506060880135915080821115610271578283fd5b61027d89838a01610118565b93506080880135915080821115610292578283fd5b5061029f8882890161019b565b9150509295509295909350565b600080600080600060a086880312156102c3578081fd5b6102cc866100fc565b94506102da602087016100fc565b93506040860135925060608601359150608086013567ffffffffffffffff811115610303578182fd5b61029f8882890161019b565b600060208284031215610320578081fd5b81356001600160e01b031981168114610337578182fd5b9392505050565b604051601f8201601f1916810167ffffffffffffffff811182821017156103675761036761036f565b604052919050565b634e487b7160e01b600052604160045260246000fdfea264697066735822122033845e93d43dbb6a4267f31dc875d01540e9742d3b6a4ec79d00e9f87b8670d264736f6c63430008040033";
