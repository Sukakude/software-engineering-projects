import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useVerifyEmailMutation, useResendVerificationMutation } from "../redux/features/users/usersApi";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [verifyEmail] = useVerifyEmailMutation();
  const [resendCode, { isLoading }] = useResendVerificationMutation();

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Missing email. Please register again.");
      return;
    }

    try {
      const response = await verifyEmail({ verificationCode: String(code) });
      if (response.data?.success) {
        setSuccessMsg("Email verified successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage("Invalid or expired verification code.");
      }
    } catch (err) {
      setMessage("Verification failed. Check your code.");
      console.log("Verify Error:", err);
    }
  };

  const handleResend = async () => {
    try {
      // ideally, you know the user's email here
      await resendCode({ email: localStorage.getItem("userEmail") }).unwrap();
      alert("Verification code resent!");
    } catch (err) {
      alert(err.data?.message || "Failed to resend code");
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4 text-[#5300E4] text-center">
          Verify Your Email
        </h2>

        <p className="text-gray-600 text-sm mb-4 text-center">
          A 6-digit verification code has been sent to:
          <br />
          <span className="font-semibold">{email}</span>
          <div className="font-semibold">
            Haven't received your code?  
            <button className="text-[#5300E4] hover:text-blue-300 mx-1 font-semibold" disabled={isLoading} onClick={handleResend}>
                {isLoading ? "Resending..." : "Resend Code"}
          </button>
          </div>
        </p>

        <form onSubmit={handleVerify}>
          <label className="block text-[#5300E4] text-sm font-bold mb-2">
            Verification Code
          </label>

          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            className="shadow appearance-none border rounded-xl w-full py-2 px-3 mb-4 leading-tight focus:outline-none text-[#5300E4]"
          />

          {message && <p className="text-red-500 text-xs italic mb-3">{message}</p>}
          {successMsg && <p className="text-green-600 text-xs italic mb-3">{successMsg}</p>}

          <button className="bg-[#5300E4] text-white py-2 px-6 rounded-3xl w-full hover:text-blue-300 font-semibold">
            Verify Email
          </button>
          
        </form>

        

        <p className="mt-5 text-center text-gray-500 text-xs">
          &copy; 2025 Starbooks. All rights reserved
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
