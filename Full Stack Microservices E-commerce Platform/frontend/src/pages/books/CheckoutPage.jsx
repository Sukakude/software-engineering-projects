import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import Swal from "sweetalert2";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice, 0)
    .toFixed(2);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const { register, handleSubmit, formState: { errors } } = useForm();

  if (!user) return null;

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Create order first
      const orderPayload = {
        userId: user.userId,
        items: cartItems,
        totalAmount: totalPrice
      };

      const { data: createdOrder } = await axios.post(
        `${import.meta.env.VITE_ORDERS_SERVICE_URL}/orders/create-order`,
        orderPayload,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const orderId = createdOrder._id;

      // Initiate payment
      const { data: paymentData } = await axios.post(
        `${import.meta.env.VITE_PAYMENT_SERVICE_URL}/payments/initiate`,
        {
          orderId,
          userId: user._id,
          amount: Math.round(totalPrice * 100), // Stripe expects cents as integer
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // Confirm payment with Stripe.js
      const cardElement = elements.getElement(CardElement);
      const { error } = await stripe.confirmCardPayment(paymentData.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: data.name, email: user.email },
        },
      });

      if (error) {
        Swal.fire("Payment failed", error.message, "error");
      } else {
        Swal.fire("Payment successful", "Your order has been placed!", "success");
        navigate("/orders");
      }
    } catch (err) {
      console.error("Error in checkout:", err);
      Swal.fire("Error", "Failed to create order or process payment", "error");
    }
    setIsLoading(false);
  };

  return (
    <section className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
      <div className="container max-w-5xl mx-auto">
        <div className="bg-white rounded shadow-lg p-6 md:p-8 mb-6">
          <h2 className="font-semibold text-xl text-gray-600 mb-4">Checkout</h2>
          <p className="text-gray-500 mb-2">Total Price: ${totalPrice}</p>
          <p className="text-gray-500 mb-6">Items: {cartItems.length}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 text-sm grid-cols-1">
            {/* Personal Info */}
            <div>
              <label>Full Name</label>
              <input
                {...register("name", { required: true })}
                type="text"
                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="text"
                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                disabled
                defaultValue={user.email}
              />
            </div>
            <div>
              <label>Phone</label>
              <input
                {...register("phone", { required: true })}
                type="text"
                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
              />
            </div>
            <div>
              <label>Address</label>
              <input
                {...register("address", { required: true })}
                type="text"
                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>City</label>
                <input
                  {...register("city", { required: true })}
                  type="text"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                />
              </div>
              <div>
                <label>State</label>
                <input
                  {...register("state", { required: true })}
                  type="text"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                />
              </div>
              <div>
                <label>Country</label>
                <input
                  {...register("country", { required: true })}
                  type="text"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                />
              </div>
              <div>
                <label>Zipcode</label>
                <input
                  {...register("zipcode", { required: true })}
                  type="text"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                />
              </div>
            </div>

            {/* Stripe Card */}
            <div className="mt-4">
              <label>Card Details</label>
              <div className="p-2 border rounded bg-gray-50">
                <CardElement />
              </div>
            </div>

            {/* Terms */}
            <div className="mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="form-checkbox"
                />
                <span className="ml-2">
                  I agree to the <Link className="underline text-blue-600">Terms & Conditions</Link>.
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="mt-4">
              <button
                disabled={!isChecked || isLoading}
                type="submit"
                className="bg-[#5300E4] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                {isLoading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const CheckoutPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default CheckoutPage;
