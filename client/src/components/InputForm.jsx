import React, { ReactNode, useState } from 'react'

const InputForm = ({ label, value, setValue, keyPayload, type }) => {

   const [isFocused, setIsFocused] = useState(false);
   const [inputValue, setInputValue] = useState('');

   const handleFocus = () => {
      setIsFocused(true);
   };

   const handleBlur = () => {
      if (inputValue === '') {
         setIsFocused(false);
      }
   };

   const handleChange = (e) => {
      setValue((prev) => ({ ...prev, [keyPayload]: e.target.value }))
   }

   return (
      <div className="relative w-full">
         <label className={`absolute ${isFocused || inputValue !== '' ? 'text-xs text-666 left-1 top-[-6px]' : 'hidden'} bg-white  text-center px-2 transition-all duration-300`}
            htmlFor={keyPayload}>
            {label}
         </label>
         <input id={keyPayload}
            type={type || 'text'}
            className='outline-none border-color focus:border-[#3B71CA] border-1 text-sm text-primary py-[10px] px-2 rounded-[4px] w-full'
            placeholder={isFocused ? '' : label}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
         />
      </div>
   )
}

export default InputForm