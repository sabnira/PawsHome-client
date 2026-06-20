import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Swal from "sweetalert2";


const SocialLogin = () => {

    const { signInWithGoogle, signInWithFacebook } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate()


    const handleSocialLogin = async (providerFn, providerName) => {
        try {
            const result = await providerFn();
            const userInfo = {
                name: result.user?.displayName,
                email: result.user?.email,
            };
            await axiosPublic.post("/users", userInfo);
            Swal.fire({
                icon: "success",
                title: "Signed In Successfully",
                text: `Using your ${providerName} account.`,
                confirmButtonColor: "#43934A",
            });
            navigate("/");
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: `${providerName} Sign-In Failed`,
                text: err.message,
                confirmButtonColor: "#e53e3e",
            });
        }
    };


    return (
        <div className="flex flex-col gap-3 mb-6">
            <button
                onClick={() => handleSocialLogin(signInWithGoogle, "Google")}
                className="btn w-full bg-[#2C2C2E] hover:bg-[#3a3a3c] text-white border border-white/10 rounded-xl text-sm font-medium gap-2 normal-case"
            >
                <FcGoogle className="text-xl" />
                Continue with Google
            </button>

            <button
                onClick={() => handleSocialLogin(signInWithFacebook, "Facebook")}
                className="btn w-full bg-[#2C2C2E] hover:bg-[#3a3a3c] text-white border border-white/10 rounded-xl text-sm font-medium gap-2 normal-case"
            >
                <FaFacebook className="text-xl text-[#1877F2]" />
                Continue with Facebook
            </button>
        </div>
    );
};

export default SocialLogin;