/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { Vault } from "./Vault";

export class VaultFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _fractions: string,
    _fractionsID: BigNumberish,
    _underlying: string,
    _underlyingID: BigNumberish,
    _curator: string,
    overrides?: Overrides
  ): Promise<Vault> {
    return super.deploy(
      _fractions,
      _fractionsID,
      _underlying,
      _underlyingID,
      _curator,
      overrides || {}
    ) as Promise<Vault>;
  }
  getDeployTransaction(
    _fractions: string,
    _fractionsID: BigNumberish,
    _underlying: string,
    _underlyingID: BigNumberish,
    _curator: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(
      _fractions,
      _fractionsID,
      _underlying,
      _underlyingID,
      _curator,
      overrides || {}
    );
  }
  attach(address: string): Vault {
    return super.attach(address) as Vault;
  }
  connect(signer: Signer): VaultFactory {
    return super.connect(signer) as VaultFactory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Vault {
    return new Contract(address, _abi, signerOrProvider) as Vault;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_fractions",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_fractionsID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_underlying",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_underlyingID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_curator",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "Bid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Cash",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "PriceUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "redeemer",
        type: "address",
      },
    ],
    name: "Redeem",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "Start",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "WithdrawERC1155",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "WithdrawERC20",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "WithdrawERC721",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "WithdrawETH",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "Won",
    type: "event",
  },
  {
    inputs: [],
    name: "LENGTH",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "auctionEnd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "auctionState",
    outputs: [
      {
        internalType: "enum Vault.State",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "cash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "curator",
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
    name: "end",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "fractions",
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
    name: "fractionsID",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "id",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "isLivePrice",
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
    name: "livePrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
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
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
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
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "onTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "priceToCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "redeem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reservePrice",
    outputs: [
      {
        internalType: "uint256",
        name: "voting",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reserve",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "settings",
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
    name: "start",
    outputs: [],
    stateMutability: "payable",
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
  {
    inputs: [],
    name: "token",
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
    name: "underlying",
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
    name: "underlyingID",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_new",
        type: "uint256",
      },
    ],
    name: "updateUserPrice",
    outputs: [],
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
    ],
    name: "userPrices",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "weth",
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
    name: "winning",
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
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdrawERC1155",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "withdrawERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "withdrawERC721",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x6101806040526003610140819052620322e360ec1b610160908152620000299160009190620000a0565b506003805460ff60a81b191690553480156200004457600080fd5b5060405162002e9f38038062002e9f833981016040819052620000679162000163565b33606090811b6080526001600160601b031995811b861660c05260e09490945291831b84166101005261012052901b1660a052620001fd565b828054620000ae90620001c0565b90600052602060002090601f016020900481019282620000d257600085556200011d565b82601f10620000ed57805160ff19168380011785556200011d565b828001600101855582156200011d579182015b828111156200011d57825182559160200191906001019062000100565b506200012b9291506200012f565b5090565b5b808211156200012b576000815560010162000130565b80516001600160a01b03811681146200015e57600080fd5b919050565b600080600080600060a086880312156200017b578081fd5b620001868662000146565b9450602086015193506200019d6040870162000146565b925060608601519150620001b46080870162000146565b90509295509295909350565b600181811c90821680620001d557607f821691505b60208210811415620001f757634e487b7160e01b600052602260045260246000fd5b50919050565b60805160601c60a05160601c60c05160601c60e0516101005160601c61012051612b9762000308600039600081816104fa015281816105d00152818161126501526118fe0152600081816103d1015281816106ff0152818161128b01526119240152600081816104c901528181610c5301528181610e0301528181610f0e01528181610fe2015281816111320152818161141701528181611fa901526120c001526000818161045301528181610a9801528181610c7c01528181610e2c01528181610f3701528181611012015281816111620152818161143d01528181611fcf01526120e60152600061064d015260008181610604015281816119aa0152611a4c0152612b976000f3fe6080604052600436106101fd5760003560e01c8063961be3911161010d578063dfbf12f8116100a0578063efbe1c1c1161006f578063efbe1c1c1461066f578063f23a6e6114610684578063f3e414f8146106b0578063f4f3b200146106d0578063fc0c546a146106f057600080fd5b8063dfbf12f8146105be578063e06174e4146105f2578063e086e5ec14610626578063e66f53b71461063b57600080fd5b8063be040fb0116100dc578063be040fb01461054a578063be9a65551461055f578063c91de64914610567578063db2e1eed1461059457600080fd5b8063961be391146104a2578063aa6c35e4146104b7578063af640d0f146104eb578063bc197c811461051e57600080fd5b806354fd4d50116101905780636f307dc31161015f5780636f307dc3146103bf5780637fb45099146103f3578063853a1b901461042157806386d69577146104415780638b0c46b31461047557600080fd5b806354fd4d50146103475780635b96bd26146103695780636a775714146103895780636da84e6c146103a957600080fd5b80632e663652116101cc5780632e663652146102b057806339ead720146102c75780633fc8cef3146102e75780634a3931491461032757600080fd5b806301ffc9a714610209578063150b7a021461023e5780631998aeef146102825780632a24f46c1461028c57600080fd5b3661020457005b600080fd5b34801561021557600080fd5b506102296102243660046128f9565b610723565b60405190151581526020015b60405180910390f35b34801561024a57600080fd5b506102696102593660046127a9565b630a85bd0160e11b949350505050565b6040516001600160e01b03199091168152602001610235565b61028a61075a565b005b34801561029857600080fd5b506102a260015481565b604051908152602001610235565b3480156102bc57600080fd5b506102a26202a30081565b3480156102d357600080fd5b5061028a6102e23660046128a5565b610913565b3480156102f357600080fd5b5061030f73c02aaa39b223fe8d0a0e5c4f27ead9083c756cc281565b6040516001600160a01b039091168152602001610235565b34801561033357600080fd5b5061028a610342366004612769565b610a8d565b34801561035357600080fd5b5061035c610ba4565b6040516102359190612979565b34801561037557600080fd5b50610229610384366004612921565b610c32565b34801561039557600080fd5b5061028a6103a4366004612921565b610c3f565b3480156103b557600080fd5b506102a260025481565b3480156103cb57600080fd5b5061030f7f000000000000000000000000000000000000000000000000000000000000000081565b3480156103ff57600080fd5b5060035461041490600160a01b900460ff1681565b6040516102359190612951565b34801561042d57600080fd5b5060035461030f906001600160a01b031681565b34801561044d57600080fd5b5061030f7f000000000000000000000000000000000000000000000000000000000000000081565b34801561048157600080fd5b506102a2610490366004612921565b60066020526000908152604090205481565b3480156104ae57600080fd5b5061028a610d74565b3480156104c357600080fd5b506102a27f000000000000000000000000000000000000000000000000000000000000000081565b3480156104f757600080fd5b507f00000000000000000000000000000000000000000000000000000000000000006102a2565b34801561052a57600080fd5b506102696105393660046126bf565b63bc197c8160e01b95945050505050565b34801561055657600080fd5b5061028a6110b2565b61028a61133a565b34801561057357600080fd5b506102a2610582366004612687565b60076020526000908152604090205481565b3480156105a057600080fd5b506105a961157b565b60408051928352602083019190915201610235565b3480156105ca57600080fd5b506102a27f000000000000000000000000000000000000000000000000000000000000000081565b3480156105fe57600080fd5b5061030f7f000000000000000000000000000000000000000000000000000000000000000081565b34801561063257600080fd5b5061028a611712565b34801561064757600080fd5b5061030f7f000000000000000000000000000000000000000000000000000000000000000081565b34801561067b57600080fd5b5061028a611816565b34801561069057600080fd5b5061026961069f366004612813565b63f23a6e6160e01b95945050505050565b3480156106bc57600080fd5b5061028a6106cb36600461287a565b611b31565b3480156106dc57600080fd5b5061028a6106eb366004612687565b611c85565b3480156106fc57600080fd5b507f000000000000000000000000000000000000000000000000000000000000000061030f565b60006001600160e01b03198216630271189760e51b148061075457506301ffc9a760e01b6001600160e01b03198316145b92915050565b600160038054600160a01b900460ff169081111561078857634e487b7160e01b600052602160045260246000fd5b146107da5760405162461bcd60e51b815260206004820152601760248201527f6269643a61756374696f6e206973206e6f74206c69766500000000000000000060448201526064015b60405180910390fd5b6002546107e8906069612a91565b6107f3346064612a91565b10156108335760405162461bcd60e51b815260206004820152600f60248201526e189a590e9d1bdbc81b1bddc8189a59608a1b60448201526064016107d1565b60015442106108785760405162461bcd60e51b8152602060048201526011602482015270189a590e985d58dd1a5bdb88195b991959607a1b60448201526064016107d1565b610384426001546108899190612ab0565b116108a857610384600160008282546108a29190612a59565b90915550505b6003546002546108c1916001600160a01b031690611e68565b346002819055600380546001600160a01b03191633908117909155604051918252907fe684a55f31b79eca403df938249029212a5925ec6be8012e099b45bc1019e5d2906020015b60405180910390a2565b600260038054600160a01b900460ff169081111561094157634e487b7160e01b600052602160045260246000fd5b148061097757506003808054600160a01b900460ff169081111561097557634e487b7160e01b600052602160045260246000fd5b145b6109935760405162461bcd60e51b81526004016107d1906129cc565b6003546001600160a01b031633146109bd5760405162461bcd60e51b81526004016107d1906129fa565b604051637921219560e11b8152306004820152336024820152604481018390526064810182905260a06084820152600160a4820152600360fc1b60c48201526001600160a01b0384169063f242432a9060e401600060405180830381600087803b158015610a2a57600080fd5b505af1158015610a3e573d6000803e3d6000fd5b505060408051858152602081018590523393506001600160a01b03871692507ffb5471fdf60f5b676c3aab864f67d0be1f974c75f74cff7675295cfb339f9940910160405180910390a3505050565b336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610af35760405162461bcd60e51b815260206004820152600b60248201526a1b9bdd08185b1b1bddd95960aa1b60448201526064016107d1565b6001600160a01b038216610b2a576001600160a01b038316600090815260076020526040902054610b25908290611f77565b505050565b6001600160a01b038316610b5c576001600160a01b038216600090815260076020526040902054610b2590829061208e565b6001600160a01b038316600090815260076020526040902054610b80908290611f77565b6001600160a01b038216600090815260076020526040902054610b2590829061208e565b60008054610bb190612ac7565b80601f0160208091040260200160405190810160405280929190818152602001828054610bdd90612ac7565b8015610c2a5780601f10610bff57610100808354040283529160200191610c2a565b820191906000526020600020905b815481529060010190602001808311610c0d57829003601f168201915b505050505081565b60006107546004836121a8565b604051627eeac760e11b81523360048201527f000000000000000000000000000000000000000000000000000000000000000060248201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169062fdd58e9060440160206040518083038186803b158015610cc557600080fd5b505afa158015610cd9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cfd9190612939565b9050610d09818361208e565b33600090815260076020526040902054610d24908290611f77565b3360008181526007602052604090819020849055517f64e6e7bd72b853c4e62fd6ceaca05a104700c70a4cb567c75c7f2242ba7f037c90610d689085815260200190565b60405180910390a25050565b600260038054600160a01b900460ff1690811115610da257634e487b7160e01b600052602160045260246000fd5b14610def5760405162461bcd60e51b815260206004820152601960248201527f636173683a7661756c74206e6f7420636c6f736564207965740000000000000060448201526064016107d1565b604051627eeac760e11b81523360048201527f000000000000000000000000000000000000000000000000000000000000000060248201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169062fdd58e9060440160206040518083038186803b158015610e7557600080fd5b505afa158015610e89573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ead9190612939565b905060008111610eff5760405162461bcd60e51b815260206004820152601a60248201527f636173683a6e6f20746f6b656e7320746f2063617368206f757400000000000060448201526064016107d1565b60405163bd85b03960e01b81527f000000000000000000000000000000000000000000000000000000000000000060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063bd85b0399060240160206040518083038186803b158015610f8157600080fd5b505afa158015610f95573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fb99190612939565b610fc34784612a91565b610fcd9190612a71565b604051637a94c56560e11b81523360048201527f00000000000000000000000000000000000000000000000000000000000000006024820152604481018490529091507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063f5298aca90606401600060405180830381600087803b15801561105e57600080fd5b505af1158015611072573d6000803e3d6000fd5b505050506110803382611e68565b60405181815233907f730831a1e4aa2d187ddd8e03d7beeac760a3927da5f112d645e0f8df7494b36790602001610d68565b600060038054600160a01b900460ff16908111156110e057634e487b7160e01b600052602160045260246000fd5b146111235760405162461bcd60e51b815260206004820152601360248201527272656465656d3a6e6f2072656465656d696e6760681b60448201526064016107d1565b60405163bd85b03960e01b81527f0000000000000000000000000000000000000000000000000000000000000000600482018190526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169163f5298aca913391849063bd85b0399060240160206040518083038186803b1580156111ae57600080fd5b505afa1580156111c2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111e69190612939565b6040516001600160e01b031960e086901b1681526001600160a01b03909316600484015260248301919091526044820152606401600060405180830381600087803b15801561123457600080fd5b505af1158015611248573d6000803e3d6000fd5b50506040516323b872dd60e01b81523060048201523360248201527f000000000000000000000000000000000000000000000000000000000000000060448201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031692506323b872dd9150606401600060405180830381600087803b1580156112d957600080fd5b505af11580156112ed573d6000803e3d6000fd5b505060038054336001600160a81b03199091168117600360a01b179091556040519092507fd1b5ea7fe0f1c2fa09d49c2aa9b2200664ba57a734f1d95481d95b7f99af991c9150600090a2565b600060038054600160a01b900460ff169081111561136857634e487b7160e01b600052602160045260246000fd5b146113b55760405162461bcd60e51b815260206004820152601760248201527f73746172743a6e6f2061756374696f6e2073746172747300000000000000000060448201526064016107d1565b6000806113c061157b565b91509150803410156114085760405162461bcd60e51b81526020600482015260116024820152701cdd185c9d0e9d1bdbc81b1bddc8189a59607a1b60448201526064016107d1565b60405163bd85b03960e01b81527f000000000000000000000000000000000000000000000000000000000000000060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063bd85b0399060240160206040518083038186803b15801561148757600080fd5b505afa15801561149b573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114bf9190612939565b6114ca836002612a91565b10156115185760405162461bcd60e51b815260206004820152601760248201527f73746172743a6e6f7420656e6f75676820766f7465727300000000000000000060448201526064016107d1565b6115256202a30042612a59565b600155600380543460028190556001600160a81b031990911633908117600160a01b179092556040519081527fcfb9c5312b25ec7b809d61e638df25f749eae5d5c25399e1c93d1d319bfd582190602001610d68565b600080600061158a60046121c3565b905061159981600083516121d0565b6000925060005b8151811015611633578181815181106115c957634e487b7160e01b600052603260045260246000fd5b602002602001015160001461162157600660008383815181106115fc57634e487b7160e01b600052603260045260246000fd5b60200260200101518152602001908152602001600020548461161e9190612a59565b93505b8061162b81612b02565b9150506115a0565b506000805b825181101561170b5782818151811061166157634e487b7160e01b600052603260045260246000fd5b60200260200101516000146116b9576006600084838151811061169457634e487b7160e01b600052603260045260246000fd5b6020026020010151815260200190815260200160002054826116b69190612a59565b91505b846116c5836002612a91565b106116f9578281815181106116ea57634e487b7160e01b600052603260045260246000fd5b6020026020010151935061170b565b8061170381612b02565b915050611638565b5050509091565b600260038054600160a01b900460ff169081111561174057634e487b7160e01b600052602160045260246000fd5b148061177657506003808054600160a01b900460ff169081111561177457634e487b7160e01b600052602160045260246000fd5b145b6117925760405162461bcd60e51b81526004016107d1906129cc565b6003546001600160a01b031633146117bc5760405162461bcd60e51b81526004016107d1906129fa565b60405133904780156108fc02916000818181858888f193505050501580156117e8573d6000803e3d6000fd5b5060405133907ff6c62f95390a4a6ee24f778d79a6ce6e34dd01136e291fb3b7ff0fc1919540a290600090a2565b600160038054600160a01b900460ff169081111561184457634e487b7160e01b600052602160045260246000fd5b146118915760405162461bcd60e51b815260206004820152601c60248201527f656e643a7661756c742068617320616c726561647920636c6f7365640000000060448201526064016107d1565b6001544210156118d65760405162461bcd60e51b815260206004820152601060248201526f656e643a61756374696f6e206c69766560801b60448201526064016107d1565b6003546040516323b872dd60e01b81523060048201526001600160a01b0391821660248201527f000000000000000000000000000000000000000000000000000000000000000060448201527f0000000000000000000000000000000000000000000000000000000000000000909116906323b872dd90606401600060405180830381600087803b15801561196a57600080fd5b505af115801561197e573d6000803e3d6000fd5b5050600380546002935090915060ff60a01b1916600160a01b83021790555060006001600160a01b03167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663b3f006746040518163ffffffff1660e01b815260040160206040518083038186803b158015611a0157600080fd5b505afa158015611a15573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a3991906126a3565b6001600160a01b031614611aef57611aef7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663b3f006746040518163ffffffff1660e01b815260040160206040518083038186803b158015611aa357600080fd5b505afa158015611ab7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611adb91906126a3565b6028600254611aea9190612a71565b611e68565b6003546002546040519081526001600160a01b03909116907f8b01f9dd0400d6a1e84369a5fb8f6033934856ffa8ebadd707dca302ab55169590602001610909565b600260038054600160a01b900460ff1690811115611b5f57634e487b7160e01b600052602160045260246000fd5b1480611b9557506003808054600160a01b900460ff1690811115611b9357634e487b7160e01b600052602160045260246000fd5b145b611bb15760405162461bcd60e51b81526004016107d1906129cc565b6003546001600160a01b03163314611bdb5760405162461bcd60e51b81526004016107d1906129fa565b6040516323b872dd60e01b8152306004820152336024820152604481018290526001600160a01b038316906323b872dd90606401600060405180830381600087803b158015611c2957600080fd5b505af1158015611c3d573d6000803e3d6000fd5b50506040518381523392506001600160a01b03851691507f7d7d06fee8f280e47a7b6a0548f6dffbe5df52f1c1eb012a0d6a41f4a0f350c99060200160405180910390a35050565b600260038054600160a01b900460ff1690811115611cb357634e487b7160e01b600052602160045260246000fd5b1480611ce957506003808054600160a01b900460ff1690811115611ce757634e487b7160e01b600052602160045260246000fd5b145b611d055760405162461bcd60e51b81526004016107d1906129cc565b6003546001600160a01b03163314611d2f5760405162461bcd60e51b81526004016107d1906129fa565b6040516370a0823160e01b81523060048201526001600160a01b0382169063a9059cbb90339083906370a082319060240160206040518083038186803b158015611d7857600080fd5b505afa158015611d8c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611db09190612939565b6040516001600160e01b031960e085901b1681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b158015611df657600080fd5b505af1158015611e0a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611e2e91906128d9565b5060405133906001600160a01b038316907fa44616ec07d22ce15ebd7a567b7c16dd91a89f056f5e14f8ef7a6aa40a89b9b290600090a350565b611e7282826122ab565b611f735773c02aaa39b223fe8d0a0e5c4f27ead9083c756cc26001600160a01b031663d0e30db0826040518263ffffffff1660e01b81526004016000604051808303818588803b158015611ec557600080fd5b505af1158015611ed9573d6000803e3d6000fd5b505060405163a9059cbb60e01b81526001600160a01b03861660048201526024810185905273c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2935063a9059cbb92506044019050602060405180830381600087803b158015611f3b57600080fd5b505af1158015611f4f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b2591906128d9565b5050565b60008181526006602052604081208054849290611f95908490612ab0565b909155505060405163bd85b03960e01b81527f000000000000000000000000000000000000000000000000000000000000000060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063bd85b0399060240160206040518083038186803b15801561201957600080fd5b505afa15801561202d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906120519190612939565b60008281526006602052604090205461206b906064612a91565b10801561207e575061207e6004826121a8565b15611f7357610b2560048261230e565b600081815260066020526040812080548492906120ac908490612a59565b909155505060405163bd85b03960e01b81527f000000000000000000000000000000000000000000000000000000000000000060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063bd85b0399060240160206040518083038186803b15801561213057600080fd5b505afa158015612144573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906121689190612939565b600082815260066020526040902054612182906064612a91565b1015801561219857506121966004826121a8565b155b15611f7357610b2560048261231a565b600081815260018301602052604081205415155b9392505050565b606060006121bc83612326565b80821015610b2557600082905060008482815181106121ff57634e487b7160e01b600052603260045260246000fd5b6020026020010151905060008460016122189190612a59565b90505b83811015612278578186828151811061224457634e487b7160e01b600052603260045260246000fd5b6020026020010151101561226857612268868261226086612b02565b955085612382565b61227181612b02565b905061221b565b50612284858584612382565b61228f8585846121d0565b6122a48561229e846001612a59565b856121d0565b5050505050565b600080836001600160a01b03168361753090604051600060405180830381858888f193505050503d80600081146122fe576040519150601f19603f3d011682016040523d82523d6000602084013e612303565b606091505b509095945050505050565b60006121bc838361242d565b60006121bc838361254a565b60608160000180548060200260200160405190810160405280929190818152602001828054801561237657602002820191906000526020600020905b815481526020019060010190808311612362575b50505050509050919050565b8281815181106123a257634e487b7160e01b600052603260045260246000fd5b60200260200101518383815181106123ca57634e487b7160e01b600052603260045260246000fd5b60200260200101518484815181106123f257634e487b7160e01b600052603260045260246000fd5b6020026020010185848151811061241957634e487b7160e01b600052603260045260246000fd5b602090810291909101019190915252505050565b60008181526001830160205260408120548015612540576000612451600183612ab0565b855490915060009061246590600190612ab0565b90508181146124e657600086600001828154811061249357634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050808760000184815481106124c457634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b855486908061250557634e487b7160e01b600052603160045260246000fd5b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610754565b6000915050610754565b600081815260018301602052604081205461259157508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610754565b506000610754565b600082601f8301126125a9578081fd5b8135602067ffffffffffffffff8211156125c5576125c5612b33565b8160051b6125d4828201612a28565b8381528281019086840183880185018910156125ee578687fd5b8693505b858410156126105780358352600193909301929184019184016125f2565b50979650505050505050565b600082601f83011261262c578081fd5b813567ffffffffffffffff81111561264657612646612b33565b612659601f8201601f1916602001612a28565b81815284602083860101111561266d578283fd5b816020850160208301379081016020019190915292915050565b600060208284031215612698578081fd5b81356121bc81612b49565b6000602082840312156126b4578081fd5b81516121bc81612b49565b600080600080600060a086880312156126d6578081fd5b85356126e181612b49565b945060208601356126f181612b49565b9350604086013567ffffffffffffffff8082111561270d578283fd5b61271989838a01612599565b9450606088013591508082111561272e578283fd5b61273a89838a01612599565b9350608088013591508082111561274f578283fd5b5061275c8882890161261c565b9150509295509295909350565b60008060006060848603121561277d578283fd5b833561278881612b49565b9250602084013561279881612b49565b929592945050506040919091013590565b600080600080608085870312156127be578384fd5b84356127c981612b49565b935060208501356127d981612b49565b925060408501359150606085013567ffffffffffffffff8111156127fb578182fd5b6128078782880161261c565b91505092959194509250565b600080600080600060a0868803121561282a578081fd5b853561283581612b49565b9450602086013561284581612b49565b93506040860135925060608601359150608086013567ffffffffffffffff81111561286e578182fd5b61275c8882890161261c565b6000806040838503121561288c578182fd5b823561289781612b49565b946020939093013593505050565b6000806000606084860312156128b9578283fd5b83356128c481612b49565b95602085013595506040909401359392505050565b6000602082840312156128ea578081fd5b815180151581146121bc578182fd5b60006020828403121561290a578081fd5b81356001600160e01b0319811681146121bc578182fd5b600060208284031215612932578081fd5b5035919050565b60006020828403121561294a578081fd5b5051919050565b602081016004831061297357634e487b7160e01b600052602160045260246000fd5b91905290565b6000602080835283518082850152825b818110156129a557858101830151858201604001528201612989565b818111156129b65783604083870101525b50601f01601f1916929092016040019392505050565b6020808252601490820152731d985d5b1d081b9bdd0818db1bdcd959081e595d60621b604082015260600190565b6020808252601490820152731dda5d1a191c985dce9b9bdd08185b1b1bddd95960621b604082015260600190565b604051601f8201601f1916810167ffffffffffffffff81118282101715612a5157612a51612b33565b604052919050565b60008219821115612a6c57612a6c612b1d565b500190565b600082612a8c57634e487b7160e01b81526012600452602481fd5b500490565b6000816000190483118215151615612aab57612aab612b1d565b500290565b600082821015612ac257612ac2612b1d565b500390565b600181811c90821680612adb57607f821691505b60208210811415612afc57634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415612b1657612b16612b1d565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b0381168114612b5e57600080fd5b5056fea2646970667358221220fe38575b39ffb995d5c62070918d449e470928e247a7793947858d53eec2ebe864736f6c63430008040033";
