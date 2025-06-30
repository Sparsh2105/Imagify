import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Result = () => {

  const [image, setImage] = useState(assets.sample_img_1)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input,setInput]=useState("")

  const onSubmitHandler=async (e)=>{
    // todo

  }
  return (
    <form  onSubmit={onSubmitHandler} className='p-4 flex flex-col items-center justify-center min-h-screen'>

      {/* Image */}
      <div className='w-full max-w-md mb-0'>
        <img
          className='rounded-xl w-full object-cover shadow-md'
          src={image}
          alt="Sample"
        />
      </div>

      {/* Blue line just stuck under image */}
      <div className={`${loading? 'w-full transition-all duration-[10s] ': 'w-0'} max-w-md h-1 bg-blue-500 `} />

      {/* Loading text below line */}
      {loading ? (
        <p className='text-sm mt-2 text-gray-600 text-center mb-6'>Loading.....</p>
      ) : null}

      {!isImageLoaded &&

        <div className='flex w-full max-w-xl bg-gray-200 text-sm p-1 mt-4 rounded-full items-center'>
          <input onChange={(e)=>setInput(e.target.value)} 
          value={input}
            type="text"
            placeholder="Describe what you want to generate"
            className="flex-1 bg-transparent outline-none px-4 py-2 placeholder:text-gray-500 text-gray-800"
          />
          <button
            type='submit'
            className='bg-zinc-900 text-white px-10 sm:px-16 py-2 rounded-full hover:bg-zinc-800 transition'
          >
            Generate
          </button>
        </div>

      }
      {isImageLoaded &&
        <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
          <p onClick={()=>{
            setIsImageLoaded(false)
          }} className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'>Generate Another</p>
          <a href={image} download className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer">Download</a>
        </div>
      }

    </form>
  )
}

export default Result 