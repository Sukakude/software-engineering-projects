import React from 'react'
import {FiShoppingCart} from 'react-icons/fi'
import {getImgUrl} from '../../utils/getImgUrl.js'
import {Link} from 'react-router'
import {useDispatch} from 'react-redux'
import {addToCart} from '../../redux/features/cart/cartSlice.js'

const BookCard = ({book}) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  }

  return (
    <div className="rounded-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:h-72  sm:justify-center gap-4">
        {/* CARD IMAGE */}
        <div className="sm:h-72 sm:shrink-0 border rounded-md">
          <Link to={`/books/${book._id}`}>
            <img
              src={`${getImgUrl(book.coverImage)}`}
              alt=""
              className="w-full bg-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-all duration-200"
            />
          </Link>
        </div>

        {/* CARD TEXT */}
        <div>
          <Link to={`/books/${book._id}`}>
            <h3 className="text-xl text-[#5300E4] font-semibold hover:text-blue-600 mb-3">{book?.name}</h3>
          </Link>
          {/* DESCRIPTION */}
          <p className="text-gray-600 mb-5">
            {book?.description.length > 80 ? `${book?.description.slice(0, 80)}...`: book?.description}
          </p>
          {/* PRICE  */}
          <p className="font-medium mb-5 text-[#5300E4]">
            ${book.newPrice} <span className="line-through font-normal ml-2">${book.oldPrice}</span>
          </p>
          <button
            onClick={() => handleAddToCart(book)} 
            className="bg-[#5300E4]  px-12 py-2 rounded-md text-base font-secondary font-bold hover:bg-secondary hover:text-white transition-all duration-200 cursor-pointer space-x-1 flex items-center gap-1 "
          >
            <FiShoppingCart className="" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookCard