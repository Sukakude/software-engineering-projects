import {createSlice} from '@reduxjs/toolkit';
import Swal from 'sweetalert2'

const initialState = {
    cartItems: [],
}

const cartSlice = createSlice({
    name:'cart',
    initialState: initialState,
    reducers:{
        addToCart: (state, action) => {
            // CHECK IF ITEM EXISTS IN A CART
            const existingItem = state.cartItems.find(item => item._id === action.payload._id);
            if(!existingItem){
                state.cartItems.push(action.payload);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Product Added To Cart",
                    showConfirmButton: true,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Ok",
                    timer: 2000
                })
            }
            else{
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "Product Already Exist in Cart",
                    showConfirmButton: true,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Ok",
                    timer: 2000
                })
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item._id !== action.payload._id);
        },
        clearCart: (state) => {
            state.cartItems = [];
        }
    }
})

// TODO: EXPORT THE ACTIONS
export const {addToCart, removeFromCart, clearCart} = cartSlice.actions;
export default cartSlice.reducer;