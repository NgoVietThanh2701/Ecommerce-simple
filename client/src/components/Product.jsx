import React, { useState } from 'react';
import { FaStar } from "react-icons/fa";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { Link, useOutletContext } from 'react-router-dom';
import ProductContract from '../contract/Product.contract.ts';
import LCKContract from '../contract/LCK.contract.ts';
import { getAbiProduct, PRODUCT_ADDRESS } from '../contract/config.ts';
import { ethers } from 'ethers';
import Loading from './Loading.jsx';

const ProductCard = ({ product, getProducts }) => {

   const { web3Provider } = useOutletContext();
   const [isLoading, setIsLoading] = useState(false);

   const buyProduct = async () => {
      if (web3Provider && product) {
         try {
            setIsLoading(true);
            const productContract = new ProductContract(web3Provider);
            const lckContract = new LCKContract(web3Provider);
            await lckContract.approve(productContract._contractAddress, product.productDetails.price);
            await productContract.buyProduct(product.uid);
            listenEvent();
         } catch (error) {
            console.log(error);
            setIsLoading(false);
         }
      }
   }

   const listenEvent = () => {
      let contract = new ethers.Contract(PRODUCT_ADDRESS, getAbiProduct(), web3Provider);
      contract.once("BuyProduct", (uid) => {
         setIsLoading(false);
         getProducts();
      })
   }

   return (
      <div className='border border-gray-200 pb-3 pt-1 flex flex-col items-center gap-1 group relative'>
         {isLoading && <Loading />}
         <Link to={``} className='p-[10px] rounded-full bg-[#49A760] absolute z-10 top-4 right-0 opacity-0 group-hover:opacity-100 transition-all group-hover:transform group-hover:translate-x-[-30%] duration-300'>
            <HiOutlineViewfinderCircle size={20} color='white' />
         </Link>
         <div className='w-56 h-44'>
            <img src={product.productDetails.image} className='w-full h-full object-cover' />
         </div>
         <div className='relative flex justify-center border-t-1 border-color mt-2'>
            <div className='bg-white px-4 flex absolute top-[-10px]'>
               {Array.from({ length: 5 }, (value, index) => (
                  <FaStar key={index} size={16} color='#f4a708' />
               ))}
            </div>
         </div>
         <h3 className='text-lg text-[#616161] px-4 font-bold line-clamp-1 mt-2'>{product.productDetails.description}</h3>
         <span className='text-green font-bold '>$ {product.productDetails.price} AGT</span>
         <div className='text-gray-500 flex gap-3 text-sm justify-end items-center w-full px-5 mt-2'>
            <span>Hội An</span>
         </div>
         <button onClick={buyProduct} className='text-white bg-green-500 w-24 py-1.5 px-3 rounded-md'>Mua</button>
      </div>
   )
}

const Product = ({ dataProduct, getProducts }) => {

   return (
      <div className='w-5/6 flex flex-col items-center gap-4 mt-10 py-7'>
         <p className='text-green'>GHÉ TẠI ĐÂY</p>
         <h3 className='text-4xl text-333 font-bold'>Mua sản phẩm của chúng tôi</h3>
         <p className='text-666 text-center px-72 leading-7 mb-3'>Sản phẩm chất lượng cao, nguồn gốc rõ ràng, giá thành rẻ, đảm bảo tiêu chuẩn tiêu chí quyền lợi cho người tiêu dùng.</p>
         <div className='w-full flex flex-wrap -m-2'>
            {dataProduct?.map((product) => (
               <div key={product.uid} className='w-1/5 p-2'>
                  <ProductCard product={product} getProducts={getProducts} />
               </div>
            ))}
         </div>
      </div>
   )
}

export default Product