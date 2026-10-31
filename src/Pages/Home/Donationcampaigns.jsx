import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaPaw } from "react-icons/fa";
import { MdArrowRightAlt } from "react-icons/md";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import SectionTitle from "../../components/SectionTitle";
import DonationPetsCart from "../../components/DonationPetsCart";


const DonationCampaigns = () => {
    const axiosPublic = useAxiosPublic();

    const { data: campaigns = [], isLoading } = useQuery({
        queryKey: ["home-donation-pets"],
        queryFn: async () => {
            const res = await axiosPublic.get("/donationPets");
            return res.data;
        },
    });

    // Only active campaigns, newest first
    const activeCampaigns = campaigns
        .filter((campaign) => !campaign.paused)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const featuredCampaigns = activeCampaigns.slice(0, 3);

    // Real numbers from your data
    const totalRaised = campaigns.reduce(
        (sum, campaign) => sum + (campaign.donatedAmount || 0),
        0
    );

    return (
        <section className="my-16 md:my-24">
            <SectionTitle
                title={"Donation Campaigns"}
                heading={
                    "Every pet deserves care, food, and a safe place to heal. Support a campaign today and help a pet in need get back on their paws."
                }
            ></SectionTitle>

            <div className="relative overflow-hidden">

                <div className="relative">

                    {/* Stats  */}
                    {!isLoading && campaigns.length > 0 && (
                        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
                            <span className="badge badge-lg gap-2 border-warning/40 bg-base-100 py-4">
                                <FaPaw className="text-warning" />
                                {activeCampaigns.length} active campaigns
                            </span>
                            <span className="badge badge-lg gap-2 border-warning/40 bg-base-100 py-4 font-semibold">
                                ${totalRaised.toLocaleString()} raised so far
                            </span>

                        </div>
                    )}

                    {/* Loading skeletons */}
                    {isLoading && (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="flex flex-col gap-4">
                                    <div className="skeleton h-56 w-full rounded-2xl"></div>
                                    <div className="skeleton h-5 w-2/3"></div>
                                    <div className="skeleton h-4 w-full"></div>
                                    <div className="skeleton h-10 w-full rounded-xl"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Campaign cards */}
                    {!isLoading && featuredCampaigns.length > 0 && (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {featuredCampaigns.map((pet) => (
                                <DonationPetsCart key={pet._id} pet={pet}></DonationPetsCart>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!isLoading && featuredCampaigns.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-base-content/30 py-16 text-center">
                            <p className="text-lg font-semibold">No campaigns right now</p>
                            <p className="mt-1 text-sm text-base-content/70">
                                New campaigns are added regularly, please check back soon.
                            </p>
                        </div>
                    )}



                    <div className="mt-12 flex justify-center">

                        <Link
                            to="/donation-pets"
                            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-warning/10 font-semibold transition-all duration-300 hover:bg-warning hover:gap-3"
                        >
                            See all campaigns
                            <MdArrowRightAlt className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default DonationCampaigns;