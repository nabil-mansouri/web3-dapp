/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface ITokenGeneratorInterface extends ethers.utils.Interface {
  functions: {
    "mintERC1155(address,uint256,uint256,uint256)": FunctionFragment;
    "mintERC721(address,uint256,uint256)": FunctionFragment;
    "seeManagerCount()": FunctionFragment;
    "seeManagerIds()": FunctionFragment;
    "seeManagerIdsFor(address)": FunctionFragment;
    "seeManagersFor(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "mintERC1155",
    values: [string, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "mintERC721",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "seeManagerCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "seeManagerIds",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "seeManagerIdsFor",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "seeManagersFor",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "mintERC1155",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mintERC721", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "seeManagerCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "seeManagerIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "seeManagerIdsFor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "seeManagersFor",
    data: BytesLike
  ): Result;

  events: {};
}

export class ITokenGenerator extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: ITokenGeneratorInterface;

  functions: {
    mintERC1155(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      _quantity: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "mintERC1155(address,uint256,uint256,uint256)"(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      _quantity: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    mintERC721(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "mintERC721(address,uint256,uint256)"(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    seeManagerCount(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "seeManagerCount()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    seeManagerIds(overrides?: CallOverrides): Promise<{
      0: BigNumber[];
    }>;

    "seeManagerIds()"(overrides?: CallOverrides): Promise<{
      0: BigNumber[];
    }>;

    seeManagerIdsFor(
      owner: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber[];
    }>;

    "seeManagerIdsFor(address)"(
      owner: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber[];
    }>;

    seeManagersFor(
      owner: string,
      overrides?: CallOverrides
    ): Promise<{
      0: {
        _id: BigNumber;
        _address: string;
        _owner: string;
        _supply: BigNumber;
        _nftaddr: string;
        _nftid: BigNumber;
        _quantity: BigNumber;
        0: BigNumber;
        1: string;
        2: string;
        3: BigNumber;
        4: string;
        5: BigNumber;
        6: BigNumber;
      }[];
    }>;

    "seeManagersFor(address)"(
      owner: string,
      overrides?: CallOverrides
    ): Promise<{
      0: {
        _id: BigNumber;
        _address: string;
        _owner: string;
        _supply: BigNumber;
        _nftaddr: string;
        _nftid: BigNumber;
        _quantity: BigNumber;
        0: BigNumber;
        1: string;
        2: string;
        3: BigNumber;
        4: string;
        5: BigNumber;
        6: BigNumber;
      }[];
    }>;
  };

  mintERC1155(
    _nftaddr: string,
    _nftid: BigNumberish,
    _supply: BigNumberish,
    _quantity: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "mintERC1155(address,uint256,uint256,uint256)"(
    _nftaddr: string,
    _nftid: BigNumberish,
    _supply: BigNumberish,
    _quantity: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  mintERC721(
    _nftaddr: string,
    _nftid: BigNumberish,
    _supply: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "mintERC721(address,uint256,uint256)"(
    _nftaddr: string,
    _nftid: BigNumberish,
    _supply: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  seeManagerCount(overrides?: CallOverrides): Promise<BigNumber>;

  "seeManagerCount()"(overrides?: CallOverrides): Promise<BigNumber>;

  seeManagerIds(overrides?: CallOverrides): Promise<BigNumber[]>;

  "seeManagerIds()"(overrides?: CallOverrides): Promise<BigNumber[]>;

  seeManagerIdsFor(
    owner: string,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  "seeManagerIdsFor(address)"(
    owner: string,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  seeManagersFor(
    owner: string,
    overrides?: CallOverrides
  ): Promise<
    {
      _id: BigNumber;
      _address: string;
      _owner: string;
      _supply: BigNumber;
      _nftaddr: string;
      _nftid: BigNumber;
      _quantity: BigNumber;
      0: BigNumber;
      1: string;
      2: string;
      3: BigNumber;
      4: string;
      5: BigNumber;
      6: BigNumber;
    }[]
  >;

  "seeManagersFor(address)"(
    owner: string,
    overrides?: CallOverrides
  ): Promise<
    {
      _id: BigNumber;
      _address: string;
      _owner: string;
      _supply: BigNumber;
      _nftaddr: string;
      _nftid: BigNumber;
      _quantity: BigNumber;
      0: BigNumber;
      1: string;
      2: string;
      3: BigNumber;
      4: string;
      5: BigNumber;
      6: BigNumber;
    }[]
  >;

  callStatic: {
    mintERC1155(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      _quantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "mintERC1155(address,uint256,uint256,uint256)"(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      _quantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    mintERC721(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "mintERC721(address,uint256,uint256)"(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    seeManagerCount(overrides?: CallOverrides): Promise<BigNumber>;

    "seeManagerCount()"(overrides?: CallOverrides): Promise<BigNumber>;

    seeManagerIds(overrides?: CallOverrides): Promise<BigNumber[]>;

    "seeManagerIds()"(overrides?: CallOverrides): Promise<BigNumber[]>;

    seeManagerIdsFor(
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    "seeManagerIdsFor(address)"(
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    seeManagersFor(
      owner: string,
      overrides?: CallOverrides
    ): Promise<
      {
        _id: BigNumber;
        _address: string;
        _owner: string;
        _supply: BigNumber;
        _nftaddr: string;
        _nftid: BigNumber;
        _quantity: BigNumber;
        0: BigNumber;
        1: string;
        2: string;
        3: BigNumber;
        4: string;
        5: BigNumber;
        6: BigNumber;
      }[]
    >;

    "seeManagersFor(address)"(
      owner: string,
      overrides?: CallOverrides
    ): Promise<
      {
        _id: BigNumber;
        _address: string;
        _owner: string;
        _supply: BigNumber;
        _nftaddr: string;
        _nftid: BigNumber;
        _quantity: BigNumber;
        0: BigNumber;
        1: string;
        2: string;
        3: BigNumber;
        4: string;
        5: BigNumber;
        6: BigNumber;
      }[]
    >;
  };

  filters: {};

  estimateGas: {
    mintERC1155(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      _quantity: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "mintERC1155(address,uint256,uint256,uint256)"(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      _quantity: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    mintERC721(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "mintERC721(address,uint256,uint256)"(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    seeManagerCount(overrides?: CallOverrides): Promise<BigNumber>;

    "seeManagerCount()"(overrides?: CallOverrides): Promise<BigNumber>;

    seeManagerIds(overrides?: CallOverrides): Promise<BigNumber>;

    "seeManagerIds()"(overrides?: CallOverrides): Promise<BigNumber>;

    seeManagerIdsFor(
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "seeManagerIdsFor(address)"(
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    seeManagersFor(
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "seeManagersFor(address)"(
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    mintERC1155(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      _quantity: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "mintERC1155(address,uint256,uint256,uint256)"(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      _quantity: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    mintERC721(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "mintERC721(address,uint256,uint256)"(
      _nftaddr: string,
      _nftid: BigNumberish,
      _supply: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    seeManagerCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "seeManagerCount()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    seeManagerIds(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "seeManagerIds()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    seeManagerIdsFor(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "seeManagerIdsFor(address)"(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    seeManagersFor(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "seeManagersFor(address)"(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
