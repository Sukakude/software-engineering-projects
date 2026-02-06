import React, { useState } from 'react'
import InputField from './InputField'
import SelectField from './SelectField'
import { useForm } from 'react-hook-form';
import { useAddBookMutation } from '../../../redux/features/books/booksApi';
import Swal from 'sweetalert2';
import { useFetchAllProductCategoriesQuery } from '../../../redux/features/books/bookCategoriesApi';

const AddBook = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const {data: categories} = useFetchAllProductCategoriesQuery();
    const categoryOptions = categories
        ? [
            { value: '', label: 'Choose A Category' },
            ...categories.map(c => ({
                value: c.name,
                label: c.name
            }))
            ]
        : [];
    const [imageFile, setimageFile] = useState(null);
    const [addBook, {isLoading, isError}] = useAddBookMutation()
    const [imageFileName, setimageFileName] = useState('')
    const onSubmit = async (data) => {
 
        const newBookData = {
            name: data.title,
            author: data.author,
            description: data.description,
            price: data.price,
            inventory_count: data.inventory,
            isbn: data.isbn,
            categoryName: data.categoryName,
            coverImage: imageFileName
        }
        try {
            await addBook(newBookData).unwrap();
            Swal.fire({
                title: "Book added",
                text: "Your book is uploaded successfully!",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, It's Okay!"
              });
              reset();
              setimageFileName('')
              setimageFile(null);
        } catch (error) {
            console.error(error);
            alert("Failed to add book. Please try again.")   
        }
      
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setimageFile(file);
            setimageFileName(file.name);
        }
    }
  return (
    <div className="max-w-lg   mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h2>

      {/* Form starts here */}
      <form onSubmit={handleSubmit(onSubmit)} className=''>
        {/* Book Name */}
        <InputField
          label="Book Name"
          name="title"
          placeholder="Enter book name"
          register={register}
        />

        {/* Author */}
        <InputField
          label="Author"
          name="author"
          placeholder="Enter author name"
          register={register}
        />

        {/* Description */}
        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          register={register}

        />

        {/* Category */}
        <SelectField
          label="Category"
          name="categoryName"
          options={categoryOptions}
          register={register}
        />
        {/* Inventory count */}
        <InputField
          label="Inventory Count"
          name="inventory"
          placeholder="Enter inventory count"
          register={register}
        />

        {/* New Price */}
        <InputField
          label="Price"
          name="price"
          type="number"
          placeholder="New Price"
          register={register}
          
        />

        {/* ISBN */}
        <InputField
          label="ISBN"
          name="isbn"
          placeholder="Enter book ISBN"
          register={register}
        />

        {/* Cover Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2 w-full" />
          {imageFileName && <p className="text-sm text-gray-500">Selected: {imageFileName}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-md">
         {
            isLoading ? <span className="">Adding.. </span> : <span>Add Book</span>
          }
        </button>
      </form>
    </div>
  )
}

export default AddBook