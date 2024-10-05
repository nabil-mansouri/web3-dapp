/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { View } from "./View";

export class ViewFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<View> {
    return super.deploy(overrides || {}) as Promise<View>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): View {
    return super.attach(address) as View;
  }
  connect(signer: Signer): ViewFactory {
    return super.connect(signer) as ViewFactory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): View {
    return new Contract(address, _abi, signerOrProvider) as View;
  }
}

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "owner",
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
    inputs: [],
    name: "paused",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_contract",
        type: "address",
      },
    ],
    name: "seeManagers",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "_id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_address",
            type: "address",
          },
          {
            internalType: "address",
            name: "_owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_supply",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_nftaddr",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_nftid",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_quantity",
            type: "uint256",
          },
        ],
        internalType: "struct TokenGenerator.Manager[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_contract",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "seeManagersFor",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "_id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_address",
            type: "address",
          },
          {
            internalType: "address",
            name: "_owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_supply",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_nftaddr",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_nftid",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_quantity",
            type: "uint256",
          },
        ],
        internalType: "struct TokenGenerator.Manager[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_contract",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "seeManagersForIds",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "_id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_address",
            type: "address",
          },
          {
            internalType: "address",
            name: "_owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_supply",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_nftaddr",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_nftid",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_quantity",
            type: "uint256",
          },
        ],
        internalType: "struct TokenGenerator.Manager[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001a33610030565b6000805460ff60a01b1916905560018055610080565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610bfb8061008f6000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063715018a61161005b578063715018a6146100db5780638da5cb5b146100e557806398e18dff14610100578063f2fde38b1461011357600080fd5b806325b063ab146100825780635c975abb146100ab5780636d48546b146100c8575b600080fd5b61009561009036600461084b565b610126565b6040516100a29190610a8c565b60405180910390f35b600054600160a01b900460ff1660405190151581526020016100a2565b6100956100d636600461086e565b6102e5565b6100e36104e7565b005b6000546040516001600160a01b0390911681526020016100a2565b61009561010e3660046108a6565b610552565b6100e361012136600461084b565b6106c8565b606060008290506000816001600160a01b0316636356c10c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561016857600080fd5b505afa15801561017c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101a09190610a74565b90506000808267ffffffffffffffff8111156101cc57634e487b7160e01b600052604160045260246000fd5b60405190808252806020026020018201604052801561020557816020015b6101f26107e3565b8152602001906001900390816101ea5790505b50905060005b838110156102db57604051630b62957160e41b8152600481018290526000906001600160a01b0387169063b62957109060240160e06040518083038186803b15801561025657600080fd5b505afa15801561026a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061028e91906109da565b905080838561029c81610b73565b9650815181106102bc57634e487b7160e01b600052603260045260246000fd5b60200260200101819052505080806102d390610b73565b91505061020b565b5095945050505050565b6040516303b4548360e51b81526001600160a01b03828116600483015260609184916000919083169063768a90609060240160006040518083038186803b15801561032f57600080fd5b505afa158015610343573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261036b9190810190610953565b80519091506000808267ffffffffffffffff81111561039a57634e487b7160e01b600052604160045260246000fd5b6040519080825280602002602001820160405280156103d357816020015b6103c06107e3565b8152602001906001900390816103b85790505b50905060005b838110156104db57600085828151811061040357634e487b7160e01b600052603260045260246000fd5b602002602001015190506000876001600160a01b031663b6295710836040518263ffffffff1660e01b815260040161043d91815260200190565b60e06040518083038186803b15801561045557600080fd5b505afa158015610469573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061048d91906109da565b905080848661049b81610b73565b9750815181106104bb57634e487b7160e01b600052603260045260246000fd5b6020026020010181905250505080806104d390610b73565b9150506103d9565b50979650505050505050565b6000546001600160a01b031633146105465760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064015b60405180910390fd5b6105506000610793565b565b8051606090600084818367ffffffffffffffff81111561058257634e487b7160e01b600052604160045260246000fd5b6040519080825280602002602001820160405280156105bb57816020015b6105a86107e3565b8152602001906001900390816105a05790505b50905060005b848110156106bd576000836001600160a01b031663b62957108984815181106105fa57634e487b7160e01b600052603260045260246000fd5b60200260200101516040518263ffffffff1660e01b815260040161062091815260200190565b60e06040518083038186803b15801561063857600080fd5b505afa15801561064c573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061067091906109da565b905080838661067e81610b73565b97508151811061069e57634e487b7160e01b600052603260045260246000fd5b60200260200101819052505080806106b590610b73565b9150506105c1565b509695505050505050565b6000546001600160a01b031633146107225760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161053d565b6001600160a01b0381166107875760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161053d565b61079081610793565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6040518060e001604052806000815260200160006001600160a01b0316815260200160006001600160a01b031681526020016000815260200160006001600160a01b0316815260200160008152602001600081525090565b805161084681610bb0565b919050565b60006020828403121561085c578081fd5b813561086781610bb0565b9392505050565b60008060408385031215610880578081fd5b823561088b81610bb0565b9150602083013561089b81610bb0565b809150509250929050565b600080604083850312156108b8578182fd5b82356108c381610bb0565b915060208381013567ffffffffffffffff8111156108df578283fd5b8401601f810186136108ef578283fd5b80356109026108fd82610b4f565b610b1e565b80828252848201915084840189868560051b8701011115610921578687fd5b8694505b83851015610943578035835260019490940193918501918501610925565b5080955050505050509250929050565b60006020808385031215610965578182fd5b825167ffffffffffffffff81111561097b578283fd5b8301601f8101851361098b578283fd5b80516109996108fd82610b4f565b80828252848201915084840188868560051b87010111156109b8578687fd5b8694505b838510156104db5780518352600194909401939185019185016109bc565b600060e082840312156109eb578081fd5b60405160e0810181811067ffffffffffffffff82111715610a0e57610a0e610b9a565b604052825181526020830151610a2381610bb0565b60208201526040830151610a3681610bb0565b604082015260608381015190820152610a516080840161083b565b608082015260a083015160a082015260c083015160c08201528091505092915050565b600060208284031215610a85578081fd5b5051919050565b602080825282518282018190526000919060409081850190868401855b82811015610b1157815180518552868101516001600160a01b039081168887015286820151811687870152606080830151908701526080808301519091169086015260a0808201519086015260c0908101519085015260e09093019290850190600101610aa9565b5091979650505050505050565b604051601f8201601f1916810167ffffffffffffffff81118282101715610b4757610b47610b9a565b604052919050565b600067ffffffffffffffff821115610b6957610b69610b9a565b5060051b60200190565b6000600019821415610b9357634e487b7160e01b81526011600452602481fd5b5060010190565b634e487b7160e01b600052604160045260246000fd5b6001600160a01b038116811461079057600080fdfea2646970667358221220b2f73aab7263c1f4298180c3402ff66cc7430531dca19a292459ae502485ba2564736f6c63430008040033";
