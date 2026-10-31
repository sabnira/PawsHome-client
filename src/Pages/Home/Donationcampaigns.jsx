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

    // 4 campaigns: 2 rows of 2 on mobile and tablet. The 4th is hidden on desktop (3 columns)
    const featuredCampaigns = activeCampaigns.slice(0, 4);

    // Real numbers from your data
    const totalRaised = campaigns.reduce(
        (sum, campaign) => sum + (campaign.donatedAmount || 0),
        0
    );

    return (
        <section className="my-16 md:my-24">
            <SectionTitle title={"Donation Campaigns"}></SectionTitle>

            <div className="relative">

                {/* Stats */}
                {!isLoading && campaigns.length > 0 && (
                    <div className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:mb-10 sm:gap-3">
                        <span className="badge gap-2 border-warning/40 bg-base-100 py-4 text-xs sm:badge-lg sm:text-sm">
                            <FaPaw className="text-warning" />
                            {activeCampaigns.length} active campaigns
                        </span>
                        <span className="badge gap-2 border-warning/40 bg-base-100 py-4 text-xs font-semibold sm:badge-lg sm:text-sm">
                            ${totalRaised.toLocaleString()} raised so far
                        </span>
                    </div>
                )}

                {/* Loading skeletons */}
                {isLoading && (
                    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                        {[1, 2, 3, 4].map((n) => (
                            <div
                                key={n}
                                className={`flex flex-col gap-3 sm:gap-4 ${n === 4 ? "lg:hidden" : ""}`}
                            >
                                <div className="skeleton h-32 w-full rounded-2xl sm:h-48 lg:h-56"></div>
                                <div className="skeleton h-4 w-2/3 sm:h-5"></div>
                                <div className="skeleton h-3 w-full sm:h-4"></div>
                                <div className="skeleton h-8 w-full rounded-xl sm:h-10"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Campaign cards: 2 columns on mobile and tablet, 3 on desktop */}
                {!isLoading && featuredCampaigns.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                        {featuredCampaigns.map((pet, index) => (
                            <div
                                key={pet._id}
                                className={index === 3 ? "contents lg:hidden" : "contents"}
                            >
                                <DonationPetsCart pet={pet}></DonationPetsCart>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && featuredCampaigns.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-base-content/30 px-4 py-12 text-center sm:py-16">
                        <p className="text-lg font-semibold">No campaigns right now</p>
                        <p className="mt-1 text-sm text-base-content/70">
                            New campaigns are added regularly, please check back soon.
                        </p>
                    </div>
                )}

                <div className="mt-8 flex justify-center md:mt-12">

                    <Link
                        to="/donation-pets"
                        className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-warning/10 font-semibold transition-all duration-300 hover:bg-warning hover:gap-3"
                    >
                        See all campaigns
                        <MdArrowRightAlt className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>

                </div>

            </div>
        </section>
    );
};

export default DonationCampaigns;