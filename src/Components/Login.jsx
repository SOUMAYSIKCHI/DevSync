import { useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../Utils/userSlice";
import { BASE_URL } from "../Constants";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signup, setSignup] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(false);
  const [remDetails, setRemDetails] = useState(false);
  const [forgotPassOpt,setForgotPassOpt] = useState(false);
  const [resetPassOpt,setResetPassOpt] = useState(false);
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  
  const [formData, setformData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    cnfrmPassword:"",
    otp: "",
  });

  function formHandler(e) {
    setError("");
    const { name, value } = e.target;
    setformData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  function submitHandler(e) {
    e.preventDefault();
  }
  
  const goBackHandler = () => {
    setError("");
    setSignup(true);
    setOtp(false);
  };
   
  const goBackHandler2 = ()=>{
    // forgotPassOpt && !signup && !remDetails && !otp
    setForgotPassOpt(true);
    setSignup(false);
    setRemDetails(false);
    setOtp(false);
    setError(false);
  }

  // Eye icon SVG components
  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m1 1 22 22" stroke="currentColor" strokeWidth="2"/>
      <path d="M6.71 6.71C4.35 8.5 2.62 10.89 2 12c1.46 2.61 4.13 5.1 7.36 6.29" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="m10 10-0.24 1a3 3 0 0 0 4.24 4.24l1-0.24" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M14.12 14.12c2.36-1.79 4.09-4.18 4.71-5.83-1.46-2.61-4.13-5.1-7.36-6.29" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  );

  //user login
  const loginHandler = async()=>{    
    setError("");
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      formData.password)) {setError(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }
    if (formData.emailId === "" || !formData.emailId.includes("@")) {
      setError("Invalid email format");
      return;
    }
     try {
      setError("Logging in....");
      const res = await axios.post(
        BASE_URL+"/login",
        {
          emailId: formData.emailId,
          password: formData.password
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        dispatch(addUser(res.data.user));
        toast.success("Login success.")
        navigate("/v1/jobs"); 
        setError("");
      }
      
    } catch (err) {
      navigate("/");
      setError(err?.response?.data?.message);
    }
  }
  
  //user click forgot pass:
  const forgotPassHandler = async()=>{
    setError("Sending OTP....");
    if (formData.emailId === "" || !formData.emailId.includes("@")) {
      setError("Invalid email format");
      return;
    }
    try {
      const res = await axios.post(
        BASE_URL+"/reset",
        {
          emailId: formData.emailId,
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Check your email for the OTP.")
        setResetPassOpt(true);
        setForgotPassOpt(false);
        setError("");
      }
      
    } catch (err) {
      setError(err?.response?.data?.message);
    }
  }

  //user reset pass :
  const resetPassHandler = async()=>{
    setError("Check for OTP in Spam folder");
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.password)){
      setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return; 
    }
    try {
      const res = await axios.post(
        BASE_URL+"/reset/verify",
        {
          emailId: formData.emailId,
          otp: formData.otp,
          password:formData.password
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("You're all set! Please log in to get started.");
        setError("");
        setSignup(false);
        setOtp(false);
        setRemDetails(false);
        setForgotPassOpt(false);
        setResetPassOpt(false);
      }
    } catch (err) {
      setError(err?.response?.data?.message);
    }
  }

  // Sign up Process : 
  //User enter email id and otp is sent :
  const handleSignup = async () => {
    setError("Sending OTP....");
    if (formData.emailId === "" || !formData.emailId.includes("@")) {
      setError("Invalid email format");
      return;
    }
    try {
      const res = await axios.post(
        BASE_URL+"/signup/start",
        {
          emailId: formData.emailId,
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Check your email for the OTP.{check spam folder for OTP}")
        setOtp(true);
        setError("");
      }
      
    } catch (err) {
      setError(err?.response?.data?.message);
    }
  };
  
  //user enter otp and verify it
  const handleOtp = async () => {
    if (/^\d{7}$/.test(formData.otp)) {
      setError("OTP must be exactly 6 digits and contain only numbers.");
      return;
    }
    try {
      const res = await axios.post(
        BASE_URL+"/signup/verify-otp",
        {
          emailId: formData.emailId,
          otp: formData.otp,
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("OTP verified successfully.")
        setOtp(false);
        setSignup(false);
        setError("");
        setRemDetails(true);
      }
    } catch (err) {
      setError(err?.response?.data?.message);
    }
  };
  
  //user enter password and signup
  const handleSuccessfullSignup = async () => {
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.password
      )
    ) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }
    if(formData.firstName===""){
      setError("Enter an valid name");
      return;
    }
    try {
      const res = await axios.post(
        BASE_URL+"/signup",
        {
          firstName: formData.firstName,
          lastName:formData.lastName,
          emailId: formData.emailId,
          password:formData.password
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("You're all set! Please log in to get started.");
        setError("");
        setSignup(false);
        setOtp(false);
        setRemDetails(false);
      }
    } catch (err) {
      setError(err?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="absolute z-30 text-white w-[100%] top-[90px] opacity-97 pb-3">
        {/* Login process for  user */}
        {!signup && !remDetails && !otp && !forgotPassOpt && !resetPassOpt &&(
          <form
            onSubmit={submitHandler}
            action=""
            className="mx-8 sm:w-9/12 md:w-3/4 lg:w-4/12 font-Segoe UI Symbol bg-black rounded-lg lg:px-14 md:px-14 py-10 lg:mx-auto md:mx-auto px-10"
          >
            <div className="text-center font-bold text-xl md:text-2xl lg:text-3xl">
              Log-In
            </div>

            <div>
              <input
                className="mt-6 px-4 py-2 text-[20px] w-full rounded-sm bg-black opacity-90 border-2 border-gray-700"
                type="text"
                name="emailId"
                id="emailId"
                value={formData.emailId}
                onChange={formHandler}
                placeholder="Enter your email Id"
              />

              <div className="relative">
                <input
                  className="mt-6 px-4 py-2 pr-12 text-lg lg:text-xl md:text-xl w-full rounded-sm bg-black opacity-90 border-2 border-gray-700"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={formHandler}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors mt-3"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              <button className="mt-4  ">
                Forgot password ?{" "}
                <span onClick={()=>setForgotPassOpt(true)}className="cursor-pointer text-cyan-500">
                  <u>Click here.</u>
                </span>
              </button>

              <p className="mt-2 text-red-700">{error}</p>
              <button onClick={loginHandler}
                type="submit"
                className="mt-6 px-4 py-2  text-lg lg:text-xl md:text-xl w-full rounded-md bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 opacity-100 cursor-pointer"
              >
                Login
              </button>
              <p className="w-full text-center mt-4 font-bold text-xl">Or</p>
              <p
                onClick={() => {setSignup(true); setError("");}}
                className="text-center rounded-md  px-4 py-2 cursor-pointer  text-lg lg:text-xl md:text-xl w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 mt-3"
              >
                Create New Account
              </p>
            </div>
          </form>
        )}

        {/* forgot pass so enter email */}
         {forgotPassOpt && !signup && !remDetails && !otp && (
          <form
            onSubmit={submitHandler}
            action=""
            className="mx-8 sm:w-9/12 md:w-3/4 lg:w-4/12 font-Segoe UI Symbol bg-black rounded-lg lg:px-14 md:px-14 py-10 lg:mx-auto md:mx-auto px-10"
          >
            <div className="text-center font-bold text-xl md:text-2xl lg:text-3xl">
              Reset-Password
            </div>
            <div>
              <input
                className="mt-6 px-4 py-2 text-[20px] w-full rounded-sm bg-black opacity-90 border-2 border-gray-700"
                type="text"
                name="emailId"
                id="emailId"
                value={formData.emailId}
                onChange={formHandler}
                placeholder="Enter your email Id"
              />
              <p className="mt-2 text-red-700">{error}</p>
              <button
                onClick={forgotPassHandler}
                type="submit"
                className="mt-6 px-4 py-2  text-lg lg:text-xl md:text-xl w-full rounded-md bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 opacity-100 cursor-pointer"
              >
                Verify Email
              </button>
              <p className="w-full text-center mt-4 font-bold text-xl">Or</p>
              <p
                onClick={goBackHandler}
                className="text-center rounded-md cursor-pointer px-4 py-2  text-lg lg:text-xl md:text-xl w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 mt-3"
              >
                Go Back
              </p>
            </div>
          </form>
        )}

        {/* verify otp and update new password */}
        {resetPassOpt && !forgotPassOpt && !signup && !remDetails && !otp &&(
          <form
            onSubmit={submitHandler}
            action=""
            className="mx-8 sm:w-9/12 md:w-3/4 lg:w-4/12 font-Segoe UI Symbol bg-black rounded-lg lg:px-14 md:px-14 py-10 lg:mx-auto md:mx-auto px-10"
          >
            <div className="text-center font-bold text-xl md:text-2xl lg:text-3xl">
            Welcome Back to DevSync!
            </div>
            <p className="mt-2">Verify your OTP and choose a strong password to continue.</p>
            <div>
               <input
                className="mt-6 px-4 py-2 text-[20px] w-full rounded-sm bg-black opacity-90 border-2 border-gray-700"
                type="text"
                name="otp"
                id="otp"
                value={formData.otp}
                onChange={formHandler}
                placeholder="🔐Enter the OTP sent to your email{Check Spam}"
              />      
              <div className="relative">
                <input
                  className="mt-6 px-4 py-2 pr-12 text-[20px] w-full rounded-sm bg-black opacity-90 border-2 border-gray-700"
                  type={showResetPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={formHandler}
                  placeholder="Enter a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowResetPassword(!showResetPassword)}
                  className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors mt-3"
                >
                  {showResetPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <p className="mt-2 text-red-700">{error}</p>
              <button
                onClick={resetPassHandler}
                type="submit"
                className="mt-6 px-4 py-2  text-lg lg:text-xl md:text-xl w-full rounded-md bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 opacity-100 cursor-pointer"
              >
                Reset Password
              </button>
              <p className="w-full text-center mt-4 font-bold text-xl">Or</p>
              <p
                onClick={goBackHandler2}
                className="text-center rounded-md cursor-pointer px-4 py-2  text-lg lg:text-xl md:text-xl w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 mt-3"
              >
                Go Back
              </p>
            </div>
          </form>
        )}

        {/* signup for new user------------------------------------------- */}
        {signup && !remDetails && !otp && (
          <form
            onSubmit={submitHandler}
            action=""
            className="mx-8 sm:w-9/12 md:w-3/4 lg:w-4/12 font-Segoe UI Symbol bg-black rounded-lg lg:px-14 md:px-14 py-10 lg:mx-auto md:mx-auto px-10"
          >
            <div className="text-center font-bold text-xl md:text-2xl lg:text-3xl">
              Sign-Up
            </div>
            <div>
              <input
                className="mt-6 px-4 py-2 text-[20px] w-full rounded-sm bg-black opacity-90 border-2 border-gray-700"
                type="text"
                name="emailId"
                id="emailId"
                value={formData.emailId}
                onChange={formHandler}
                placeholder="Enter your email Id"
              />
              <p className="mt-2 text-red-700">{error}</p>
              <button
                onClick={handleSignup}
                type="submit"
                className="mt-6 px-4 py-2  text-lg lg:text-xl md:text-xl w-full rounded-md bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 opacity-100 cursor-pointer"
              >
                Verify Email
              </button>
              <p className="w-full text-center mt-4 font-bold text-xl">Or</p>
              <p
                onClick={() => {setSignup(false); setError("")}}
                className="text-center rounded-md cursor-pointer px-4 py-2  text-lg lg:text-xl md:text-xl w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 mt-3"
              >
                Already have an Account? Login
              </p>
            </div>
          </form>
        )}

        {/* enter and verify otp  */}
        {otp && !remDetails && (
          <form
            onSubmit={submitHandler}
            action=""
            className="mx-8 sm:w-9/12 md:w-3/4 lg:w-4/12 font-Segoe UI Symbol bg-black rounded-lg lg:px-14 md:px-14 py-10 lg:mx-auto md:mx-auto px-10"
          >
            <div className="text-center font-bold text-xl md:text-2xl lg:text-3xl">
              Verify Your Email Address
            </div>
            <div>
              <input
                className="mt-6 px-4 py-2 text-[20px] w-full rounded-sm bg-black opacity-90 border-2 border-gray-700"
                type="text"
                name="otp"
                id="otp"
                value={formData.otp}
                onChange={formHandler}
                placeholder="🔐 Enter the OTP sent to your email"
              />
              <p className="mt-2 text-red-700">{error}</p>
              <button
                onClick={handleOtp}
                type="submit"
                className="mt-6 px-4 py-2  text-lg lg:text-xl md:text-xl w-full rounded-md bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 opacity-100 cursor-pointer"
              >
                Verify OTP
              </button>
              <p className="w-full text-center mt-4 font-bold text-xl">Or</p>
              <p
                onClick={goBackHandler}
                className="text-center rounded-md cursor-pointer px-4 py-2  text-lg lg:text-xl md:text-xl w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 mt-3"
              >
                Go Back
              </p>
            </div>
          </form>
        )}

        {/* set password */}
        {remDetails && (
          <form
            onSubmit={submitHandler}
            action=""
            className="mx-8 sm:w-9/12 md:w-3/4 lg:w-4/12 font-Segoe UI Symbol bg-black rounded-lg lg:px-14 md:px-14 py-10 lg:mx-auto md:mx-auto px-10"
          >
            <div className="text-center font-bold text-xl md:text-2xl lg:text-3xl">
             Welcome to DevSync!
            </div>
            <p className="mt-2">Just enter your name and choose a strong password to continue.</p>
            <div>
              <input
                className="mt-6 px-4 py-2 text-[20px] w-full rounded-sm bg-black opacity-90 border-2 border-gray-700"
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={formHandler}
                placeholder="Enter your first name"
              />
              <input
                className="mt-6 px-4 py-2 text-[20px] w-full rounded-sm bg-black opacity-90 border-2 border-gray-700"
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={formHandler}
                placeholder="Enter your Last name"
              />
              <div className="relative">
                <input
                  className="mt-6 px-4 py-2 pr-12 text-[20px] w-full rounded-sm bg-black opacity-90 border-2 border-gray-700"
                  type={showSignupPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={formHandler}
                  placeholder="Enter a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors mt-3"
                >
                  {showSignupPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
             
              <p className="mt-2 text-red-700">{error}</p>
              <button
                onClick={handleSuccessfullSignup}
                type="submit"
                className="mt-6 px-4 py-2  text-lg lg:text-xl md:text-xl w-full rounded-md bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 opacity-100 cursor-pointer"
              >
                Signup
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default Login;
