import React, { use, useState } from 'react';
import {Link, useNavigate} from "react-router";
import {useForm} from "react-hook-form";
import { useSignupMutation } from '../redux/features/users/usersApi.js';

const Register = () => {
    const [message, setMessage] = useState("");
    const [registerUser] = useSignupMutation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    
    const onSubmit = async (data) => {
        try {
            await registerUser({
                email: data.email,
                password: data.password,
            });

            alert("Registration successful");
            navigate("/verify", { state: { email: data.email } });
            localStorage.setItem("userEmail", data.email);
        } catch (err) {
            setMessage("Please provide a valid email or password.");
            console.log("Error:", err);
        }
};
  return (
    <div className='h-[calc(100vh-120px)] flex justify-center items-center'>
        <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <h2 className='text-xl font-semibold mb-4 text-[#5300E4] text-center'>Please Register</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-4'>
                    <label className='block text-[#5300E4] text-sm font-bold mb-2' htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder='Email Address' 
                        className='shadow appearance-none border rounded-xl w-full py-2 px-3 leading-tight focus:outline-none focus:shadow text-[#5300E4]' 
                        {...register("email", { required: true })}
                    />
                </div>
                <div className='mb-7'>
                    <label className='block text-[#5300E4] text-sm font-bold mb-2' htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        placeholder='Password' 
                        className='shadow appearance-none border rounded-xl w-full py-2 px-3 leading-tight focus:outline-none focus:shadow text-[#5300E4]' 
                        {...register("password", { required: true })}
                    />
                </div>
                <div className='mb-7'>
                    <label className='block text-[#5300E4] text-sm font-bold mb-2' htmlFor="confirm-password">Confirm Password</label>
                    <input 
                        type="password" 
                        name="confirm-password" 
                        id="confirm-password" 
                        placeholder='Confirm Password' 
                        className='shadow appearance-none border rounded-xl w-full py-2 px-3 leading-tight focus:outline-none focus:shadow text-[#5300E4]' 
                        {...register("confirmPassword", { required: true })}
                    />
                </div>
                {
                    message && <p className='text-red-500 text-xs italic mb-3'>{message}</p>
                }

                <div>
                    <button className='bg-[#5300E4] text-white py-2 px-6 rounded-3xl w-full hover:text-blue-300 focus:outline-none font-semibold'>Sign Up</button>
                </div>
            </form>
            <p className='align-baseline font-medium mt-4 text-sm'>Already have an account? Login <Link to='/login' className='text-[#5300E4] font-semibold hover:text-blue-500'>here</Link></p>
            <p className='mt-5 text-center text-gray-500 text-xs'>&copy; 2025 Starbooks. All rights reserved</p>
        </div>
    </div>
  )
}

export default Register