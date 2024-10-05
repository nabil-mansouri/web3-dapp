//must be first (mock)
import { helper } from "./helper";
//import
import { expect } from "chai";
import "mocha";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumberish } from "@ethersproject/bignumber";
import { ethers, waffle } from "hardhat";
import { AppService } from "../src/services/appService";
import { W3Service } from "../src/services/splitService";
import { UtilService } from "../src/services/utilService";
import { Web3Service } from "../src/services/web3Service";
import { appConf as appConfLocal } from "../config/conf.local";

describe("SplitService", function () {

  let id1: number, managerId1: BigNumberish;
  let manager1Addr: string;
  let busdContract: string;
  let appService: AppService;
  let service: W3Service;
  let utilService: UtilService;
  let web3Service: Web3Service;
  let landAddress: string
  let owner: SignerWithAddress, addr1: SignerWithAddress, addr2: SignerWithAddress, addr3: SignerWithAddress;

  before(async function () {
    [owner,,,,addr1, addr2, addr3] = await helper.signerPromise;
    const splitToken = await helper.contractTokenPromise;
    const fakeLand = await helper.landPromise(owner.address);
    const tokenGenerator = await helper.tokenFactoryPromise();
    const views = await helper.viewsPromise(owner.address);
    appService = new AppService({
      fakeLand, tokenGenerator, splitToken,views
    });
    landAddress = appService.fakeLandContract.address;
    service = appService.metaService;
    utilService = appService.utilService;
    web3Service = appService.web3Service;
    appService.web3Service.forceUser(owner.address);
    appService.web3Service.forceProvider(waffle.provider);
    await (await fakeLand.connect(owner).setMinter(owner.address, true)).wait()
    const isMinter = await fakeLand.connect(owner).isMinter(owner.address);
    expect(isMinter).is.true;
    const busdContractContract = await helper.createToken("BUSD", 1000000);
    //Send 1000 busd to addr2 and addr3
    await (await busdContractContract.send(addr2.address, helper.toPrecision(1000), [])).wait();
    await (await busdContractContract.send(addr3.address, helper.toPrecision(1000), [])).wait();
    busdContract = busdContractContract.address;
  });

  it("Should mint land", async function () {
    appService.web3Service.forceUser(addr1.address);
    id1 = (await service.getFakeLandId(60, 1)).toNumber();
    const balanceBefore = await service.getFakeLandBalance(addr1.address);
    expect(balanceBefore).equal(0);
    await service.mintFakeLand(1, 60, 1);
    const balanceAfter = await service.getFakeLandBalance(addr1.address);
    expect(balanceAfter).equal(1);
    const ownerOfNft = await service.getFakeLandOwnerOf(id1);
    expect(ownerOfNft).equal(addr1.address);
  });

  it("Should partition land", async function () {
    expect(id1).not.undefined;
    const managersBefore = await service.getManagersFor(addr1.address);
    expect(managersBefore.length).eq(0);
    const supply = 1000;
    await service.partitionLand(landAddress, id1, supply);
    const managersAfter = await service.getManagersFor(addr1.address);
    expect(managersAfter.length).eq(1);
    const manager = managersAfter[0];
    expect(manager._id).eq(1);
    expect(manager._nftaddr).eq(landAddress);
    expect(manager._nftid).eq(id1);
    expect(manager._owner).eq(addr1.address);
    expect(manager._quantity).eq(1);
    expect(manager._supply).eq(supply);
    managerId1 = manager._id;
    manager1Addr = manager._address;
    const balanceToken = (await web3Service.getBalanceTokenFor(manager1Addr, addr1.address)).balance;
    expect(balanceToken).eq(helper.toPrecision(supply));
    const ownerOfNft = await service.getFakeLandOwnerOf(id1);
    expect(ownerOfNft).equal(manager1Addr);
    const managers =  await service.getManagers();
    expect(managers.length).equal(1)
    expect(managers[0]._nftaddr.length).gt(0)
    expect(managers[0]._nftid).gt(0)
    const details = await service.getManagersDetail();
    expect(details.details.length).equal(1)
    expect(details.details[0].model._id).gt(0)
    expect(details.details[0].metadata).to.be.undefined;
    await details.loadMeta();
    expect(details.details[0].metadata?.image!.length).gt(0);
  });

  it("Should create buy offer using token", async function () {
    web3Service.forceUser(addr2.address);
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const balanceBefore = await web3Service.getBalanceTokenFor(busdContract, addr2.address);
    const balanceContractBefore = await web3Service.getBalanceTokenFor(busdContract, manager1Addr);
    const buyCounterBefore = await service.getBuyCounter(manager1Addr);
    const buyOffersBefore = await service.getBuyOfferIds(manager1Addr, addr2.address);
    expect(balanceBefore.balance).equal(helper.toPrecision(1000))
    expect(balanceContractBefore.balance).equal(0)
    expect(buyCounterBefore).equal(0);
    expect(buyOffersBefore.length).equal(0);
    const amount = 10
    const cost = 10;
    await service.createBuyOfferToken({
      amount, cost, currency: busdContract, fillOrKill: true
    }, manager1Addr)
    const balanceAfter = await web3Service.getBalanceTokenFor(busdContract, addr2.address);
    const balanceContractAfter = await web3Service.getBalanceTokenFor(busdContract, manager1Addr);
    const buyCounterAfter = await service.getBuyCounter(manager1Addr);
    const buyOffersAfter = await service.getBuyOfferIds(manager1Addr, addr2.address);
    expect(balanceAfter.balance).equal(helper.toPrecision(990))
    expect(balanceContractAfter.balance).equal(helper.toPrecision(10))
    expect(buyCounterAfter).equal(1);
    expect(buyOffersAfter.length).equal(1);
  });

  it("Should create buy offer using coin", async function () {
    web3Service.forceUser(addr3.address);
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const balanceBefore = await web3Service.getBalanceCoin();
    const balanceContractBefore = await web3Service.getBalanceCoinFor(manager1Addr)
    const buyCounterBefore = await service.getBuyCounter(manager1Addr);
    const buyOffersBefore = await service.getBuyOfferIds(manager1Addr, addr3.address);
    expect(balanceContractBefore).equal(0)
    expect(buyCounterBefore).equal(1);
    expect(buyOffersBefore.length).equal(0);
    const amount = 100;
    const cost = 10;
    await service.createBuyOfferCoin({
      amount, cost, fillOrKill: true
    }, manager1Addr)
    const balanceAfter = await web3Service.getBalanceCoin();
    const balanceContractAfter = await web3Service.getBalanceCoinFor(manager1Addr)
    const buyCounterAfter = await service.getBuyCounter(manager1Addr);
    const buyOffersAfter = await service.getBuyOfferIds(manager1Addr, addr3.address);
    expect(helper.fromPrecision(balanceAfter)).approximately(helper.fromPrecision(balanceBefore) - 10, 0.1)
    expect(balanceContractAfter).equal(helper.toPrecision(10))
    expect(buyCounterAfter).equal(2);
    expect(buyOffersAfter.length).equal(1);
  });
  it("Should accept buy offer using token", async function () {
    web3Service.forceUser(addr1.address);
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const buyOffers = await service.getBuyOffers(manager1Addr);
    expect(buyOffers.length).equal(2);
    const id = buyOffers[0].id;
    const tradesBefore = await service.getTradesByAddress(manager1Addr, addr1.address);
    const balanceNFTAddr1Before = await service.getBalanceOf(manager1Addr, addr1.address);
    const balanceNFTAddr2Before = await service.getBalanceOf(manager1Addr, addr2.address);
    const balanceBUSDContractBefore = await web3Service.getBalanceTokenFor(busdContract, manager1Addr);
    const balanceBUSDAddr1Before = await web3Service.getBalanceTokenFor(busdContract, addr1.address);
    const balanceBUSDAddr2Before = await web3Service.getBalanceTokenFor(busdContract, addr2.address);
    expect(balanceBUSDAddr1Before.balance).equal(helper.toPrecision(0))
    expect(balanceBUSDAddr2Before.balance).equal(helper.toPrecision(990))
    expect(balanceBUSDContractBefore.balance).equal(helper.toPrecision(10))
    expect(balanceNFTAddr1Before).equal(helper.toPrecision(1000))
    expect(balanceNFTAddr2Before).equal(helper.toPrecision(0))
    expect(tradesBefore.length).equal(0)
    //amount=10**18 cost=10**18 amountExecuted=0 => amount=10**18
    //topay = cost * amount / amount => 1000**18 * 10**18 / 10**18 => 1000**18
    await service.acceptBuyOrder(id, manager1Addr);
    const tradesAfter = await service.getTradesByAddress(manager1Addr, addr1.address);
    const balanceNFTAddr1After = await service.getBalanceOf(manager1Addr, addr1.address);
    const balanceNFTAddr2After = await service.getBalanceOf(manager1Addr, addr2.address);
    const balanceBUSDContractAfter = await web3Service.getBalanceTokenFor(busdContract, manager1Addr);
    const balanceBUSDAddr1After = await web3Service.getBalanceTokenFor(busdContract, addr1.address);
    const balanceBUSDAddr2After = await web3Service.getBalanceTokenFor(busdContract, addr2.address);
    expect(balanceBUSDAddr1After.balance).equal(helper.toPrecision(10))
    expect(balanceBUSDAddr2After.balance).equal(helper.toPrecision(990))
    expect(balanceBUSDContractAfter.balance).equal(helper.toPrecision(0))
    expect(balanceNFTAddr1After).equal(helper.toPrecision(990))
    expect(balanceNFTAddr2After).equal(helper.toPrecision(10))
    expect(tradesAfter.length).equal(1)
  })


  it("Should accept buy offer using coin", async function () {
    web3Service.forceUser(addr1.address);
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const buyOffers = await service.getBuyOffers(manager1Addr);
    expect(buyOffers.length).equal(2);
    const id = buyOffers[1].id;
    const balanceNFTAddr1Before = await service.getBalanceOf(manager1Addr, addr1.address);
    const balanceNFTAddr3Before = await service.getBalanceOf(manager1Addr, addr3.address);
    const balanceCoinContractBefore = await web3Service.getBalanceCoinFor(manager1Addr);
    const balanceCoinAddr1Before = await web3Service.getBalanceCoinFor(addr1.address);
    const balanceCoinAddr3Before = await web3Service.getBalanceCoinFor(addr3.address);
    expect(helper.fromPrecision(balanceCoinAddr1Before)).approximately(10000, 0.1)
    expect(helper.fromPrecision(balanceCoinAddr3Before)).approximately(9990, 0.1)
    expect(balanceCoinContractBefore).equal(helper.toPrecision(10))
    expect(balanceNFTAddr1Before).equal(helper.toPrecision(990))
    expect(balanceNFTAddr3Before).equal(helper.toPrecision(0))
    //amount=100**18 cost=10**18 amountExecuted=0 => amount=10**18
    //topay = cost * amount / amount => 1000**18 * 10**18 / 100**18 => 100**18
    await service.acceptBuyOrder(id, manager1Addr);
    const balanceNFTAddr1After = await service.getBalanceOf(manager1Addr, addr1.address);
    const balanceNFTAddr3After = await service.getBalanceOf(manager1Addr, addr3.address);
    const balanceCoinContractAfter = await web3Service.getBalanceCoinFor(manager1Addr);
    const balanceCoinAddr1After = await web3Service.getBalanceCoinFor(addr1.address);
    const balanceCoinAddr3After = await web3Service.getBalanceCoinFor(addr3.address);
    expect(helper.fromPrecision(balanceCoinAddr1After)).approximately(helper.fromPrecision(balanceCoinAddr1Before) + 10, 0.1)
    expect(helper.fromPrecision(balanceCoinAddr3After)).approximately(helper.fromPrecision(balanceCoinAddr3Before), 0.1)
    expect(balanceCoinContractAfter).equal(0)
    expect(balanceNFTAddr1After).equal(helper.toPrecision(890))
    expect(balanceNFTAddr3After).equal(helper.toPrecision(100))
  })



  it("Should create sell offer using token", async function () {
    web3Service.forceUser(addr2.address);
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;

    const balanceBefore = await web3Service.getBalanceTokenFor(busdContract, addr2.address);
    const balanceContractBefore = await web3Service.getBalanceTokenFor(busdContract, manager1Addr);
    const sellCounterBefore = await service.getSellCounter(manager1Addr);
    const sellOffersBefore = await service.getSellOfferIds(manager1Addr, addr2.address);
    const balanceNFTAddr2Before = await service.getBalanceOf(manager1Addr, addr2.address);
    const balanceNFTContractBefore = await service.getBalanceOf(manager1Addr, manager1Addr);
    expect(balanceBefore.balance).equal(helper.toPrecision(990))
    expect(balanceContractBefore.balance).equal(0)
    expect(sellCounterBefore).equal(0);
    expect(sellOffersBefore.length).equal(0);
    expect(balanceNFTAddr2Before).equal(helper.toPrecision(10));
    expect(balanceNFTContractBefore).equal(0);
    //amount=10**18 paymanWish=10**18
    const cost = 10;
    const amount = 10
    await service.createSellOfferToken({
      amount, cost, fillOrKill: true, currency: busdContract
    }, manager1Addr);
    const balanceAfter = await web3Service.getBalanceTokenFor(busdContract, addr2.address);
    const balanceContractAfter = await web3Service.getBalanceTokenFor(busdContract, manager1Addr);
    const sellCounterAfter = await service.getSellCounter(manager1Addr);
    const sellOffersAfter = await service.getSellOfferIds(manager1Addr, addr2.address);
    const balanceNFTAddr2After = await service.getBalanceOf(manager1Addr, addr2.address);
    const balanceNFTContractAfter = await service.getBalanceOf(manager1Addr, manager1Addr);
    expect(balanceAfter.balance).equal(balanceBefore.balance)
    expect(balanceContractAfter.balance).equal(balanceContractBefore.balance)
    expect(sellCounterAfter).equal(1);
    expect(sellOffersAfter.length).equal(1);
    expect(balanceNFTAddr2After).equal(0);
    expect(balanceNFTContractAfter).equal(helper.toPrecision(10));
  });

  it("Should create sell offer using coin", async function () {
    web3Service.forceUser(addr3.address);
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;

    const balanceBefore = await web3Service.getBalanceCoin();
    const balanceContractBefore = await web3Service.getBalanceCoinFor(manager1Addr);
    const sellCounterBefore = await service.getSellCounter(manager1Addr);
    const sellOffersBefore = await service.getSellOfferIds(manager1Addr, addr3.address);
    const balanceNFTAddr3Before = await service.getBalanceOf(manager1Addr, addr3.address);
    const balanceNFTContractBefore = await service.getBalanceOf(manager1Addr, manager1Addr);
    expect(balanceContractBefore).equal(0)
    expect(sellCounterBefore).equal(1);
    expect(sellOffersBefore.length).equal(0);
    expect(balanceNFTAddr3Before).equal(helper.toPrecision(100));
    expect(balanceNFTContractBefore).equal(helper.toPrecision(10));
    const cost = (10);
    const amount = (100);
    await service.createSellOfferCoin({
      amount, fillOrKill: false, cost
    }, manager1Addr)
    const balanceAfter = await web3Service.getBalanceCoin();
    const balanceContractAfter = await web3Service.getBalanceCoinFor(manager1Addr);
    const sellCounterAfter = await service.getSellCounter(manager1Addr);
    const sellOffersAfter = await service.getSellOfferIds(manager1Addr, addr3.address);
    const balanceNFTAddr3After = await service.getBalanceOf(manager1Addr, addr3.address);
    const balanceNFTContractAfter = await service.getBalanceOf(manager1Addr, manager1Addr);
    expect(helper.fromPrecision(balanceAfter)).approximately(helper.fromPrecision(balanceBefore), 0.1)
    expect(balanceContractAfter).equal(balanceContractBefore)
    expect(sellCounterAfter).equal(2);
    expect(sellOffersAfter.length).equal(1);
    expect(balanceNFTAddr3After).equal(0);
    expect(balanceNFTContractAfter).equal(helper.toPrecision(110));
  });


  it("Should accept sell offer using token", async function () {
    web3Service.forceUser(addr1.address);
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const sellOffers = await service.getSellOffers(manager1Addr);
    expect(sellOffers.length).equal(2);
    const id = sellOffers[0].id;
    const balanceNFTAddr1Before = await service.getBalanceOf(manager1Addr, addr1.address);
    const balanceNFTContractBefore = await service.getBalanceOf(manager1Addr, manager1Addr);
    const balanceNFTAddr2Before = await service.getBalanceOf(manager1Addr, addr2.address);
    const balanceBUSDContractBefore = await web3Service.getBalanceTokenFor(busdContract, manager1Addr);
    const balanceBUSDAddr1Before = await web3Service.getBalanceTokenFor(busdContract, addr1.address);
    const balanceBUSDAddr2Before = await web3Service.getBalanceTokenFor(busdContract, addr2.address);
    expect(balanceBUSDAddr1Before.balance).equal(helper.toPrecision(10))
    expect(balanceBUSDAddr2Before.balance).equal(helper.toPrecision(990))
    expect(balanceBUSDContractBefore.balance).equal(helper.toPrecision(0))
    expect(balanceNFTAddr1Before).equal(helper.toPrecision(890))
    expect(balanceNFTContractBefore).equal(helper.toPrecision(110))
    expect(balanceNFTAddr2Before).equal(helper.toPrecision(0))
    //amount=10**18 paymanWish=10**18 amountExecuted=0 => amount=10**18
    //amountToGet = amount * paymentToPay / old.cost
    //amountToGet = 10**18 * 10**18 / 10**18 = 10**18
    const topay = 10;
    await service.acceptSellOrder(id, topay, manager1Addr);
    const balanceNFTAddr1After = await service.getBalanceOf(manager1Addr, addr1.address);
    const balanceNFTContractAfter = await service.getBalanceOf(manager1Addr, manager1Addr);
    const balanceNFTAddr2After = await service.getBalanceOf(manager1Addr, addr2.address);
    const balanceBUSDContractAfter = await web3Service.getBalanceTokenFor(busdContract, manager1Addr);
    const balanceBUSDAddr1After = await web3Service.getBalanceTokenFor(busdContract, addr1.address);
    const balanceBUSDAddr2After = await web3Service.getBalanceTokenFor(busdContract, addr2.address);
    expect(balanceBUSDAddr1After.balance).equal(helper.toPrecision(0))
    expect(balanceBUSDAddr2After.balance).equal(helper.toPrecision(1000))
    expect(balanceBUSDContractAfter.balance).equal(helper.toPrecision(0))
    expect(balanceNFTAddr1After).equal(helper.toPrecision(900))
    expect(balanceNFTContractAfter).equal(helper.toPrecision(100))
    expect(balanceNFTAddr2After).equal(helper.toPrecision(0))
  })


  it("Should accept sell offer using coin", async function () {
    web3Service.forceUser(addr1.address);
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const sellOffers = await service.getSellOffers(manager1Addr);
    expect(sellOffers.length).equal(2);
    const id = sellOffers[1].id;
    const balanceNFTAddr1Before = await service.getBalanceOf(manager1Addr, addr1.address);
    const balanceNFTContractBefore = await service.getBalanceOf(manager1Addr, manager1Addr);
    const balanceNFTAddr3Before = await service.getBalanceOf(manager1Addr, addr3.address);
    const balanceCoinContractBefore = await web3Service.getBalanceCoinFor(manager1Addr);
    const balanceCoinAddr1Before = await web3Service.getBalanceCoin();
    const balanceCoinAddr3Before = await web3Service.getBalanceCoinFor(addr3.address);
    expect(helper.fromPrecision(balanceCoinAddr1Before)).approximately(10010, 0.1)
    expect(helper.fromPrecision(balanceCoinAddr3Before)).approximately(9990, 0.1)
    expect(balanceCoinContractBefore).equal(helper.toPrecision(0))
    expect(balanceNFTAddr1Before).equal(helper.toPrecision(900))
    expect(balanceNFTContractBefore).equal(helper.toPrecision(100))
    expect(balanceNFTAddr3Before).equal(helper.toPrecision(0))
    //amount=100**18 paymanWish=10**18 amountExecuted=0 => amount=100**18
    //amountToGet = amount * paymentToPay / old.cost
    //amountToGet = 100 **18 * 10**18 / 10**18 = 100**18
    const topay = (10);
    await service.acceptSellOrder(id, topay, manager1Addr)
    const balanceNFTAddr1After = await service.getBalanceOf(manager1Addr, addr1.address);
    const balanceNFTContractAfter = await service.getBalanceOf(manager1Addr, manager1Addr);
    const balanceNFTAddr3After = await service.getBalanceOf(manager1Addr, addr3.address);
    const balanceCoinContractAfter = await web3Service.getBalanceCoinFor(manager1Addr);
    const balanceCoinAddr1After = await web3Service.getBalanceCoin();
    const balanceCoinAddr3After = await web3Service.getBalanceCoinFor(addr3.address);
    expect(helper.fromPrecision(balanceCoinAddr1After)).approximately(helper.fromPrecision(balanceCoinAddr1Before) - 10, 0.1)
    expect(helper.fromPrecision(balanceCoinAddr3After)).approximately(helper.fromPrecision(balanceCoinAddr3Before) + 10, 0.1)
    expect(balanceCoinContractAfter).equal(0)
    expect(balanceNFTAddr1After).equal(helper.toPrecision(1000))
    expect(balanceNFTContractAfter).equal(helper.toPrecision(0))
    expect(balanceNFTAddr3After).equal(helper.toPrecision(0))
  })



  it("Should create buy offer using token ANEW", async function () {
    web3Service.forceUser(addr2.address);
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const balanceBefore = await web3Service.getBalanceTokenFor(busdContract, addr2.address);
    const balanceContractBefore = await web3Service.getBalanceTokenFor(busdContract, manager1Addr);
    const buyCounterBefore = await service.getBuyCounter(manager1Addr);
    const buyOffersBefore = await service.getBuyOfferIds(manager1Addr, addr2.address);
    expect(balanceBefore.balance).equal(helper.toPrecision(1000))
    expect(balanceContractBefore.balance).equal(0)
    expect(buyCounterBefore).equal(2);
    expect(buyOffersBefore.length).equal(1);
    //amount=10**18 cost=1000**18
    const amount = 10
    const cost = 10;
    await service.createBuyOfferToken({
      amount, cost, currency: busdContract, fillOrKill: true
    }, manager1Addr)
    const balanceAfter = await web3Service.getBalanceTokenFor(busdContract, addr2.address);
    const balanceContractAfter = await web3Service.getBalanceTokenFor(busdContract, manager1Addr);
    const buyCounterAfter = await service.getBuyCounter(manager1Addr);
    const buyOffersAfter = await service.getBuyOfferIds(manager1Addr, addr2.address);
    expect(balanceAfter.balance).equal(helper.toPrecision(990))
    expect(balanceContractAfter.balance).equal(helper.toPrecision(10))
    expect(buyCounterAfter).equal(3);
    expect(buyOffersAfter.length).equal(2);
  });

  it("Should delete buy offer using token", async function () {
    web3Service.forceUser(addr2.address);
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const balanceBefore = await web3Service.getBalanceTokenFor(busdContract, addr2.address);
    const balanceContractBefore = await web3Service.getBalanceTokenFor(busdContract, manager1Addr);
    const buyCounterBefore = await service.getBuyCounter(manager1Addr);
    const buyOffersBefore = await service.getBuyOfferIds(manager1Addr, addr2.address);
    expect(balanceBefore.balance).equal(helper.toPrecision(990))
    expect(balanceContractBefore.balance).equal(helper.toPrecision(10))
    expect(buyCounterBefore).equal(3);
    expect(buyOffersBefore.length).equal(2);
    const id = buyOffersBefore[1]
    await service.deleteBuyOrder(id,manager1Addr);
    const balanceAfter = await web3Service.getBalanceTokenFor(busdContract, addr2.address);
    const balanceContractAfter = await web3Service.getBalanceTokenFor(busdContract, manager1Addr);
    const buyCounterAfter = await service.getBuyCounter(manager1Addr);
    const buyOffersAfter = await service.getBuyOfferIds(manager1Addr, addr2.address);
    expect(balanceAfter.balance).equal(helper.toPrecision(1000))
    expect(balanceContractAfter.balance).equal(0)
    expect(buyCounterAfter).equal(3);
    expect(buyOffersAfter.length).equal(1);
  });



  it("Should create buy offer using coin ANEW", async function () {
    web3Service.forceUser(addr3.address);
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const balanceBefore = await web3Service.getBalanceCoin();
    const balanceContractBefore = await web3Service.getBalanceCoinFor(manager1Addr);
    const buyCounterBefore = await service.getBuyCounter(manager1Addr);
    const buyOffersBefore = await service.getBuyOfferIds(manager1Addr,addr3.address);
    expect(balanceContractBefore).equal(0)
    expect(buyCounterBefore).equal(3);
    expect(buyOffersBefore.length).equal(1);
    const amount = (100);
    const cost = (10);
    await service.createBuyOfferCoin({
amount,cost,fillOrKill:false
    },manager1Addr)
    const balanceAfter = await web3Service.getBalanceCoin();
    const balanceContractAfter = await web3Service.getBalanceCoinFor(manager1Addr);
    const buyCounterAfter = await service.getBuyCounter(manager1Addr);
    const buyOffersAfter = await service.getBuyOfferIds(manager1Addr,addr3.address);
    expect(helper.fromPrecision(balanceAfter)).approximately(helper.fromPrecision(balanceBefore) - 10, 0.1)
    expect(balanceContractAfter).equal(helper.toPrecision(10))
    expect(buyCounterAfter).equal(4);
    expect(buyOffersAfter.length).equal(2);
  });


  it("Should delete buy offer using coin", async function () {
    web3Service.forceUser(addr3.address);
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const balanceBefore = await web3Service.getBalanceCoin();
    const balanceContractBefore = await web3Service.getBalanceCoinFor(manager1Addr);
    const buyCounterBefore = await service.getBuyCounter(manager1Addr);
    const buyOffersBefore = await service.getBuyOfferIds(manager1Addr,addr3.address);
    expect(balanceContractBefore).equal(helper.toPrecision(10))
    expect(buyCounterBefore).equal(4);
    expect(buyOffersBefore.length).equal(2);
    const id = buyOffersBefore[1];
    await service.deleteBuyOrder(id, manager1Addr);
    const balanceAfter = await web3Service.getBalanceCoin();
    const balanceContractAfter = await web3Service.getBalanceCoinFor(manager1Addr);
    const buyCounterAfter = await service.getBuyCounter(manager1Addr);
    const buyOffersAfter = await service.getBuyOfferIds(manager1Addr,addr3.address);
    expect(helper.fromPrecision(balanceAfter)).approximately(helper.fromPrecision(balanceBefore) + 10, 0.1)
    expect(balanceContractAfter).equal(helper.toPrecision(0))
    expect(buyCounterAfter).equal(4);
    expect(buyOffersAfter.length).equal(1);
  });


  it("Should create sell offer ANEW", async function () {
    web3Service.forceUser(addr1.address);
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const sellCounterBefore = await service.getSellCounter(manager1Addr);
    const sellOffersBefore = await service.getSellOfferIds(manager1Addr,addr1.address);
    const balanceNFTAddr1Before = await service.getBalanceOf(manager1Addr, addr1.address);
    const balanceNFTContractBefore = await service.getBalanceOf(manager1Addr, manager1Addr);
    expect(sellCounterBefore).equal(2);
    expect(sellOffersBefore.length).equal(0);
    expect(balanceNFTAddr1Before).equal(helper.toPrecision(1000));
    expect(balanceNFTContractBefore).equal(0);
    //amount=10**18 paymanWish=10**18
    const cost = (10);
    const amount = (10)
    await service.createSellOfferToken({
      amount,currency:busdContract,fillOrKill:true,cost
    }, manager1Addr)
    const sellCounterAfter = await service.getSellCounter(manager1Addr);
    const sellOffersAfter = await service.getSellOfferIds(manager1Addr,addr1.address);
    const balanceNFTAddr1After = await service.getBalanceOf(manager1Addr, addr1.address);
    const balanceNFTContractAfter = await service.getBalanceOf(manager1Addr, manager1Addr);
    expect(sellCounterAfter).equal(3);
    expect(sellOffersAfter.length).equal(1);
    expect(balanceNFTAddr1After).equal(helper.toPrecision(990));
    expect(balanceNFTContractAfter).equal(helper.toPrecision(10));
  });



  it("Should delete sell offer", async function () {
    web3Service.forceUser(addr1.address);
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const sellCounterBefore = await service.getSellCounter(manager1Addr);
    const sellOffersBefore = await service.getSellOfferIds(manager1Addr,addr1.address);
    const balanceNFTAddr1Before = await service.getBalanceOf(manager1Addr, addr1.address);
    const balanceNFTContractBefore = await service.getBalanceOf(manager1Addr, manager1Addr);
    expect(sellCounterBefore).equal(3);
    expect(sellOffersBefore.length).equal(1);
    expect(balanceNFTAddr1Before).equal(helper.toPrecision(990));
    expect(balanceNFTContractBefore).equal(helper.toPrecision(10));
    const id = sellOffersBefore[0];
    //amount=10**18 paymanWish=10**18
    await service.deleteSellOrder(id, manager1Addr);
    const sellCounterAfter = await service.getSellCounter(manager1Addr);
    const sellOffersAfter = await service.getSellOfferIds(manager1Addr,addr1.address);
    const balanceNFTAddr1After = await service.getBalanceOf(manager1Addr, addr1.address);
    const balanceNFTContractAfter = await service.getBalanceOf(manager1Addr, manager1Addr);
    expect(sellCounterAfter).equal(3);
    expect(sellOffersAfter.length).equal(0);
    expect(balanceNFTAddr1After).equal(helper.toPrecision(1000));
    expect(balanceNFTContractAfter).equal(helper.toPrecision(0));
  });

  it("Should withdraw land", async function () {
    web3Service.forceUser(addr1.address);
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managersBefore = await service.getManagersFor(addr1.address);
    const balanceToken = await service.getBalanceOf(manager1Addr,addr1.address);
    expect(balanceToken).eq(helper.toPrecision(1000));
    const ownerOfNft = await service.getFakeLandOwnerOf(id1);
    expect(ownerOfNft).equal(manager1Addr);
    //withdraw
    await service.withdrawLand(manager1Addr);
    const managersAfter = await service.getManagersFor(addr1.address);
    const ownerOfNftAfter = await service.getFakeLandOwnerOf(id1);
    expect(ownerOfNftAfter).equal(addr1.address);
    const balanceTokenAfter = await service.getBalanceOf(manager1Addr, addr1.address);
    expect(balanceTokenAfter).eq(0);
    expect(managersAfter.length).eq(managersBefore.length - 1);
  })

  it("Should mint 10 new land using proxy with real meta", async function () {
    appService.appConf.corsProxy = appConfLocal.corsProxy;
    let lastX = -1;
    for(let i = 0 ; i < 10; i++){
      const find = await service.findNewId();
      expect(find).not.undefined;
      expect(find?.exists).to.be.false;
      expect(find?.id).gt(0);
      expect(find?.meta?.image?.length).gt(0);
      if(lastX != -1){
        expect(lastX).eq(find?.lastX.toNumber())
      }
      lastX = find?.newX!;
      await service.mintFakeLand(1, find?.newX!, find?.y)
    }
  }).timeout(40000);
  
  it("Should mint 10 new land using proxy with unreal meta", async function () {
    appService.appConf.corsProxy = appConfLocal.corsProxy;
    let lastX = -1;
    for(let i = 0 ; i < 10; i++){
      const find = await service.findNewId(false);
      expect(find).not.undefined;
      expect(find?.exists).to.be.false;
      expect(find?.meta).to.be.undefined;
      if(lastX != -1){
        expect(lastX).eq(find?.lastX.toNumber())
      }
      lastX = find?.newX!;
      await service.mintFakeLand(1, find?.newX!, find?.y)
    }
  });
})