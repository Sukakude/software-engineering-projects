import React, { useEffect } from 'react'
import InputField from '../Add Book/InputField'
import SelectField from '../Add Book/SelectField'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { useFetchBookByIdQuery, useUpdateBookMutation } from '../../../redux/features/books/booksApi';
import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';
import { useFetchAllProductCategoriesQuery } from '../../../redux/features/books/bookCategoriesApi';

const UpdateBook = () => {
  const { id } = useParams();
  const { data: bookData, isLoading, isError, refetch } = useFetchBookByIdQuery(id);
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
  const [updateBook] = useUpdateBookMutation();
  const { register, handleSubmit, setValue, reset } = useForm();
  useEffect(() => {
  if (bookData?.data) {
    const d = bookData.data;

    setValue("title", d.name);
    setValue("description", d.description);
    setValue("category", d.category?.name);
    setValue("oldPrice", d.oldPrice);
    setValue("newPrice", d.newPrice);
    setValue("coverImage", d.coverImage);
  }
}, [bookData, setValue]);


  const onSubmit = async (data) => {
    const updateBookData = {
      name: data.title,
      description: data.description,
      categoryName: data.categoryName,
      oldPrice: Number(data.oldPrice),
      price: Number(data.price),
      coverImage: data.coverImage || bookData.coverImage,
    };
    try {
      await updateBook(bookData?.data._id, updateBookData).unwrap();
      Swal.fire({
        title: "Book Updated",
        text: "Your book is updated successfully!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Done"
      });
      await refetch()
    } catch (error) {
      console.log("Failed to update book.");
      alert("Failed to update book.");
    }
  }
  if (isLoading) return <Loading />
  if (isError) return <div>Error fetching book data</div>
  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Book</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
        />

        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          register={register}
        />

        <SelectField
          label="Category"
          name="category"
          options={categoryOptions}
          register={register}
        />

        <InputField
          label="Old Price"
          name="oldPrice"
          type="number"
          placeholder="Old Price"
          register={register}
        />

        <InputField
          label="New Price"
          name="newPrice"
          type="number"
          placeholder="New Price"
          register={register}
        />

        <InputField
          label="Cover Image URL"
          name="coverImage"
          type="text"
          placeholder="Cover Image URL"
          register={register}
        />

        <button type="submit" className="w-full py-2 bg-blue-500 text-white font-bold rounded-md">
          Update Book
        </button>
      </form>
    </div>
  )
}

export default UpdateBook