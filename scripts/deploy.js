// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NFTMarketPlace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketPlace = await NFTMarketPlace.deploy();

  await nftMarketPlace.deployed();

  console.log("NFTMarketplace deployed to:", nftMarketPlace.address);

  saveFrontendFiles(nftMarketPlace);
}

function saveFrontendFiles(nftMarketPlace) {
  const fs = require("fs");
  const configDir = __dirname + "/../config";

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
  }

  fs.writeFileSync(
    configDir + "/config.js",
    `
    export const marketplaceAddress = "${nftMarketPlace.address}"
    export const ownerAddress = "${nftMarketPlace.signer.address}"
  `
  );

  const NFTMarketPlaceArtifact = artifacts.readArtifactSync("NFTMarketplace");

  fs.writeFileSync(
    configDir + "/NFTMarketplace.json",
    JSON.stringify(NFTMarketPlaceArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
