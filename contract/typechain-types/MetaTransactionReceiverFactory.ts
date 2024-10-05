/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { MetaTransactionReceiver } from "./MetaTransactionReceiver";

export class MetaTransactionReceiverFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<MetaTransactionReceiver> {
    return super.deploy(overrides || {}) as Promise<MetaTransactionReceiver>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MetaTransactionReceiver {
    return super.attach(address) as MetaTransactionReceiver;
  }
  connect(signer: Signer): MetaTransactionReceiverFactory {
    return super.connect(signer) as MetaTransactionReceiverFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MetaTransactionReceiver {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MetaTransactionReceiver;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "metaTransactionProcessor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "MetaTransactionProcessor",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "changeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAdmin",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "who",
        type: "address",
      },
    ],
    name: "isMetaTransactionProcessor",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "metaTransactionProcessor",
        type: "address",
      },
      {
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "setMetaTransactionProcessor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061032c806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80636e9960c3146100515780638a04af6a146100715780638f28397014610086578063dc5074af14610099575b600080fd5b6000546040516001600160a01b0390911681526020015b60405180910390f35b61008461007f3660046102bc565b6100d5565b005b61008461009436600461029b565b610159565b6100c56100a736600461029b565b6001600160a01b031660009081526001602052604090205460ff1690565b6040519015158152602001610068565b6000546001600160a01b0316331461014b5760405162461bcd60e51b815260206004820152602e60248201527f6f6e6c792061646d696e2063616e207365747570206d6574615472616e73616360448201526d74696f6e50726f636573736f727360901b60648201526084015b60405180910390fd5b610155828261021c565b5050565b6000546001600160a01b031633146101b35760405162461bcd60e51b815260206004820152601b60248201527f6f6e6c792061646d696e2063616e206368616e67652061646d696e00000000006044820152606401610142565b600054604080516001600160a01b03928316815291831660208301527f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f910160405180910390a1600080546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160a01b038216600081815260016020908152604091829020805460ff19168515159081179091558251938452908301527fb21eb88b4e33b3f1281830a7178d74d8aa73220416215726b68ae23d539515cb910160405180910390a15050565b80356001600160a01b038116811461029657600080fd5b919050565b6000602082840312156102ac578081fd5b6102b58261027f565b9392505050565b600080604083850312156102ce578081fd5b6102d78361027f565b9150602083013580151581146102eb578182fd5b80915050925092905056fea2646970667358221220c9dd068235db57b9615340d716de6bd015f147e09b340caf0a0c8290e9bd3bd464736f6c63430008040033";
