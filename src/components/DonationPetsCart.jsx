import { Link } from "react-router-dom";

const DonationPetsCart = ({ pet }) => {

    const { _id, petName, image, donatedAmount = 0, maximumDonation = 0} = pet;

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
            className="bg-base-100 rounded-2xl overflow-hidden
                       border border-base-200 shadow-sm
                       hover:shadow-xl transition-all duration-300
                       hover:-translate-y-1"
        >

            {/* Image */}
            <div className="h-56 overflow-hidden">
                <img
                    src={image}
                    alt={petName}
                    className="w-full h-full object-cover
                               hover:scale-105 transition-transform
                               duration-500"
                />
            </div>

            {/* Content */}
            <div className="p-5">

                {/* Pet Name */}
                <h2 className="text-xl font-bold mb-4">
                    {petName}
                </h2>

                {/* Amount */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                        Raised
                    </span>

                    <span className="font-semibold">
                        ${donatedAmount?.toLocaleString()}

                        <span className="text-gray-400 font-normal">
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

                {/* Percentage + Goal */}
                <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-500">
                        {percentage}% funded
                    </span>

                    <span className="text-gray-500">
                        Goal ${maximumDonation?.toLocaleString()}
                    </span>
                </div>

                {/* Button */}
                <Link to={`/donation-details/${_id}`}
                    className="btn btn-warning text-black w-full mt-5 rounded-xl"
                >
                    View Details
                </Link>

            </div>
        </div>
    );
};

export default DonationPetsCart;