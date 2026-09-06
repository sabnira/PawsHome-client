import DonationPetsCart from "../../components/DonationPetsCart";
import Loading from "../../components/Loading";
import useDonationPets from "../../hooks/useDonationPets";

const DonationPets = () => {

    const [donationPets, loading] = useDonationPets();

    if (loading) {
        return <Loading></Loading>
    }

    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-10">
                    <p className="text-warning font-semibold uppercase tracking-wider text-sm">
                        Make a Difference
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold mt-2">
                        Donation Campaigns
                    </h1>

                    <p className="text-gray-500 max-w-2xl mx-auto mt-3">
                        Help pets get the care they need by supporting their
                        medical treatment, food, and other essential needs.
                    </p>
                </div>

                {/* Campaign Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
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