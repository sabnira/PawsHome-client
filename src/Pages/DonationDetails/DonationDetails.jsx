import { Link, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import useDonationPet from "../../hooks/useDonationPet";
import { FaHeart } from "react-icons/fa6";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import DonationModal from "../../components/DonationModal";


const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);


const DonationDetails = () => {

    const { id } = useParams();

    const [donationPet, loading] = useDonationPet(id);

    const [showModal, setShowModal] = useState(false);

    if (loading) {
        return <Loading />;
    }

    const { petName, image, donatedAmount = 0, maximumDonation = 0, category, age, location, reason, description } = donationPet;

    // Calculate donation progress
    const percentage =
        maximumDonation > 0
            ? Math.min(
                Math.round(
                    (donatedAmount / maximumDonation) * 100
                ),
                100
            )
            : 0;


    // Remaining amount
    const remainingAmount = Math.max(
        maximumDonation - donatedAmount,
        0
    );

    // Campaign status
    const isCompleted = donatedAmount >= maximumDonation;

    return (
        <div className="min-h-screen bg-base-200/40 py-8 md:py-12">
            <div className="max-w-6xl mx-auto px-4">

                {/* Breadcrumb */}
                <div className="breadcrumbs text-sm mb-7 text-base-content/50">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/donation-pets">Donation Campaign</Link></li>
                        <li className="text-base-content font-medium">{petName}</li>
                    </ul>
                </div>


                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">

                    {/* LEFT SIDE */}
                    <div className="space-y-6">

                        {/* Image */}
                        <div className="bg-base-100 rounded-3xl overflow-hidden border border-base-200 shadow-sm">

                            <div className="relative">

                                <img
                                    src={image}
                                    alt={petName}
                                    className="w-full h-100 md:h-125 object-cover"
                                />

                                {/* Category */}
                                <div className="absolute top-5 left-5">
                                    <span className="badge badge-warning px-4 py-3 font-semibold shadow-lg">
                                        {category}
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="absolute top-5 right-5">
                                    <span
                                        className={`badge px-4 py-3 font-semibold shadow-lg ${isCompleted
                                            ? "badge-success"
                                            : "badge-neutral"
                                            }`}
                                    >
                                        {isCompleted
                                            ? "Completed"
                                            : "Active"}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* About Campaign */}
                        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-base-200 shadow-sm">

                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center text-xl text-red-400">
                                    <FaHeart />
                                </div>

                                <h2 className="text-2xl font-bold">
                                    About This Campaign
                                </h2>
                            </div>

                            <p className="text-base-content/65 leading-7">
                                {description}
                            </p>

                            <p className="text-base-content/65 leading-7 mt-4">
                                Your support can help provide the care,
                                treatment, food, and other essential needs
                                required by {petName}. Every contribution,
                                no matter the amount, brings this campaign
                                closer to its goal.
                            </p>

                        </div>

                        {/* Why Help */}
                        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-base-200 shadow-sm">

                            <h2 className="text-2xl font-bold mb-5">
                                Why Does {petName} Need Help?
                            </h2>

                            <div className="p-5 rounded-2xl bg-warning/10 border border-warning/20">

                                <p className="text-sm text-base-content/50 mb-1">
                                    Purpose of Donation
                                </p>

                                <p className="text-xl font-extrabold">
                                    {reason}
                                </p>

                            </div>

                            <p className="mt-5 text-base-content/65 leading-7">
                                Donations collected through this campaign
                                will help support {petName}'s{" "}
                                {reason?.toLowerCase()}. Your generosity can
                                make a direct difference in providing the
                                necessary care and improving their quality
                                of life.
                            </p>

                        </div>

                        {/* Pet Information */}
                        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-base-200 shadow-sm">

                            <h2 className="text-2xl font-bold mb-6">
                                Pet Information
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-4">

                                {/* Pet Name */}
                                <div className="rounded-2xl bg-base-200/50 p-5">
                                    <p className="text-sm text-base-content/50">
                                        Pet Name
                                    </p>

                                    <p className="font-bold text-lg mt-1">
                                        {petName}
                                    </p>
                                </div>

                                {/* Category */}
                                <div className="rounded-2xl bg-base-200/50 p-5">
                                    <p className="text-sm text-base-content/50">
                                        Category
                                    </p>

                                    <p className="font-bold text-lg mt-1">
                                        {category}
                                    </p>
                                </div>

                                {/* Age */}
                                <div className="rounded-2xl bg-base-200/50 p-5">
                                    <p className="text-sm text-base-content/50">
                                        Age
                                    </p>

                                    <p className="font-bold text-lg mt-1">
                                        {age}
                                    </p>
                                </div>

                                {/* Location */}
                                <div className="rounded-2xl bg-base-200/50 p-5">
                                    <p className="text-sm text-base-content/50">
                                        Location
                                    </p>

                                    <p className="font-bold text-lg mt-1">
                                        {location}
                                    </p>
                                </div>



                            </div>
                        </div>

                    </div>


                    {/* RIGHT SIDE */}
                    <div className="lg:sticky lg:top-6">

                        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-base-200 shadow-lg">

                            {/* Status */}
                            <div className="flex items-center gap-2 mb-5">

                                <span
                                    className={`w-2.5 h-2.5 rounded-full ${isCompleted
                                        ? "bg-success"
                                        : "bg-warning"
                                        }`}
                                ></span>

                                <span
                                    className={`text-sm font-semibold ${isCompleted
                                        ? "text-success"
                                        : "text-warning"
                                        }`}
                                >
                                    {isCompleted
                                        ? "Donation Goal Completed"
                                        : "Active Donation Campaign"}
                                </span>

                            </div>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                                Help {petName}
                            </h1>

                            <p className="text-base-content/60 mt-3 leading-6">
                                Support {petName}'s{" "}
                                <span className="font-semibold text-base-content">
                                    {reason?.toLowerCase()}
                                </span>{" "}
                                and help provide the care they need.
                            </p>

                            {/* Donation Progress */}
                            <div className="mt-8">

                                <div className="flex justify-between items-end mb-3">

                                    <div>
                                        <p className="text-sm text-base-content/50">
                                            Raised
                                        </p>

                                        <p className="text-3xl font-extrabold mt-1">
                                            ${donatedAmount.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-base-content/50">
                                            Goal
                                        </p>

                                        <p className="font-bold text-lg">
                                            ${maximumDonation.toLocaleString()}
                                        </p>
                                    </div>

                                </div>

                                {/* Progress Bar */}
                                <progress
                                    className={`progress w-full h-3 ${isCompleted
                                        ? "progress-success"
                                        : "progress-warning"
                                        }`}
                                    value={percentage}
                                    max="100"
                                ></progress>

                                <div className="flex justify-between mt-3 text-sm">

                                    <span
                                        className={`font-bold ${isCompleted
                                            ? "text-success"
                                            : "text-warning"
                                            }`}
                                    >
                                        {percentage}% funded
                                    </span>

                                    <span className="text-base-content/50">
                                        ${remainingAmount.toLocaleString()}{" "}
                                        remaining
                                    </span>

                                </div>

                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mt-7">

                                <div className="rounded-2xl bg-base-200/60 p-4">
                                    <p className="text-xs text-base-content/50">
                                        Raised
                                    </p>

                                    <p className="font-bold text-xl mt-1">
                                        ${donatedAmount.toLocaleString()}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-base-200/60 p-4">
                                    <p className="text-xs text-base-content/50">
                                        Goal
                                    </p>

                                    <p className="font-bold text-xl mt-1">
                                        ${maximumDonation.toLocaleString()}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-base-200/60 p-4">
                                    <p className="text-xs text-base-content/50">
                                        Remaining
                                    </p>

                                    <p className="font-bold text-xl mt-1">
                                        ${remainingAmount.toLocaleString()}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-base-200/60 p-4">
                                    <p className="text-xs text-base-content/50">
                                        Status
                                    </p>

                                    <p
                                        className={`font-bold text-xl mt-1 ${isCompleted
                                            ? "text-success"
                                            : "text-warning"
                                            }`}
                                    >
                                        {isCompleted
                                            ? "Completed"
                                            : "Active"}
                                    </p>
                                </div>

                            </div>



                            {/* Donate Button */}
                            {isCompleted ? (
                                <div className="alert alert-success mt-7 rounded-2xl">
                                    <span>
                                        🎉 This campaign has reached its
                                        donation goal!
                                    </span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="btn btn-warning w-full mt-7 rounded-2xl h-14 text-base font-bold shadow-md hover:shadow-lg transition-all"
                                >
                                    Donate Now
                                </button>
                            )}

                            {/* Bottom Message */}
                            <div className="flex justify-center items-center gap-2  text-xs text-base-content/45 mt-4">
                                <FaHeart className="text-red-400" />
                                <p>
                                    Every contribution helps make a difference.
                                </p>
                            </div>


                        </div>
                    </div>

                </div>
            </div>

            {showModal && (
                <Elements stripe={stripePromise}>
                    <DonationModal
                        donationPet={donationPet}
                        onClose={() => setShowModal(false)}
                    />
                </Elements>
            )}

        </div>


    );
};

export default DonationDetails;
