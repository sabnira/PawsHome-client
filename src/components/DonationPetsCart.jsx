const DonationPetsCart = ({ pet }) => {

    const percentage = Math.min(
        Math.round(
            (pet.donatedAmount / pet.maximumDonation) * 100
        ),
        100
    );

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
                    src={pet.image}
                    alt={pet.petName}
                    className="w-full h-full object-cover
                               hover:scale-105 transition-transform
                               duration-500"
                />
            </div>

            {/* Content */}
            <div className="p-5">

                {/* Pet Name */}
                <h2 className="text-xl font-bold mb-4">
                    {pet.petName}
                </h2>

                {/* Amount */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                        Raised
                    </span>

                    <span className="font-semibold">
                        ${pet.donatedAmount?.toLocaleString()}

                        <span className="text-gray-400 font-normal">
                            {" "} / ${pet.maximumDonation?.toLocaleString()}
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
                        Goal ${pet.maximumDonation?.toLocaleString()}
                    </span>
                </div>

                {/* Button */}
                <button
                    className="btn btn-warning text-black w-full mt-5 rounded-xl"
                >
                    View Details
                </button>

            </div>
        </div>
    );
};

export default DonationPetsCart;