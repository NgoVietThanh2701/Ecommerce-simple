import React, { useState, useEffect } from 'react'
import InputForm from '../components/InputForm';
import Loading from '../components/Loading';
import { IoCloseCircleOutline } from 'react-icons/io5';
import axios from 'axios';
import ProductContract from '../contract/Product.contract.ts';
import toast, { Toaster } from 'react-hot-toast';
import { ethers } from 'ethers';
import { getAbiProduct, PRODUCT_ADDRESS } from '../contract/config.ts';

const noImg = require('../utils/images/no-data.jpg');

const pinataConfig = {
   root: 'https://api.pinata.cloud',
   headers: {
      'pinata_api_key': process.env.REACT_APP_PINATA_APIKEY,
      'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRETKEY
   }
};

const AddProduct = ({ setIsShowModal, web3Provider }) => {

   const [preview, setPreview] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [payload, setPayload] = useState({
      name: '',
      price: '',
      image: null,
      description: '',
   });

   const loadImage = (e) => {
      const image = e.target.files[0];
      setPayload((prev) => ({ ...prev, image: image }));
      setPreview(URL.createObjectURL(image));
   }

   const handleBuyProduct = async () => {
      if (payload.image && web3Provider) {
         try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('file', payload.image);
            formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
            formData.append('pinataMetadata', JSON.stringify({ name: payload.image['name'] }));
            const url = `${pinataConfig.root}/pinning/pinFileToIPFS`;
            const response = await axios({
               method: 'post',
               url: url,
               data: formData,
               headers: pinataConfig.headers
            });
            const urlImage = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
            const productContract = new ProductContract(web3Provider);
            listenEvent();
            await productContract.madeProduct(payload.name, Number.parseFloat(payload.price), urlImage, payload.description);
            setPayload({ name: '', price: '', image: null, description: '' });
            setPreview("")
         } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra", { position: "top-center" });
            setIsLoading(false);
         }
      } else {
         console.log('ereror')
      }
   }

   const listenEvent = () => {
      let contract = new ethers.Contract(PRODUCT_ADDRESS, getAbiProduct(), web3Provider);
      contract.once("MadeProduct", (uid) => {
         setIsLoading(false);
         setIsShowModal(false);
         toast.success("Success", { position: "top-center" });
      })
   }

   return (
      <div className='bg-half-transparent z-10 w-screen fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
         {isLoading && <Loading />}
         <div className='bg-white w-[720px] relative group rounded-md py-3 px-5 flex flex-col gap-3'>
            <button className='absolute top-2 right-2 text-444' onClick={() => setIsShowModal(false)}>
               <IoCloseCircleOutline size={24} />
            </button>
            <h3 className='text-333 font-medium text-xl'>Thêm sản phẩm</h3>
            <div className='flex gap-3'>
               <InputForm
                  label='Nhập tên sản phẩm'
                  value={payload.name}
                  setValue={setPayload}
                  keyPayload='name'
               />
            </div>
            <InputForm
               label='Nhập giá sản phẩm (AGT token)'
               value={payload.price}
               setValue={setPayload}
               keyPayload='price'
               type='number'
            />
            <div>
               <label htmlFor="description" className="block mb-2 pl-1 text-sm font-medium text-666">Nhập mô tả</label>
               <textarea id="description" rows={2} onChange={(e) => setPayload((prev) => ({ ...prev, description: e.target.value }))}
                  className="block p-2.5 w-full text-sm text-333 bg-gray-50 rounded-lg outline-none border-color focus:border-[#3B71CA] border-1" placeholder="Nhập thông tin mô tả sản phẩm tại đây..."></textarea>
            </div>
            <div className='flex justify-center gap-1'>
               <div className='w-2/5 flex flex-col items-center'>
                  <div className='w-full h-[220px] p-2'><img src={payload.image ? preview : noImg} alt="" className='w-full h-full object-cover' /></div>
                  <input type="file" id='img' onChange={loadImage} style={{ display: "none" }} />
                  <label className='text-333 mt-1 inline-flex items-center gap-2' htmlFor="img">Chọn file <IoCloseCircleOutline size={20} /></label>
               </div>
            </div>
            <button onClick={handleBuyProduct}
               className='text-white mx-auto px-4 py-2 mt-1 rounded-md bg-green-500'>
               Thêm sản phẩm
            </button>
         </div>
         <Toaster />
      </div>
   )
}

export default AddProduct