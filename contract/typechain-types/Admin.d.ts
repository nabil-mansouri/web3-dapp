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

interface AdminInterface extends ethers.utils.Interface {
  functions: {
    "changeAdmin(address)": FunctionFragment;
    "getAdmin()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "changeAdmin", values: [string]): string;
  encodeFunctionData(functionFragment: "getAdmin", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "changeAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getAdmin", data: BytesLike): Result;

  events: {
    "AdminChanged(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
}

export class Admin extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: AdminInterface;

  functions: {
    changeAdmin(
      newAdmin: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "changeAdmin(address)"(
      newAdmin: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    getAdmin(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    "getAdmin()"(overrides?: CallOverrides): Promise<{
      0: string;
    }>;
  };

  changeAdmin(
    newAdmin: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "changeAdmin(address)"(
    newAdmin: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  getAdmin(overrides?: CallOverrides): Promise<string>;

  "getAdmin()"(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    changeAdmin(newAdmin: string, overrides?: CallOverrides): Promise<void>;

    "changeAdmin(address)"(
      newAdmin: string,
      overrides?: CallOverrides
    ): Promise<void>;

    getAdmin(overrides?: CallOverrides): Promise<string>;

    "getAdmin()"(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    AdminChanged(oldAdmin: null, newAdmin: null): EventFilter;
  };

  estimateGas: {
    changeAdmin(newAdmin: string, overrides?: Overrides): Promise<BigNumber>;

    "changeAdmin(address)"(
      newAdmin: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    getAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    "getAdmin()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    changeAdmin(
      newAdmin: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "changeAdmin(address)"(
      newAdmin: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    getAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "getAdmin()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
