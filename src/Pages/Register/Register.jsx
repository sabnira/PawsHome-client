// import { Player } from "@lottiefiles/react-lottie-player";
import { Helmet } from "react-helmet-async";
// import registerAnim from "../../assets/json/signup.json";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import SocialLogin from "../../components/SocialLogin";
// import dogImg from "../../assets/dog.png";
import petImg from "../../assets/pet.png";


const Register = () => {

    const axiosPublic = useAxiosPublic();
    const { createUser, updateUserProfile} = useContext(AuthContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = data => {
        // console.log(data);
        createUser(data.email, data.password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser);
                updateUserProfile(data.name, data.photoURL)
                    .then(() => {

                        //create user entry in the database
                        const userInfo = {
                            name: data.name,
                            email: data.email
                        }
                        axiosPublic.post('/users', userInfo)
                            .then(res => {
                                if (res.data.insertedId) {

                                    console.log('user added to the database');
                                    reset()

                                    Swal.fire({
                                        icon: "success",
                                        title: "Sign up Successful",
                                        text: "User created successfully.",
                                        confirmButtonColor: "#43934A"
                                    });

                                    navigate('/')
                                }
                            })

                    })
                    .catch(error => console.log(error))
            })
    }


    return (
        <>
            <Helmet>
                <title>PawsHome | Sign up</title>
            </Helmet>
            <div className="min-h-screen flex">

                {/* left panel */}
                <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#EEEDF8] px-12 py-12">
                    <div>
                        <h1 className="text-3xl font-bold text-[#302a6b] mb-3">
                            Join PawsHome
                        </h1>
                        <p className="text-[#433c93] text-sm leading-relaxed max-w-xs">
                            Create an account to start adopting and helping pets in need.
                        </p>
                    </div>
                    <div className="flex-1 flex items-end justify-end">
                        {/* <Player
                            autoplay
                            loop
                            src={registerAnim}
                            className="w-72 h-72"
                        /> */}
                        <img className="w-40 h-40" src={petImg} alt="dog" />
                    </div>
                </div>


                {/* right panel */}
                <div className="flex flex-col justify-center w-full md:w-1/2 bg-[#1C1C1E] px-8 md:px-14 py-12">

                    <h2 className="text-2xl font-bold text-white mb-6">
                        Create account
                    </h2>

                    {/* Social buttons */}
                    <SocialLogin></SocialLogin>


                    {/* Divider */}
                    <div className="divider text-white/20 text-xs before:bg-white/10 after:bg-white/10 my-2">
                        or
                    </div>


                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

                        <div className="grid grid-cols-2 gap-3">

                            {/* Full Name */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-white/50 font-medium">
                                    Full name
                                </label>
                                <input type="text" placeholder="Your Name" 
                                    className={`input input-sm w-full bg-[#2C2C2E] border text-white placeholder-white/20 rounded-xl focus:outline-none text-sm h-11
                                    ${errors.name ? "border-red-500" : "border-white/10 focus:border-white/30"}`}

                                    {...register("name", {required: "Required", minLength: { value: 2, message: "Min 2 chars" },})}
                                />
                                {errors.name && (
                                    <p className="text-red-400 text-xs">{errors.name.message}</p>
                                )}
                            </div>


                            {/* Photo URL */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-white/50 font-medium">
                                    Profile photo URL
                                </label>
                                <input type="url" placeholder="https://..."
                                    className={`input input-sm w-full bg-[#2C2C2E] border text-white placeholder-white/20 rounded-xl focus:outline-none text-sm h-11
                                    ${errors.photoURL ? "border-red-500" : "border-white/10 focus:border-white/30"}`}

                                    {...register("photoURL", {
                                        required: "Required",
                                        pattern: {
                                            value: /^https?:\/\/.+/i,
                                            message: "Invalid URL",
                                        },
                                    })}
                                />
                                {errors.photoURL && (
                                    <p className="text-red-400 text-xs">{errors.photoURL.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-white/50 font-medium">
                                Email
                            </label>
                            <input type="email" placeholder="your@email.com"
                                className={`input input-sm w-full bg-[#2C2C2E] border text-white placeholder-white/20 rounded-xl focus:outline-none text-sm h-11
                                 ${errors.email ? "border-red-500" : "border-white/10 focus:border-white/30"}`}

                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email",
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-white/50 font-medium">
                                Password
                            </label>
                            <div className={`flex items-center bg-[#2C2C2E] border rounded-xl h-11 px-3
                                ${errors.password ? "border-red-500" : "border-white/10 focus-within:border-white/30"}`}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className="flex-1 bg-transparent text-white text-sm placeholder-white/20 focus:outline-none"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "At least 6 characters" },
                                        maxLength: { value: 20, message: "Max 20 characters" },
                                        pattern: {
                                            value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                                            message: "Need uppercase, lowercase, number & special char",
                                        },
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-white/30 hover:text-white/70 transition-colors ml-2"
                                >
                                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn w-full bg-white hover:bg-gray-100 text-black font-semibold rounded-xl h-11 text-sm normal-case border-none mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? <span className="loading loading-spinner loading-sm" />
                                : "Create account"
                            }
                        </button>

                    </form>


                    {/* Login link */}
                    <p className="text-center text-sm text-white/40 mt-6">
                        Already registered?{" "}
                        <NavLink
                            to="/login"
                            className="text-[#7c6ff7] hover:text-[#a89ff9] font-medium transition-colors"
                        >
                            Sign in
                        </NavLink>
                    </p>

                </div>
            </div>
        </>
    );
};

export default Register;