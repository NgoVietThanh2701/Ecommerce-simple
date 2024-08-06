import React, { useEffect, useState } from 'react'
import BackgroundShop from '../components/BackgroundShop.jsx'
import Footer from '../components/Footer.jsx'
import Pagination from '../components/Pagination'
import Product from '../components/Product'
import { ethers } from 'ethers'
import ProductContract from '../contract/Product.contract.ts'

const Shop = () => {

   const [products, setProducts] = useState([]);

   const getProducts = async () => {
      try {
         const productContract = new ProductContract();
         const response = await productContract.getProducts();
         console.log(response)
         const productFilted = response.filter((data) => data.productState === 1);
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProducts(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   useEffect(() => {
      getProducts();
   }, [])

   const convertObjectProduct = (data) => {
      return {
         uid: data.uid.toNumber(),
         consumer: data.consumer,
         productState: data.productState,
         productDetails: {
            name: data.productDetails.name,
            price: data.productDetails.price.toNumber(),
            image: data.productDetails.image,
            description: data.productDetails.description,
         }
      }
   }

   return (
      <Pagination itemsPerPage={8} data={products} Component={Product} getProducts={getProducts} />
   )
}

export default Shop