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

interface ViewInterface extends ethers.utils.Interface {
  functions: {
    "owner()": FunctionFragment;
    "paused()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "seeManagers(address)": FunctionFragment;
    "seeManagersFor(address,address)": FunctionFragment;
    "seeManagersForIds(address,uint256[])": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "seeManagers", values: [string]): string;
  encodeFunctionData(
    functionFragment: "seeManagersFor",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "seeManagersForIds",
    values: [string, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "seeManagers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "seeManagersFor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "seeManagersForIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "Paused(address)": EventFragment;
    "Unpaused(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
}

export class View extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: ViewInterface;

  functions: {
    owner(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    "owner()"(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    paused(overrides?: CallOverrides): Promise<{
      0: boolean;
    }>;

    "paused()"(overrides?: CallOverrides): Promise<{
      0: boolean;
    }>;

    renounceOwnership(overrides?: Overrides): Promise<ContractTransaction>;

    "renounceOwnership()"(overrides?: Overrides): Promise<ContractTransaction>;

    seeManagers(
      _contract: string,
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

    "seeManagers(address)"(
      _contract: string,
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

    seeManagersFor(
      _contract: string,
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

    "seeManagersFor(address,address)"(
      _contract: string,
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

    seeManagersForIds(
      _contract: string,
      ids: BigNumberish[],
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

    "seeManagersForIds(address,uint256[])"(
      _contract: string,
      ids: BigNumberish[],
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

    transferOwnership(
      newOwner: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  owner(overrides?: CallOverrides): Promise<string>;

  "owner()"(overrides?: CallOverrides): Promise<string>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  "paused()"(overrides?: CallOverrides): Promise<boolean>;

  renounceOwnership(overrides?: Overrides): Promise<ContractTransaction>;

  "renounceOwnership()"(overrides?: Overrides): Promise<ContractTransaction>;

  seeManagers(
    _contract: string,
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

  "seeManagers(address)"(
    _contract: string,
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

  seeManagersFor(
    _contract: string,
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

  "seeManagersFor(address,address)"(
    _contract: string,
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

  seeManagersForIds(
    _contract: string,
    ids: BigNumberish[],
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

  "seeManagersForIds(address,uint256[])"(
    _contract: string,
    ids: BigNumberish[],
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

  transferOwnership(
    newOwner: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "transferOwnership(address)"(
    newOwner: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    owner(overrides?: CallOverrides): Promise<string>;

    "owner()"(overrides?: CallOverrides): Promise<string>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    "paused()"(overrides?: CallOverrides): Promise<boolean>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    "renounceOwnership()"(overrides?: CallOverrides): Promise<void>;

    seeManagers(
      _contract: string,
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

    "seeManagers(address)"(
      _contract: string,
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

    seeManagersFor(
      _contract: string,
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

    "seeManagersFor(address,address)"(
      _contract: string,
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

    seeManagersForIds(
      _contract: string,
      ids: BigNumberish[],
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

    "seeManagersForIds(address,uint256[])"(
      _contract: string,
      ids: BigNumberish[],
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

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    OwnershipTransferred(
      previousOwner: string | null,
      newOwner: string | null
    ): EventFilter;

    Paused(account: null): EventFilter;

    Unpaused(account: null): EventFilter;
  };

  estimateGas: {
    owner(overrides?: CallOverrides): Promise<BigNumber>;

    "owner()"(overrides?: CallOverrides): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    "paused()"(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides): Promise<BigNumber>;

    "renounceOwnership()"(overrides?: Overrides): Promise<BigNumber>;

    seeManagers(
      _contract: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "seeManagers(address)"(
      _contract: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    seeManagersFor(
      _contract: string,
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "seeManagersFor(address,address)"(
      _contract: string,
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    seeManagersForIds(
      _contract: string,
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "seeManagersForIds(address,uint256[])"(
      _contract: string,
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "owner()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "paused()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides): Promise<PopulatedTransaction>;

    "renounceOwnership()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    seeManagers(
      _contract: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "seeManagers(address)"(
      _contract: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    seeManagersFor(
      _contract: string,
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "seeManagersFor(address,address)"(
      _contract: string,
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    seeManagersForIds(
      _contract: string,
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "seeManagersForIds(address,uint256[])"(
      _contract: string,
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
