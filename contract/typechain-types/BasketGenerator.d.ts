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

interface BasketGeneratorInterface extends ethers.utils.Interface {
  functions: {
    "baskets(uint256)": FunctionFragment;
    "createBasket()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "baskets",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createBasket",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "baskets", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createBasket",
    data: BytesLike
  ): Result;

  events: {
    "NewBasket(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "NewBasket"): EventFragment;
}

export class BasketGenerator extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: BasketGeneratorInterface;

  functions: {
    baskets(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    "baskets(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    createBasket(overrides?: Overrides): Promise<ContractTransaction>;

    "createBasket()"(overrides?: Overrides): Promise<ContractTransaction>;
  };

  baskets(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  "baskets(uint256)"(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  createBasket(overrides?: Overrides): Promise<ContractTransaction>;

  "createBasket()"(overrides?: Overrides): Promise<ContractTransaction>;

  callStatic: {
    baskets(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    "baskets(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    createBasket(overrides?: CallOverrides): Promise<void>;

    "createBasket()"(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    NewBasket(_address: string | null, _creator: string | null): EventFilter;
  };

  estimateGas: {
    baskets(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "baskets(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createBasket(overrides?: Overrides): Promise<BigNumber>;

    "createBasket()"(overrides?: Overrides): Promise<BigNumber>;
  };

  populateTransaction: {
    baskets(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "baskets(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createBasket(overrides?: Overrides): Promise<PopulatedTransaction>;

    "createBasket()"(overrides?: Overrides): Promise<PopulatedTransaction>;
  };
}
