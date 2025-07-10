import React from 'react';
import { assets, testimonialsData } from '../assets/assets';
import {motion} from 'framer-motion'

const Testimonials = () => {
  return (
    <motion.div 
     initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    
    className='flex flex-col justify-center items-center my-20 py-12 p-6'>
      <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>Customer testimonials</h1>
      <p className='text-gray-500 mb-12'>What Our Users Are Saying</p>

      <div className='flex flex-wrap gap-6 justify-center'>
        {
          testimonialsData.map((testimonial, index) => (
            <div
              key={index}
              className='bg-white p-6 rounded-lg shadow-md max-w-xs text-center'
            >
              <img
                src={testimonial.image}
                className='rounded-full w-14 h-14 mx-auto mb-4'
                alt={`${testimonial.name}'s profile`}
              />
              <h2 className='text-lg font-medium'>{testimonial.name}</h2>
              <p className='text-sm text-gray-500 mb-2'>{testimonial.role}</p>
              <div className='flex justify-center mb-2'>
                {
                  Array(testimonial.stars).fill().map((_, i) => (
                    <img
                      src={assets.rating_star}
                      key={i}
                      alt="star"
                      className='w-4 h-4'
                    />
                  ))
                }
              </div>
              <p className='text-sm text-gray-700'>{testimonial.text}</p>
            </div>
          ))
        }
      </div>
    </motion.div>
  );
};

export default Testimonials;
