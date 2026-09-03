import { Link, useParams } from "react-router-dom";
import usePet from "../../hooks/usePet";
import { FaArrowLeft, FaMapMarkerAlt, FaHeart, FaPaw, FaCheckCircle } from "react-icons/fa";
import Loading from "../../components/Loading";
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../hooks/useAxiosPublic";


const PetDetails = () => {

    const { id } = useParams();
    const [pet, loading] = usePet(id);
    const { user } = useContext(AuthContext);
    const [submitted, setSubmitted] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const axiosPublic = useAxiosPublic();

    if (loading) {
        return <Loading></Loading>
    }

    const { _id, name, image, age, location, price, gender, category, description } = pet;


    const handleAdoption = async (formData) => {

        const adoption = {
            petId: _id,
            petName: name,
            petImage: image,
            userName: user?.displayName,
            userEmail: user?.email,
            userNumber: formData.phoneNumber,
            userAddress: formData.address,
            status: "pending",
            createdAt: new Date(),
        };

        try {
            const res = await axiosPublic.post("/adoptions", adoption);

            console.log(res.data);

            setSubmitted(true);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-base-100">
            <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">

                {/* Back Button */}
                <Link
                    to="/pet-listing"
                    className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-base-content/60 hover:text-warning transition-colors duration-300"
                >
                    <FaArrowLeft className="text-xs" />
                    Back to all pets
                </Link>

                <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

                    {/*==== LEFT SIDE ======*/}
                    <div className="space-y-7">

                        {/* Pet Image */}
                        <div className="relative overflow-hidden rounded-[30px]">
                            <img
                                src={image}
                                alt={name}
                                className="w-full h-100 md:h-132 object-cover transition-transform duration-500 hover:scale-[1.02]"
                            />

                            {/* Availability */}
                            <div className="absolute top-5 left-5">
                                <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 text-green-600 text-xs font-semibold shadow-md">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Available for adoption
                                </span>
                            </div>
                        </div>

                        {/* Pet Heading */}
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                            <div>
                                <p className="text-sm font-medium text-warning mb-2">
                                    Meet your new companion
                                </p>

                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                    {name}
                                </h1>
                            </div>

                            <div>
                                <p className="text-xs text-base-content/50 mb-1">
                                    Adoption fee
                                </p>
                                <p className="text-3xl font-bold text-warning">
                                    ${price}
                                </p>
                            </div>
                        </div>

                        {/* Pet Information */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                            <div className="rounded-2xl bg-base-200/70 p-4">
                                <p className="text-xs text-base-content/50 mb-1">
                                    Category
                                </p>
                                <p className="font-semibold">
                                    {category}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-base-200/70 p-4">
                                <p className="text-xs text-base-content/50 mb-1">
                                    Age
                                </p>
                                <p className="font-semibold">
                                    {age}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-base-200/70 p-4">
                                <p className="text-xs text-base-content/50 mb-1">
                                    Gender
                                </p>
                                <p className="font-semibold">
                                    {gender}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-base-200/70 p-4">
                                <p className="text-xs text-base-content/50 mb-1">
                                    Health
                                </p>

                                <div className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500 text-xs" />
                                    <p className="font-semibold">
                                        Healthy
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-4 rounded-2xl border border-base-200 p-5">
                            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                                <FaMapMarkerAlt className="text-warning" />
                            </div>

                            <div>
                                <p className="text-xs text-base-content/50">
                                    Located in
                                </p>

                                <p className="font-semibold">
                                    {location}, Bangladesh
                                </p>
                            </div>
                        </div>

                        {/* About */}
                        <div className="rounded-[28px] bg-base-200/50 p-6 md:p-8">

                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-warning flex items-center justify-center">
                                    <FaPaw className="text-black text-sm" />
                                </div>

                                <div>
                                    <p className="text-xs text-base-content/50">
                                        Get to know
                                    </p>

                                    <h2 className="text-xl font-bold">
                                        About {name}
                                    </h2>
                                </div>
                            </div>

                            <p className="text-sm md:text-base text-base-content/65 leading-7">
                                {description ||
                                    `${name} is a lovely ${category?.toLowerCase() || "pet"} looking for a caring and loving family. ${name} enjoys spending time with people and is ready to become a wonderful part of your family.`}
                            </p>

                        </div>

                        {/* Adoption Message */}
                        <div className="relative overflow-hidden rounded-[28px] border border-warning/20 bg-warning/5 p-6 md:p-8">

                            <div className="relative z-10 max-w-2xl">

                                <div className="flex items-center gap-2 text-xs font-semibold text-warning uppercase tracking-wider mb-3">
                                    <FaHeart />
                                    A lifelong commitment
                                </div>

                                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                                    Give {name} a place to call home.
                                </h2>

                                <p className="text-sm text-base-content/60 leading-6">
                                    Adoption is more than bringing a pet home.
                                    It is about creating a safe, loving, and
                                    happy life together.
                                </p>

                            </div>

                            <FaPaw className="absolute -right-5 -bottom-8 text-[150px] text-warning/10 rotate-12" />

                        </div>

                    </div>

                    {/* ===== RIGHT SIDE ==== */}
                    <div className="lg:sticky lg:top-6">

                        {submitted ? (

                            /* ===== SUCCESS SECTION ===== */
                            <div className="rounded-[30px] border border-base-300 bg-base-200/80 p-4 md:p-6 text-center space-y-4">

                                {/* Success Icon */}
                                <div className="flex justify-center ">
                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                        <FaCheckCircle className="text-green-500 text-4xl" />
                                    </div>
                                </div>

                                <h2 className="text-md md:text-2xl font-bold">
                                    Request Sent Successfully
                                </h2>

                                <p className="text-base-content/70">
                                    Your adoption request has been sent to the owner.
                                    You'll get a response soon.
                                </p>

                            </div>

                        ) : (
                            <div className="overflow-hidden rounded-[30px] border border-base-200 bg-base-100 shadow-xl shadow-base-content/5">

                                {/* Form Header */}
                                <div className="bg-warning/10 px-6 md:px-7 py-6">

                                    <div className="flex items-center justify-between gap-4">

                                        <div>
                                            <p className="text-xs font-semibold text-warning uppercase tracking-wider mb-1">
                                                Make a difference
                                            </p>

                                            <h2 className="text-2xl font-bold">
                                                Adopt {name}
                                            </h2>
                                        </div>

                                        <div className="w-11 h-11 rounded-full bg-warning flex items-center justify-center">
                                            <FaHeart className="text-black" />
                                        </div>

                                    </div>

                                </div>

                                {/* Form */}
                                <form
                                    onSubmit={handleSubmit(handleAdoption)}
                                    className="p-6 md:p-7 space-y-4">

                                    {/* Pet Name */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Pet Name
                                        </label>

                                        <input
                                            type="text"
                                            value={name ?? ""}
                                            disabled
                                            className="input w-full rounded-xl border-base-200 bg-base-200 disabled:text-base-content/80"
                                        />
                                    </div>

                                    {/* User Name */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Your Name
                                        </label>

                                        <input
                                            type="text"
                                             value={user?.displayName ?? ""}
                                            disabled
                                            className="input w-full rounded-xl border-base-200 bg-base-200 disabled:text-base-content/80"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            value={user?.email ?? ""}
                                            disabled
                                            className="input w-full rounded-xl border-base-200 bg-base-200 disabled:text-base-content/80"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Phone Number
                                        </label>

                                        <input
                                            type="tel"
                                            placeholder="01XXXXXXXXX"
                                            {...register("phoneNumber", {
                                                required: "Phone number is required",
                                                pattern: {
                                                    value: /^01[3-9]\d{8}$/,
                                                    message: "Enter a valid Bangladeshi phone number",
                                                },
                                            })}
                                            className="input input-bordered w-full rounded-xl focus:outline-warning"
                                        />

                                        {errors.phoneNumber && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.phoneNumber.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Your Address
                                        </label>

                                        <textarea
                                            rows="3"
                                            placeholder="Where will your new friend live?"
                                            {...register("address", {
                                                required: "Address is required",
                                            })}
                                            className="textarea textarea-bordered w-full rounded-xl resize-none focus:outline-warning"
                                        ></textarea>

                                        {errors.address && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.address.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        className="group btn w-full h-12 min-h-12 rounded-full bg-warning text-black border-none font-semibold mt-2 hover:bg-warning/90 transition-all duration-300"
                                    >
                                        Send Adoption Request

                                        <FaHeart className="text-red-500 transition-transform duration-300 group-hover:scale-110" />
                                    </button>

                                    {/* Response */}
                                    <div className="flex items-center justify-center gap-2 pt-2 text-xs text-base-content/50">
                                        <FaCheckCircle className="text-green-500" />
                                        Usually responds within 24 hours
                                    </div>

                                </form>

                            </div>
                        )}



                    </div>

                </div>
            </main>
        </div>
    );
};

export default PetDetails;
