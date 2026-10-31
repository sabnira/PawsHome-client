import { Link } from "react-router-dom";

const DonationPetsCart = ({ pet }) => {

    const { _id, petName, image, donatedAmount = 0, maximumDonation = 0 } = pet;

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

    return (
        <div
            className="flex flex-col bg-base-100 rounded-2xl overflow-hidden
                       border border-base-200 shadow-sm
                       hover:shadow-xl transition-all duration-300
                       hover:-translate-y-1"
        >

            {/* Image */}
            <div className="h-32 sm:h-48 lg:h-56 overflow-hidden">
                <img
                    src={image}
                    alt={petName}
                    loading="lazy"
                    className="w-full h-full object-cover
                               hover:scale-105 transition-transform
                               duration-500"
                />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-3 sm:p-5">

                {/* Pet Name */}
                <h2 className="text-base sm:text-xl font-bold mb-2 sm:mb-4 truncate">
                    {petName}
                </h2>

                {/* Amount ("Raised" label hidden on mobile to save space) */}
                <div className="flex flex-wrap justify-between items-center gap-x-2 mb-2">
                    <span className="hidden sm:inline text-sm text-gray-500">
                        Raised
                    </span>

                    <span className="text-sm sm:text-base font-semibold">
                        ${donatedAmount?.toLocaleString()}

                        <span className="text-gray-400 font-normal text-xs sm:text-base">
                            {" "} / ${maximumDonation?.toLocaleString()}
                        </span>
                    </span>
                </div>

                {/* Progress */}
                <progress
                    className="progress progress-warning w-full"
                    value={percentage}
                    max="100"
                ></progress>

                {/* Percentage + Goal (Goal hidden on mobile, it's already shown above) */}
                <div className="flex justify-between mt-2 text-xs sm:text-sm">
                    <span className="text-gray-500">
                        {percentage}% funded
                    </span>

                    <span className="hidden sm:inline text-gray-500">
                        Goal ${maximumDonation?.toLocaleString()}
                    </span>
                </div>

                {/* Button (pinned to the bottom so cards line up) */}
                <div className="mt-auto pt-3 sm:pt-5">
                    <Link to={`/donation-details/${_id}`}
                        className="btn btn-warning btn-sm sm:btn-md text-black w-full rounded-xl text-xs sm:text-sm"
                    >
                        View Details
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default DonationPetsCart;