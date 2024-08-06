import { ethers, hardhatArguments } from 'hardhat';
import * as Config from './config';

async function main() {
   await Config.initConfig();
   const network = hardhatArguments.network ?? 'dev';
   const [deployer] = await ethers.getSigners();
   console.log('deploy from address: ', deployer.address);

   const LckToken = await ethers.getContractFactory("LuckToken");
   const lckToken = await LckToken.deploy();
   console.log("AgriToken address: ", lckToken.address);
   Config.setConfig(network + '.LckToken', lckToken.address);

   // const Product = await ethers.getContractFactory("Products");
   // const product = await Product.deploy('0xcCBF9BcaAbeaE9d0F382695d6fFe31c39E533F17', '0xdB868486B732DEc5c42Dd3E1CCB77355465DC0Ac');
   // console.log("Product address: ", product.address);
   // Config.setConfig(network + '.Product', product.address);

   await Config.updateConfig();
}

main()
   .then(() => process.exit(0))
   .catch(error => {
      console.log(error);
      process.exit(1)
   })