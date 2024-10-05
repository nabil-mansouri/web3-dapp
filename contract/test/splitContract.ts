//must be first (mock)
import { helper } from "./helper";
//import
import { expect } from "chai";
import "mocha";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { SplitToken, Land, TokenGenerator, ERC777, Views } from "../typechain-types";
import { BigNumberish } from "@ethersproject/bignumber";
import { ethers } from "hardhat";

describe("Split", function () {
  let contract: SplitToken;
  let owner: SignerWithAddress, addr1: SignerWithAddress, addr2: SignerWithAddress, addr3: SignerWithAddress;
  before(async function () {
    [owner, addr1, addr2, addr3] = await helper.signerPromise;
    contract = await helper.contractTokenPromise;
  });

  it("Should set the right owner", async function () {
    expect(await contract.owner()).to.equal(owner.address);
  });
  //1 approve nft => ERC721(addressOfERC721Token).approve(vaultFactoryAddress, idOfTheToken)
  //2 mint a basket => VaultFactory.mint(addressOfERC721Token, idOfTheToken, amountOfTokenToMint)
  //3 get balance => ERC1155().balanceOf(owner, idOfTheToken)
  //4 get vault address (vaultId is returned from VaultFactory.mint) => VaultFactory().vaults(vaultId)
  //5 set price for my part => Vault(address).updateUserPrice(price)
  //6 make first bid => Vault(address).start() => accept only if majority has setted a price and set the minimum price having majority
  //7 make bid => Vault(address).bid() => accept only if bid is 5% greater than previous price (if less than 15 min to finish => increase end) + withdraw eth to previous bidder
  //8 end => Vault(address).end() => if auction finished => transfer the nft to the winner
  //9 redeem (should possible only if i get all token) => Vault(address).redeem() => burn my token and receive the nft
  //10 cash => Vault(address).cash() => receive my part of eth and burn token
  //11 withdrawERC721 => Vault(address).withdrawERC721 => get my erc721 token if i win
  //12 withdrawERC1155 => same as previous
  //13 => withdrawETH (get eth balance? only owner?)
  //14 withdrawERC20 => (get token balance? only owner?)
});


describe("Partition", function () {

  let contract: SplitToken;
  let landContract: Land;
  let tokenFactory: TokenGenerator;
  let viewsContract: Views;
  let owner: SignerWithAddress, addr1: SignerWithAddress, addr2: SignerWithAddress, addr3: SignerWithAddress;
  let id1:number, managerId1:BigNumberish;
  let manager1Addr:string;
  let busdContract:ERC777;
  before(async function () {
    [owner, addr1, addr2, addr3] = await helper.signerPromise;
    contract = await helper.contractTokenPromise;
    landContract  = await helper.landPromise(owner.address);
    tokenFactory = await helper.tokenFactoryPromise();
    viewsContract = await helper.viewsPromise(owner.address);
    await (await landContract.connect(owner).setMinter(owner.address, true)).wait()
    const isMinter = await  landContract.connect(owner).isMinter(owner.address);
    expect(isMinter).is.true;
    busdContract = await helper.createToken("BUSD", 1000000);
    //Send 1000 busd to addr2 and addr3
    await (await busdContract.send(addr2.address, helper.toPrecision(1000),[])).wait();
    await (await busdContract.send(addr3.address, helper.toPrecision(1000),[])).wait();
  });

  it("Should mint land", async function () {
    id1 = (await helper.landId(1,1, landContract)).toNumber();
    const balanceBefore = await landContract.connect(addr1).balanceOf(addr1.address);
    expect(balanceBefore).equal(0);
    await (await landContract.connect(owner).mintQuad(addr1.address, 1, 1, 1, [])).wait();
    const balanceAfter = await landContract.connect(addr1).balanceOf(addr1.address);
    expect(balanceAfter).equal(1);
    const ownerOfNft = await landContract.connect(addr1).ownerOf(id1);
    expect(ownerOfNft).equal(addr1.address);
  });

  it("Should partition land", async function () {
    expect(id1).not.undefined;
    const managersBefore = await viewsContract.seeManagersFor(tokenFactory.address,addr1.address);
    expect(managersBefore.length).eq(0);
    const supply = 1000;
    await (await landContract.connect(addr1).approve(tokenFactory.address, id1)).wait()
    await (await tokenFactory.connect(addr1).mint(landContract.address, id1, supply,1, true,{
      name: ethers.utils.toUtf8Bytes("NAME"),
      description: ethers.utils.toUtf8Bytes("DESCRIPTION"),
      image: ethers.utils.toUtf8Bytes("https://image.com/1"),
      json: ethers.utils.toUtf8Bytes(JSON.stringify({test:1, test2:1})),
    })).wait();
    const managersAfter = await viewsContract.seeManagersFor(tokenFactory.address,addr1.address);
    expect(managersAfter.length).eq(1);
    const manager = managersAfter[0];
    expect(manager._id).eq(1);
    expect(manager._nftaddr).eq(landContract.address);
    expect(manager._nftid).eq(id1);
    expect(manager._owner).eq(addr1.address);
    expect(manager._quantity).eq(1);
    expect(manager._supply).eq(supply);
    expect(manager._erc721).eq(true);
    expect(ethers.utils.toUtf8String(manager._meta.name)).eq("NAME");
    expect(ethers.utils.toUtf8String(manager._meta.description)).eq("DESCRIPTION");
    expect(ethers.utils.toUtf8String(manager._meta.image)).eq("https://image.com/1");
    expect(ethers.utils.toUtf8String(manager._meta.json)).eq(JSON.stringify({test:1, test2:1}));
    managerId1 = manager._id;
    manager1Addr = manager._address;
    const managerContract = helper.getManager(manager._address);
    const balanceToken = await managerContract.connect(owner).balanceOf(addr1.address);
    expect(balanceToken).eq(helper.toPrecision(supply));
    const ownerOfNft = await landContract.ownerOf(id1);
    expect(ownerOfNft).equal(managerContract.address);
  });

  it("Should create buy offer using token", async function () {
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managerContract = helper.getManager(manager1Addr);
    const precision = helper.toPrecision(10);
    const balanceBefore = await busdContract.balanceOf(addr2.address);
    const balanceContractBefore = await busdContract.balanceOf(managerContract.address);
    const buyCounterBefore = await managerContract.connect(addr2).buyCounter();
    const buyOffersBefore = await managerContract.connect(addr2).seeBuyOrderIdsFor(addr2.address);
    expect(balanceBefore).equal(helper.toPrecision(1000))
    expect(balanceContractBefore).equal(0)
    expect(buyCounterBefore).equal(0);
    expect(buyOffersBefore.length).equal(0);
    await (await busdContract.connect(addr2).approve(managerContract.address, precision)).wait()
    //amount=10**18 cost=1000**18
    const amount = helper.toPrecision(10)
    await (await managerContract.connect(addr2).makeBuyOrderToken(amount, precision,busdContract.address, true)).wait();
    const balanceAfter = await busdContract.balanceOf(addr2.address);
    const balanceContractAfter = await busdContract.balanceOf(managerContract.address);
    const buyCounterAfter = await managerContract.connect(addr2).buyCounter();
    const buyOffersAfter = await managerContract.connect(addr2).seeBuyOrderIdsFor(addr2.address);
    expect(balanceAfter).equal(helper.toPrecision(990))
    expect(balanceContractAfter).equal(helper.toPrecision(10))
    expect(buyCounterAfter).equal(1);
    expect(buyOffersAfter.length).equal(1);
  });

  it("Should create buy offer using coin", async function () {
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managerContract = helper.getManager(manager1Addr);
    const precision = helper.toPrecision(10);
    const balanceBefore = await addr3.getBalance();
    const balanceContractBefore = await ethers.provider.getBalance(managerContract.address);
    const buyCounterBefore = await managerContract.connect(addr3).buyCounter();
    const buyOffersBefore = await managerContract.connect(addr3).seeBuyOrderIdsFor(addr3.address);
    expect(balanceContractBefore).equal(0)
    expect(buyCounterBefore).equal(1);
    expect(buyOffersBefore.length).equal(0);
    await (await busdContract.connect(addr3).approve(managerContract.address, precision)).wait()
    const amount = helper.toPrecision(100);
    await (await managerContract.connect(addr3).makeBuyOrderCoin(amount, false, {value: precision})).wait();
    const balanceAfter = await addr3.getBalance();
    const balanceContractAfter = await ethers.provider.getBalance(managerContract.address);
    const buyCounterAfter = await managerContract.connect(addr3).buyCounter();
    const buyOffersAfter = await managerContract.connect(addr3).seeBuyOrderIdsFor(addr3.address);
    expect(helper.fromPrecision(balanceAfter)).approximately(helper.fromPrecision(balanceBefore)-10, 0.1)
    expect(balanceContractAfter).equal(helper.toPrecision(10))
    expect(buyCounterAfter).equal(2);
    expect(buyOffersAfter.length).equal(1);
  });
  it("Should accept buy offer using token", async function () {
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managerContract = helper.getManager(manager1Addr);
    const buyOffers = await viewsContract.connect(addr1).seeBuyOrders(managerContract.address);
    expect(buyOffers.length).equal(2);
    const id = buyOffers[0].id;
    const balanceNFTAddr1Before = await managerContract.connect(addr1).balanceOf(addr1.address);
    const balanceNFTAddr2Before = await managerContract.connect(addr2).balanceOf(addr2.address);
    const balanceBUSDContractBefore = await busdContract.connect(addr1).balanceOf(managerContract.address);
    const balanceBUSDAddr1Before = await busdContract.connect(addr1).balanceOf(addr1.address);
    const balanceBUSDAddr2Before = await busdContract.connect(addr2).balanceOf(addr2.address);
    expect(balanceBUSDAddr1Before).equal(helper.toPrecision(0))
    expect(balanceBUSDAddr2Before).equal(helper.toPrecision(990))
    expect(balanceBUSDContractBefore).equal(helper.toPrecision(10))
    expect(balanceNFTAddr1Before).equal(helper.toPrecision(1000))
    expect(balanceNFTAddr2Before).equal(helper.toPrecision(0))
    //amount=10**18 cost=10**18 amountExecuted=0 => amount=10**18
    //topay = cost * amount / amount => 1000**18 * 10**18 / 10**18 => 1000**18
    await (await managerContract.connect(addr1).acceptBuyOrder(id)).wait()
    const balanceNFTAddr1After = await managerContract.connect(addr1).balanceOf(addr1.address);
    const balanceNFTAddr2After = await managerContract.connect(addr2).balanceOf(addr2.address);
    const balanceBUSDContractAfter = await busdContract.connect(addr1).balanceOf(managerContract.address);
    const balanceBUSDAddr1After = await busdContract.connect(addr1).balanceOf(addr1.address);
    const balanceBUSDAddr2After = await busdContract.connect(addr2).balanceOf(addr2.address);
    expect(balanceBUSDAddr1After).equal(helper.toPrecision(10))
    expect(balanceBUSDAddr2After).equal(helper.toPrecision(990))
    expect(balanceBUSDContractAfter).equal(helper.toPrecision(0))
    expect(balanceNFTAddr1After).equal(helper.toPrecision(990))
    expect(balanceNFTAddr2After).equal(helper.toPrecision(10))
  })


  it("Should accept buy offer using coin", async function () {
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managerContract = helper.getManager(manager1Addr);
    const buyOffers = await viewsContract.connect(addr1).seeBuyOrders(managerContract.address);
    expect(buyOffers.length).equal(2);
    const id = buyOffers[1].id;
    const balanceNFTAddr1Before = await managerContract.connect(addr1).balanceOf(addr1.address);
    const balanceNFTAddr3Before = await managerContract.connect(addr3).balanceOf(addr3.address);
    const balanceCoinContractBefore = await ethers.provider.getBalance(managerContract.address);
    const balanceCoinAddr1Before = await addr1.getBalance();
    const balanceCoinAddr3Before = await addr3.getBalance();
    expect(helper.fromPrecision(balanceCoinAddr1Before)).approximately(10000, 0.1)
    expect(helper.fromPrecision(balanceCoinAddr3Before)).approximately(9990, 0.1)
    expect(balanceCoinContractBefore).equal(helper.toPrecision(10))
    expect(balanceNFTAddr1Before).equal(helper.toPrecision(990))
    expect(balanceNFTAddr3Before).equal(helper.toPrecision(0))
    //amount=100**18 cost=10**18 amountExecuted=0 => amount=10**18
    //topay = cost * amount / amount => 1000**18 * 10**18 / 100**18 => 100**18
    await (await managerContract.connect(addr1).acceptBuyOrder(id)).wait()
    const balanceNFTAddr1After = await managerContract.connect(addr1).balanceOf(addr1.address);
    const balanceNFTAddr3After = await managerContract.connect(addr3).balanceOf(addr3.address);
    const balanceCoinContractAfter = await ethers.provider.getBalance(managerContract.address);
    const balanceCoinAddr1After = await addr1.getBalance();
    const balanceCoinAddr3After = await addr3.getBalance();
    expect(helper.fromPrecision(balanceCoinAddr1After)).approximately(helper.fromPrecision(balanceCoinAddr1Before)+10, 0.1)
    expect(helper.fromPrecision(balanceCoinAddr3After)).approximately(helper.fromPrecision(balanceCoinAddr3Before),0.1)
    expect(balanceCoinContractAfter).equal(0)
    expect(balanceNFTAddr1After).equal(helper.toPrecision(890))
    expect(balanceNFTAddr3After).equal(helper.toPrecision(100))
  })



  it("Should create sell offer using token", async function () {
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managerContract = helper.getManager(manager1Addr);
    const balanceBefore = await busdContract.balanceOf(addr2.address);
    const balanceContractBefore = await busdContract.balanceOf(managerContract.address);
    const sellCounterBefore = await managerContract.connect(addr2).sellCounter();
    const sellOffersBefore = await managerContract.connect(addr2).seeSellOrderIdsFor(addr2.address);
    const balanceNFTAddr2Before = await managerContract.connect(addr3).balanceOf(addr2.address);
    const balanceNFTContractBefore = await managerContract.connect(addr3).balanceOf(managerContract.address);
    expect(balanceBefore).equal(helper.toPrecision(990))
    expect(balanceContractBefore).equal(0)
    expect(sellCounterBefore).equal(0);
    expect(sellOffersBefore.length).equal(0);
    expect(balanceNFTAddr2Before).equal(helper.toPrecision(10));
    expect(balanceNFTContractBefore).equal(0);
    const cost = helper.toPrecision(10);
    //amountToSell=10**18 paymanWish=10**18
    const amountToSell = helper.toPrecision(10)
    await (await managerContract.connect(addr2).makeSellOrder(amountToSell, cost,busdContract.address, true)).wait();
    const balanceAfter = await busdContract.balanceOf(addr2.address);
    const balanceContractAfter = await busdContract.balanceOf(managerContract.address);
    const sellCounterAfter = await managerContract.connect(addr2).sellCounter();
    const sellOffersAfter = await managerContract.connect(addr2).seeSellOrderIdsFor(addr2.address);
    const balanceNFTAddr2After = await managerContract.connect(addr3).balanceOf(addr2.address);
    const balanceNFTContractAfter = await managerContract.connect(addr3).balanceOf(managerContract.address);
    expect(balanceAfter).equal(balanceBefore)
    expect(balanceContractAfter).equal(balanceContractBefore)
    expect(sellCounterAfter).equal(1);
    expect(sellOffersAfter.length).equal(1);
    expect(balanceNFTAddr2After).equal(0);
    expect(balanceNFTContractAfter).equal(helper.toPrecision(10));
  });

  it("Should create sell offer using coin", async function () {
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managerContract = helper.getManager(manager1Addr);
    const balanceBefore = await addr3.getBalance();
    const balanceContractBefore = await ethers.provider.getBalance(managerContract.address);
    const sellCounterBefore = await managerContract.connect(addr3).sellCounter();
    const sellOffersBefore = await managerContract.connect(addr3).seeSellOrderIdsFor(addr3.address);
    const balanceNFTAddr3Before = await managerContract.connect(addr3).balanceOf(addr3.address);
    const balanceNFTContractBefore = await managerContract.connect(addr3).balanceOf(managerContract.address);
    expect(balanceContractBefore).equal(0)
    expect(sellCounterBefore).equal(1);
    expect(sellOffersBefore.length).equal(0);
    expect(balanceNFTAddr3Before).equal(helper.toPrecision(100));
    expect(balanceNFTContractBefore).equal(helper.toPrecision(10));
    const cost = helper.toPrecision(10);
    const amountToSell = helper.toPrecision(100);
    await (await managerContract.connect(addr3).makeSellOrder(amountToSell, cost,ethers.constants.AddressZero, false)).wait();
    const balanceAfter = await addr3.getBalance();
    const balanceContractAfter = await ethers.provider.getBalance(managerContract.address);
    const sellCounterAfter = await managerContract.connect(addr3).sellCounter();
    const sellOffersAfter = await managerContract.connect(addr3).seeSellOrderIdsFor(addr3.address);
    const balanceNFTAddr3After = await managerContract.connect(addr3).balanceOf(addr3.address);
    const balanceNFTContractAfter = await managerContract.connect(addr3).balanceOf(managerContract.address);
    expect(helper.fromPrecision(balanceAfter)).approximately(helper.fromPrecision(balanceBefore), 0.1)
    expect(balanceContractAfter).equal(balanceContractBefore)
    expect(sellCounterAfter).equal(2);
    expect(sellOffersAfter.length).equal(1);
    expect(balanceNFTAddr3After).equal(0);
    expect(balanceNFTContractAfter).equal(helper.toPrecision(110));
  });


  it("Should accept sell offer using token", async function () {
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managerContract = helper.getManager(manager1Addr);
    const sellOffers = await viewsContract.connect(addr1).seeSellOrders(managerContract.address);
    expect(sellOffers.length).equal(2);
    const id = sellOffers[0].id;
    const balanceNFTAddr1Before = await managerContract.connect(addr1).balanceOf(addr1.address);
    const balanceNFTContractBefore = await managerContract.connect(addr2).balanceOf(managerContract.address);
    const balanceNFTAddr2Before = await managerContract.connect(addr2).balanceOf(addr2.address);
    const balanceBUSDContractBefore = await busdContract.connect(addr1).balanceOf(managerContract.address);
    const balanceBUSDAddr1Before = await busdContract.connect(addr1).balanceOf(addr1.address);
    const balanceBUSDAddr2Before = await busdContract.connect(addr2).balanceOf(addr2.address);
    expect(balanceBUSDAddr1Before).equal(helper.toPrecision(10))
    expect(balanceBUSDAddr2Before).equal(helper.toPrecision(990))
    expect(balanceBUSDContractBefore).equal(helper.toPrecision(0))
    expect(balanceNFTAddr1Before).equal(helper.toPrecision(890))
    expect(balanceNFTContractBefore).equal(helper.toPrecision(110))
    expect(balanceNFTAddr2Before).equal(helper.toPrecision(0))
    //amount=10**18 paymanWish=10**18 amountExecuted=0 => amount=10**18
    //amountToGet = amountToSell * paymentToPay / old.cost
    //amountToGet = 10**18 * 10**18 / 10**18 = 10**18
    const topay = helper.toPrecision(10);
    await (await busdContract.connect(addr1).approve(managerContract.address, topay)).wait()
    await (await managerContract.connect(addr1).acceptSellOrder(id, topay)).wait()
    const balanceNFTAddr1After = await managerContract.connect(addr1).balanceOf(addr1.address);
    const balanceNFTContractAfter = await managerContract.connect(addr2).balanceOf(managerContract.address);
    const balanceNFTAddr2After = await managerContract.connect(addr2).balanceOf(addr2.address);
    const balanceBUSDContractAfter = await busdContract.connect(addr1).balanceOf(managerContract.address);
    const balanceBUSDAddr1After = await busdContract.connect(addr1).balanceOf(addr1.address);
    const balanceBUSDAddr2After = await busdContract.connect(addr2).balanceOf(addr2.address);
    expect(balanceBUSDAddr1After).equal(helper.toPrecision(0))
    expect(balanceBUSDAddr2After).equal(helper.toPrecision(1000))
    expect(balanceBUSDContractAfter).equal(helper.toPrecision(0))
    expect(balanceNFTAddr1After).equal(helper.toPrecision(900))
    expect(balanceNFTContractAfter).equal(helper.toPrecision(100))
    expect(balanceNFTAddr2After).equal(helper.toPrecision(0))
  })


  it("Should accept sell offer using coin", async function () {
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managerContract = helper.getManager(manager1Addr);
    const sellOffers = await viewsContract.connect(addr1).seeSellOrders(managerContract.address);
    expect(sellOffers.length).equal(2);
    const id = sellOffers[1].id;
    const balanceNFTAddr1Before = await managerContract.connect(addr1).balanceOf(addr1.address);
    const balanceNFTContractBefore = await managerContract.connect(addr2).balanceOf(managerContract.address);
    const balanceNFTAddr3Before = await managerContract.connect(addr3).balanceOf(addr3.address);
    const balanceCoinContractBefore = await ethers.provider.getBalance(managerContract.address);
    const balanceCoinAddr1Before = await addr1.getBalance();
    const balanceCoinAddr3Before = await addr3.getBalance();
    expect(helper.fromPrecision(balanceCoinAddr1Before)).approximately(10010, 0.1)
    expect(helper.fromPrecision(balanceCoinAddr3Before)).approximately(9990, 0.1)
    expect(balanceCoinContractBefore).equal(helper.toPrecision(0))
    expect(balanceNFTAddr1Before).equal(helper.toPrecision(900))
    expect(balanceNFTContractBefore).equal(helper.toPrecision(100))
    expect(balanceNFTAddr3Before).equal(helper.toPrecision(0))
    //amount=100**18 paymanWish=10**18 amountExecuted=0 => amount=100**18
    //amountToGet = amountToSell * paymentToPay / old.cost
    //amountToGet = 100 **18 * 10**18 / 10**18 = 100**18
    const topay = helper.toPrecision(10);
    await (await managerContract.connect(addr1).acceptSellOrder(id,topay,{value:topay})).wait()
    const balanceNFTAddr1After = await managerContract.connect(addr1).balanceOf(addr1.address);
    const balanceNFTContractAfter = await managerContract.connect(addr2).balanceOf(managerContract.address);
    const balanceNFTAddr3After = await managerContract.connect(addr3).balanceOf(addr3.address);
    const balanceCoinContractAfter = await ethers.provider.getBalance(managerContract.address);
    const balanceCoinAddr1After = await addr1.getBalance();
    const balanceCoinAddr3After = await addr3.getBalance();
    expect(helper.fromPrecision(balanceCoinAddr1After)).approximately(helper.fromPrecision(balanceCoinAddr1Before)-10, 0.1)
    expect(helper.fromPrecision(balanceCoinAddr3After)).approximately(helper.fromPrecision(balanceCoinAddr3Before)+10,0.1)
    expect(balanceCoinContractAfter).equal(0)
    expect(balanceNFTAddr1After).equal(helper.toPrecision(1000))
    expect(balanceNFTContractAfter).equal(helper.toPrecision(0))
    expect(balanceNFTAddr3After).equal(helper.toPrecision(0))
  })



  it("Should create buy offer using token ANEW", async function () {
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managerContract = helper.getManager(manager1Addr);
    const precision = helper.toPrecision(10);
    const balanceBefore = await busdContract.balanceOf(addr2.address);
    const balanceContractBefore = await busdContract.balanceOf(managerContract.address);
    const buyCounterBefore = await managerContract.connect(addr2).buyCounter();
    const buyOffersBefore = await managerContract.connect(addr2).seeBuyOrderIdsFor(addr2.address);
    expect(balanceBefore).equal(helper.toPrecision(1000))
    expect(balanceContractBefore).equal(0)
    expect(buyCounterBefore).equal(2);
    expect(buyOffersBefore.length).equal(1);
    await (await busdContract.connect(addr2).approve(managerContract.address, precision)).wait()
    //amount=10**18 cost=1000**18
    const amount = helper.toPrecision(10)
    await (await managerContract.connect(addr2).makeBuyOrderToken(amount, precision,busdContract.address, true)).wait();
    const balanceAfter = await busdContract.balanceOf(addr2.address);
    const balanceContractAfter = await busdContract.balanceOf(managerContract.address);
    const buyCounterAfter = await managerContract.connect(addr2).buyCounter();
    const buyOffersAfter = await managerContract.connect(addr2).seeBuyOrderIdsFor(addr2.address);
    expect(balanceAfter).equal(helper.toPrecision(990))
    expect(balanceContractAfter).equal(helper.toPrecision(10))
    expect(buyCounterAfter).equal(3);
    expect(buyOffersAfter.length).equal(2);
  });

  it("Should delete buy offer using token", async function () {
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managerContract = helper.getManager(manager1Addr);
    const precision = helper.toPrecision(10);
    const balanceBefore = await busdContract.balanceOf(addr2.address);
    const balanceContractBefore = await busdContract.balanceOf(managerContract.address);
    const buyCounterBefore = await managerContract.connect(addr2).buyCounter();
    const buyOffersBefore = await managerContract.connect(addr2).seeBuyOrderIdsFor(addr2.address);
    expect(balanceBefore).equal(helper.toPrecision(990))
    expect(balanceContractBefore).equal(helper.toPrecision(10))
    expect(buyCounterBefore).equal(3);
    expect(buyOffersBefore.length).equal(2);
    const id = buyOffersBefore[1]
    await (await managerContract.connect(addr2).deleteBuyOrder(id)).wait();
    const balanceAfter = await busdContract.balanceOf(addr2.address);
    const balanceContractAfter = await busdContract.balanceOf(managerContract.address);
    const buyCounterAfter = await managerContract.connect(addr2).buyCounter();
    const buyOffersAfter = await managerContract.connect(addr2).seeBuyOrderIdsFor(addr2.address);
    expect(balanceAfter).equal(helper.toPrecision(1000))
    expect(balanceContractAfter).equal(0)
    expect(buyCounterAfter).equal(3);
    expect(buyOffersAfter.length).equal(1);
  });



  it("Should create buy offer using coin ANEW", async function () {
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managerContract = helper.getManager(manager1Addr);
    const precision = helper.toPrecision(10);
    const balanceBefore = await addr3.getBalance();
    const balanceContractBefore = await ethers.provider.getBalance(managerContract.address);
    const buyCounterBefore = await managerContract.connect(addr3).buyCounter();
    const buyOffersBefore = await managerContract.connect(addr3).seeBuyOrderIdsFor(addr3.address);
    expect(balanceContractBefore).equal(0)
    expect(buyCounterBefore).equal(3);
    expect(buyOffersBefore.length).equal(1);
    const amount = helper.toPrecision(100);
    await (await managerContract.connect(addr3).makeBuyOrderCoin(amount, false, {value: precision})).wait();
    const balanceAfter = await addr3.getBalance();
    const balanceContractAfter = await ethers.provider.getBalance(managerContract.address);
    const buyCounterAfter = await managerContract.connect(addr3).buyCounter();
    const buyOffersAfter = await managerContract.connect(addr3).seeBuyOrderIdsFor(addr3.address);
    expect(helper.fromPrecision(balanceAfter)).approximately(helper.fromPrecision(balanceBefore)-10, 0.1)
    expect(balanceContractAfter).equal(helper.toPrecision(10))
    expect(buyCounterAfter).equal(4);
    expect(buyOffersAfter.length).equal(2);
  });


  it("Should delete buy offer using coin", async function () {
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managerContract = helper.getManager(manager1Addr);
    const balanceBefore = await addr3.getBalance();
    const balanceContractBefore = await ethers.provider.getBalance(managerContract.address);
    const buyCounterBefore = await managerContract.connect(addr3).buyCounter();
    const buyOffersBefore = await managerContract.connect(addr3).seeBuyOrderIdsFor(addr3.address);
    expect(balanceContractBefore).equal(helper.toPrecision(10))
    expect(buyCounterBefore).equal(4);
    expect(buyOffersBefore.length).equal(2);
    const id = buyOffersBefore[1];
    await (await managerContract.connect(addr3).deleteBuyOrder(id)).wait();
    const balanceAfter = await addr3.getBalance();
    const balanceContractAfter = await ethers.provider.getBalance(managerContract.address);
    const buyCounterAfter = await managerContract.connect(addr3).buyCounter();
    const buyOffersAfter = await managerContract.connect(addr3).seeBuyOrderIdsFor(addr3.address);
    expect(helper.fromPrecision(balanceAfter)).approximately(helper.fromPrecision(balanceBefore)+10, 0.1)
    expect(balanceContractAfter).equal(helper.toPrecision(0))
    expect(buyCounterAfter).equal(4);
    expect(buyOffersAfter.length).equal(1);
  });


  it("Should create sell offer ANEW", async function () {
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managerContract = helper.getManager(manager1Addr);
    const sellCounterBefore = await managerContract.connect(addr1).sellCounter();
    const sellOffersBefore = await managerContract.connect(addr1).seeSellOrderIdsFor(addr1.address);
    const balanceNFTAddr1Before = await managerContract.connect(addr3).balanceOf(addr1.address);
    const balanceNFTContractBefore = await managerContract.connect(addr3).balanceOf(managerContract.address);
    expect(sellCounterBefore).equal(2);
    expect(sellOffersBefore.length).equal(0);
    expect(balanceNFTAddr1Before).equal(helper.toPrecision(1000));
    expect(balanceNFTContractBefore).equal(0);
    const cost = helper.toPrecision(10);
    //amountToSell=10**18 paymanWish=10**18
    const amountToSell = helper.toPrecision(10)
    await (await managerContract.connect(addr1).makeSellOrder(amountToSell, cost,busdContract.address, true)).wait();
    const sellCounterAfter = await managerContract.connect(addr1).sellCounter();
    const sellOffersAfter = await managerContract.connect(addr1).seeSellOrderIdsFor(addr1.address);
    const balanceNFTAddr1After = await managerContract.connect(addr3).balanceOf(addr1.address);
    const balanceNFTContractAfter = await managerContract.connect(addr3).balanceOf(managerContract.address);
    expect(sellCounterAfter).equal(3);
    expect(sellOffersAfter.length).equal(1);
    expect(balanceNFTAddr1After).equal(helper.toPrecision(990));
    expect(balanceNFTContractAfter).equal(helper.toPrecision(10));
  });



  it("Should delete sell offer", async function () {
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managerContract = helper.getManager(manager1Addr);
    const sellCounterBefore = await managerContract.connect(addr1).sellCounter();
    const sellOffersBefore = await managerContract.connect(addr1).seeSellOrderIdsFor(addr1.address);
    const balanceNFTAddr1Before = await managerContract.connect(addr3).balanceOf(addr1.address);
    const balanceNFTContractBefore = await managerContract.connect(addr3).balanceOf(managerContract.address);
    expect(sellCounterBefore).equal(3);
    expect(sellOffersBefore.length).equal(1);
    expect(balanceNFTAddr1Before).equal(helper.toPrecision(990));
    expect(balanceNFTContractBefore).equal(helper.toPrecision(10));
    const id = sellOffersBefore[0];
    //amountToSell=10**18 paymanWish=10**18
    await (await managerContract.connect(addr1).deleteSellOrder(id)).wait();
    const sellCounterAfter = await managerContract.connect(addr1).sellCounter();
    const sellOffersAfter = await managerContract.connect(addr1).seeSellOrderIdsFor(addr1.address);
    const balanceNFTAddr1After = await managerContract.connect(addr3).balanceOf(addr1.address);
    const balanceNFTContractAfter = await managerContract.connect(addr3).balanceOf(managerContract.address);
    expect(sellCounterAfter).equal(3);
    expect(sellOffersAfter.length).equal(0);
    expect(balanceNFTAddr1After).equal(helper.toPrecision(1000));
    expect(balanceNFTContractAfter).equal(helper.toPrecision(0));
  });

  it("Should withdraw land", async function () {
    expect(id1).not.undefined;
    expect(managerId1).not.undefined;
    expect(manager1Addr).not.undefined;
    const managerContract = helper.getManager(manager1Addr);
    const balanceToken = await managerContract.connect(owner).balanceOf(addr1.address);
    expect(balanceToken).eq(helper.toPrecision(1000));
    const ownerOfNft = await landContract.ownerOf(id1);
    expect(ownerOfNft).equal(managerContract.address);
    //withdraw
    await (await managerContract.connect(addr1).withdraw()).wait();
    const ownerOfNftAfter = await landContract.ownerOf(id1);
    expect(ownerOfNftAfter).equal(addr1.address);
    const balanceTokenAfter = await managerContract.connect(addr1).balanceOf(addr1.address);
    expect(balanceTokenAfter).eq(0);
  })
})