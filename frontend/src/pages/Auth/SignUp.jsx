import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadimage';


const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminInviteToken, setAdminInviteToken] = useState('');

  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();



  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
// HANDLE SIGNUP FORM SUBMIT
  const handleSignUp = async (e) => {
    e.preventDefault();

     let profileImageUrl='';

    if (!fullName) {
      setError('Please enter full name.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter the password');
      return;
    }

    setError('');
    // SignUp API Call
    try{

      //upload image if present

       if (profilePic){
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
       }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name : fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken
      });

      const { token , role } = response.data;

      if(!token ){
        localStorage.setItem("token", token);
        updateUser(response.data);

        //Redirect based on role

        if(role === "admin"){
          navigate("/admin/dashboard");
        }else{
          navigate("/user/dashboard");
        }


      }

    }catch(error){
      console.error(error)
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("Something went wrong. Please try again");
      }

    }

  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp} className="space-y-6">
          <ProfilePhotoSelector
            image={profilePic}
            setImage={setProfilePic}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="John Doe"
                type="text"
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                type="email"
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                type="password"
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Admin Invite Token */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Admin Invite Token
              </label>
              <input
                value={adminInviteToken}
                onChange={(e) => setAdminInviteToken(e.target.value)}
                placeholder="6 Digit Code"
                type="text"
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type="submit"
            className="btn-primary"
          >
            Sign Up
          </button>
          <p className='text-[13px] text-slate-800 mt-3'>
          Already have an account?{" "}
          <Link className="font-medium text-primary underline" to ="/login">
            Login
          </Link> 
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
