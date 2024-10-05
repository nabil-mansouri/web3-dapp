// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { BigNumber } from "@ethersproject/bignumber";
import { network, ethers } from "hardhat";
import {appConf as confLocal} from "../config/conf.local";
import {appConf as confTestnet} from "../config/conf.testnet";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
    const Views = await ethers.getContractFactory("Views");
    const Token = await ethers.getContractFactory("SplitToken");
    const TokenGenerator = await ethers.getContractFactory("TokenGenerator");
    const Land = await ethers.getContractFactory("Land");
    const TokenManagerImpl= await ethers.getContractFactory("TokenManagerImpl");
    /*
    if (network.name == "localhost" || network.name == "testnet" || network.name == "ropsten") {
      const [deployer] = await ethers.getSigners();
      console.log("Deploying contracts with the account:", deployer.address);
      console.log("Account balance:", (await deployer.getBalance()).toString());
      //deploy token
      const supply = 20 * 10**6;
      const token = await Token.deploy("TOK", "TOK", supply);
      await token.deployed();
      console.log("Token deployed to:", token.address);
      //deploy generator
      const views = await Views.deploy();
      await views.deployed();
      console.log("Views deployed to:", views.address);
      //deploy land
      const metaTransactionContract = ethers.constants.AddressZero;
      const admin= ethers.constants.AddressZero;
      const land = await Land.deploy(metaTransactionContract, admin);
      await land.deployed();
      console.log("Land deployed to:", land.address);
      //deploy lib
      const lib = await TokenManagerImpl.deploy();
      await lib.deployed();
      console.log("Library deployed to:", lib.address);
      //deploy generator
      const generator = await TokenGenerator.deploy(lib.address);
      await generator.deployed();
      console.log("TokenGenerator deployed to:", generator.address);
      const conf = network.name == "testnet" || network.name == "ropsten"?confTestnet:confLocal
      conf.contracts.splitToken = token.address;
      conf.contracts.fakeLand = land.address;
      conf.contracts.views = views.address;
      conf.contracts.tokenGenerator = generator.address;
      conf.landContracts.forEach(e=>{
        if(e.name=="Test"){
          e.address = land.address;
        }
      })
      console.log(JSON.stringify(conf, null, 2))
    }
    */
    const supply = 20 * 10**6;
    const token = await Token.deploy("W3", "TOK", supply);
    await token.deployed();
    console.log("Token deployed to:", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
