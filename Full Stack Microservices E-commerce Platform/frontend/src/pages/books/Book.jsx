import React from 'react'
import { FiShoppingCart } from "react-icons/fi"
import { useParams } from "react-router"

import { getImgUrl } from '../../utils/getImgUrl';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';

const SingleBook = () => {
    const {id} = useParams();
    const {data: book = [], isLoading, isError} = useFetchBookByIdQuery(id);

    const dispatch =  useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
    }

    if(isLoading) return <div>Loading...</div>
    if(isError) return <div>Error happending to load book info</div>
  return (
    <div className="max-w-lg shadow-md p-5 text-[#5300E4]">
            <h1 className="text-2xl font-bold mb-6">{book?.product.name}</h1>

            <div className=''>
                <div>
                    <img
                        src={`${getImgUrl(book?.product.coverImage)}`}
                        alt={book?.product.name}
                        className="mb-8"
                    />
                </div>

                <div className='mb-5'>
                    <p className="mb-2"><strong>Author:</strong> {book?.product.author || 'admin'}</p>
                    <p className="mb-4">
                        <strong>Published:</strong> {new Date(book?.product.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mb-4 capitalize">
                        <strong>Category:</strong> {book?.product.category.name}
                    </p>
                    <p><strong>Description:</strong> {book?.product.description}</p>
                </div>

                <button
                    onClick={() => handleAddToCart(book.product)} 
                    className="bg-[#5300E4] text-white px-12 py-2 rounded-md text-base font-secondary font-bold hover:text-blue-300 transition-all duration-200 cursor-pointer space-x-1 flex items-center gap-1 "
                >
                    <FiShoppingCart className="" />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
  )
}

export default SingleBook