"use client";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

const page = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  // const handleSignIn = async () => {
  //   try {
  //     // Trigger sign-in with Email provider (magic link)
  //     await signIn("google"); // "email" refers to the EmailProvider set in NextAuth
  //   } catch (error) {
  //     console.error("Error signing in:", error);
  //   }
  // };
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg ">
      <h2 className="text-3xl font-semibold text-center py-2 text-gray-900">
        Welcome
      </h2>
      <p className="text-center text-gray-500 my-4">
        Sign in or create an account to continue
      </p>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Google Sign-In Button */}
        <div>
          <button
            type="button"
            className="flex items-center gap-2 justify-center w-full py-4 px-4  text-black font-semibold rounded-lg focus:outline-none hover:bg-gray-100"
            onClick={() => signIn("google")}
          >
            <FcGoogle />
            Continue with Google
          </button>
        </div>

        {/* OR Divider */}
        <div className="text-center text-gray-400">OR</div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="text-sm text-gray-600">
            Email
          </label>

          {/* Email Input Field */}
          <input
            type="email"
            id="email"
            name="email"
            placeholder="m@example.com"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full p-3 border border-gray-900 rounded-lg text-gray-900"
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          ) : null}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-black text-white font-normal rounded-lg focus:outline-none hover:bg-gray-900"
          >
            Continue with Email
          </button>
        </div>
      </form>

      {/* Terms of Service */}
      <p className="text-center text-sm text-gray-500 mt-4">
        By clicking continue, you agree to our{" "}
        <a href="/terms" className="text-gray-900 hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-blue-500 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default page;
