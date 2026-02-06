import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import BookCard from "../books/BookCard"
import { useFetchAllProductsQuery } from '../../redux/features/books/booksApi.js';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';

const RecommendedBooks = () => {
    // TODO: GET DATA FROM DATABASE
    const {data: books = []} = useFetchAllProductsQuery();
  return (
    <div className='py-16'>
        <h2 className='text-3xl text-[#5300E4] font-semibold mb-6'>Recommended Books</h2>
        <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
          1180:{
            slidesPerView: 2,
            spaceBetween: 50,
          }
        }}
        modules={[Navigation]}
        className="mySwiper"
      >
        {
            books.length > 0 && books.slice(8,18).map((book, idx) => (
                <SwiperSlide key={idx}>
                    <BookCard book={book}/>
                </SwiperSlide>
            ))
        }
      </Swiper>  
    </div>
  )
}

export default RecommendedBooks