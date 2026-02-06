import React, { useState } from 'react'
import BookCard from "../books/BookCard"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';
import { useFetchAllProductsQuery } from '../../redux/features/books/booksApi.js';
import { useFetchAllProductCategoriesQuery } from '../../redux/features/books/bookCategoriesApi.js';

const TopSellers = () => {
    const { data: books = [] } = useFetchAllProductsQuery();
    const { data: categories = [] } = useFetchAllProductCategoriesQuery();
    const [selectedCategory, setSelectedCategory] = useState("Choose a genre");

    const filteredBooks = selectedCategory === "Choose a genre"
      ? books
      : books.filter(book => book.category._id === selectedCategory);

return (
  <div className='py-10'>
    <h2 className='text-3xl text-[#5300E4] font-semibold mb-6'>Top Sellers</h2>

    <div className='mb-8 flex items-center'>
      <select
        onChange={(e) => setSelectedCategory(e.target.value)}
        value={selectedCategory}
        className='border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none'
      >
        <option value="Choose a genre">Choose a genre</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>

    <Swiper
      slidesPerView={1}
      spaceBetween={30}
      navigation={true}
      breakpoints={{
        640: { slidesPerView: 1, spaceBetween: 20 },
        768: { slidesPerView: 1, spaceBetween: 40 },
        1024: { slidesPerView: 2, spaceBetween: 50 },
        1180: { slidesPerView: 2, spaceBetween: 50 },
      }}
      modules={[Navigation]}
      className="mySwiper"
    >
      {filteredBooks.length > 0 &&
        filteredBooks.map((book, idx) => (
          <SwiperSlide key={idx}>
            <BookCard book={book} />
          </SwiperSlide>
        ))}
    </Swiper>
  </div>
);
}

export default TopSellers