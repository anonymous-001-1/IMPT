const { ethers } = require("hardhat");
const params=require("../constructor_aurguments")
const fs = require("fs");
const {ERC20_name,ERC20_symbol,owner_address,recipients_address_array,recipients_amounts}=params;

async function main() {
    const {owner}=await ethers.getSigners();
    const IMPT_Contract=await ethers.getContractFactory("IMPT",owner);
    const impt_contract=await IMPT_Contract.deploy(ERC20_name,ERC20_symbol,owner_address,recipients_address_array,recipients_amounts);

    await impt_contract.deployed();

    console.log("IMPT contract deployed successfully at :",impt_contract.address);

    const collection_data = {
        address: impt_contract.address,
        abi: JSON.parse(impt_contract.interface.format('json'))
      }
      fs.writeFileSync('./src/IMPT.json', JSON.stringify(collection_data))
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });