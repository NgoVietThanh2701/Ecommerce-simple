import { ethers } from "ethers";
import { PRODUCT_ADDRESS, getAbiProduct, rpcProvider } from "./config.ts";
import BaseInterface from "./interfaces/BaseInterface.ts";

export default class ProductContract extends BaseInterface {
   constructor(provider?: ethers.providers.Web3Provider) {
      super(provider || rpcProvider, PRODUCT_ADDRESS, getAbiProduct());
      if (!provider) {
         this._contract = new ethers.Contract(this._contractAddress, this._abi, rpcProvider);
      }
   }

   // step 1
   async madeProduct(name: string, price: number, image: string, description: string) {
      await this._contract.madeProduct(name, price, image, description, this._option);
   }

   // step 2
   async buyProduct(uid: number) {
      await this._contract.buyProduct(uid, this._option);
   }

   async comfirm(uid: number) {
      await this._contract.comfirm(uid, this._option);
   }

   async getProducts() {
      const products = await this._contract.getProducts();
      return products;
   }
}