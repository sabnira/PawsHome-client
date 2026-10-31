import DonationPetsCart from "../../components/DonationPetsCart";
import Loading from "../../components/Loading";
import useDonationPets from "../../hooks/useDonationPets";

const DonationPets = () => {

    const [donationPets, loading] = useDonationPets();

    if (loading) {
        return <Loading></Loading>
    }

    return (
        <section className="py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-8 md:mb-10">
                    <p className="text-warning font-semibold uppercase tracking-wider text-xs sm:text-sm">
                        Make a Difference
                    </p>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
                        Donation Campaigns
                    </h1>

                    <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-3">
                        Help pets get the care they need by supporting their
                        medical treatment, food, and other essential needs.
                    </p>
                </div>

                {/* Campaign Grid: 2 columns on mobile and tablet, 3 on desktop */}
                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-7">
                    {donationPets.map(pet => (
                        <DonationPetsCart
                            key={pet._id}
                            pet={pet}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default DonationPets;