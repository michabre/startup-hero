const path = require("path");
require("dotenv").config({ path: "./.env" });
const HDWalletProvider = require("@truffle/hdwallet-provider");
const AccountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545,
    },
    ganache: {
      port: 7545,
      network_id: 5777,
      host: "127.0.0.1",
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0",
    },
  },
};
