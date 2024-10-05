import * as dotenv from "dotenv";
import { TASK_NODE_GET_PROVIDER, TASK_TEST_SETUP_TEST_ENVIRONMENT } from 'hardhat/builtin-tasks/task-names';
import { HardhatUserConfig, subtask, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-erc1820";
import {privateKey, ropstenUrl, kovanUrl} from "./secret.testnet.json";
import {mainnetUrl, mainnetPk} from "./secret.mainnet.json";
import { EthereumProvider } from "hardhat/types";
dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  networks: {
    ropsten: {
      url: ropstenUrl,
      accounts: [privateKey],
    },
    kovan: {
      url: kovanUrl,
      accounts: [privateKey]
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      gas: 212000000
    },
    hardhat: {
    },
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [privateKey]
      //accounts: {mnemonic: mnemonic}
    },
    mainnet: {
      url: mainnetUrl,
      chainId: 1,
      accounts: [mainnetPk]
      //accounts: {mnemonic: mnemonic}
    }

  },
  gasReporter:{
    currency: 'USD',
    enabled: true,
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
     }
    },
    paths: {
      sources: "./contracts",
      tests: "./test",
      cache: "./cache",
      artifacts: "./artifacts"
    },
    mocha: {
      timeout: 20000
    }
  /*gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },*/
};

export default config;