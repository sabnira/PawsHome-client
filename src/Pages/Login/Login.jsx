import { Helmet } from "react-helmet-async";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import SocialLogin from "../../components/SocialLogin";
import petImg from "../../assets/pet.png";
import { LoadCanvasTemplate, loadCaptchaEnginge, validateCaptcha } from "react-simple-captcha";


const Login = () => {

    const { signIn, setUser } = useContext(AuthContext)

    const navigate = useNavigate();
    const location = useLocation()

    const [showPassword, setShowPassword] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const from = location.state?.from?.pathname || "/";
    console.log('state in the location login page', location.state);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();


    useEffect(() => {
        loadCaptchaEnginge(6,'black','white')
    }, [])


    const onSubmit = async (data) => {
        try {
            const result = await signIn(data.email, data.password);
            setUser(result.user);

            Swal.fire({
                icon: "success",
                title: "Login Successful",
                text: "You have logged in successfully.",
                confirmButtonColor: "#43934A"
            });

            navigate(from, { replace: true });

        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: "Invalid email or password. Please try again.",
                confirmButtonColor: "#d33"
            });
        }
    };


    const handleValidateCaptcha = (e) => {
        const user_captcha_value = e.target.value;

        if (validateCaptcha(user_captcha_value)) {
            setDisabled(false)
        }

    }


    return (
        <>
            <Helmet>
                <title>PawsHome | Sign in</title>
            </Helmet>
            <div className="min-h-screen flex">

                {/* left panel */}
                <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#edf8f5] px-12 py-12">
                    <div>
                        <h1 className="text-3xl font-bold text-[#2e2865] mb-3">
                            Welcome back!
                        </h1>
                        <p className="text-[#413a8d] text-sm leading-relaxed max-w-xs">
                            Sign in to manage your pets, donations, and adoption requests.
                        </p>
                    </div>
                    <div className="flex-1 flex items-end justify-end">
                        <img className="w-40 h-40" src={petImg} alt="dog" />
                    </div>
                </div>


                {/* right panel */}
                <div className="flex flex-col justify-center w-full md:w-1/2 bg-[#1C1C1E] px-8 md:px-14 py-8">

                    <h2 className="text-2xl font-bold text-white mb-6">
                        Sign in
                    </h2>

                    {/* Social buttons */}
                    <SocialLogin></SocialLogin>


                    {/* Divider */}
                    <div className="divider text-white/20 text-xs before:bg-white/10 after:bg-white/10 my-2">
                        or
                    </div>


                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-2">

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

                         <div>
                            <a className="link link-hover text-white/40 text-xs">Forgot password?</a>
                        </div>


                        {/* Captcha */}

                        <div className="flex gap-6">
                            <div className="bg-[#2C2C2E] border border-white/10 rounded-xl px-3 py-2 ">
                                <LoadCanvasTemplate reloadColor="white"/>
                            </div>

                            <input onBlur={handleValidateCaptcha} type="text" name="captcha" className="input" placeholder="Type the captcha" 
                            className={`input input-sm w-full bg-[#2C2C2E] border text-white placeholder-white/20 rounded-xl focus:outline-none text-sm h-11
                                `}/>
                            
                        </div>


                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting || disabled}
                            className="btn w-full bg-white hover:bg-gray-100 text-black font-semibold rounded-xl h-11 text-sm normal-case border-none mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? <span className="loading loading-spinner loading-sm" />
                                : "Sign in"
                            }
                        </button>

                    </form>


                    {/* Login link */}
                    <p className="text-center text-sm text-white/40 mt-6">
                        No account?{" "}
                        <NavLink
                            to="/register"
                            className="text-[#7c6ff7] hover:text-[#a89ff9] font-medium transition-colors"
                        >
                            Sign up
                        </NavLink>
                    </p>

                </div>
            </div>
        </>
    );
};

export default Login;