import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiEye } from "react-icons/fi";
import { FaHandHoldingHeart } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";

const formatDate = (date) =>
    date
        ? new Date(date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "—";

const formatMoney = (amount = 0) =>
    `$${Number(amount).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;

const MyDonation = () => {
    const axiosSecure = useAxiosSecure();

    const { data: donations = [], isLoading } = useQuery({
        queryKey: ["my-donations"],
        queryFn: async () => {
            const res = await axiosSecure.get("/my-donations");
            return res.data;
        },
    });

    if (isLoading) {
        return <Loading />;
    }

    const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const petsSupported = new Set(donations.map((d) => d.campaignId)).size;

    return (
        <div>
            <Helmet>
                <title>PawsHome | My Donations</title>
            </Helmet>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    My Donations
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Every donation you've made through PawsHome
                </p>
            </div>

            {donations.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8E1] text-2xl text-[#D99A00]">
                        <FaHandHoldingHeart />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        You haven't donated yet
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                        Browse the active campaigns and help a pet get the care it needs.
                    </p>
                    <Link
                        to="/donation-pets"
                        className="btn btn-warning mt-6 rounded-xl text-black"
                    >
                        Browse campaigns
                    </Link>
                </div>
            ) : (
                <>
                    {/* Summary */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl border border-gray-100 bg-white p-5">
                            <p className="text-sm text-gray-500">Total donated</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                {formatMoney(totalDonated)}
                            </p>
                        </div>
                        <div className="rounded-3xl border border-gray-100 bg-white p-5">
                            <p className="text-sm text-gray-500">Donations made</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                {donations.length}
                            </p>
                        </div>
                        <div className="rounded-3xl border border-gray-100 bg-white p-5">
                            <p className="text-sm text-gray-500">Pets supported</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                {petsSupported}
                            </p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs text-gray-500">
                                        <th className="w-12">#</th>
                                        <th>Pet</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Transaction ID</th>
                                        <th className="text-right">Campaign</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {donations.map((donation, index) => (
                                        <tr
                                            key={donation._id}
                                            className="border-b border-gray-50 last:border-0"
                                        >
                                            <td className="text-gray-400">{index + 1}</td>

                                            <td className="font-semibold text-gray-900">
                                                {donation.petName}
                                            </td>

                                            <td className="font-semibold text-gray-900">
                                                {formatMoney(donation.amount)}
                                            </td>

                                            <td className="text-gray-700">
                                                {formatDate(donation.donatedAt)}
                                            </td>

                                            <td>
                                                <code className="rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-600">
                                                    {donation.transactionId}
                                                </code>
                                            </td>

                                            <td>
                                                <div className="flex justify-end">
                                                    <Link
                                                        to={`/donation-details/${donation.campaignId}`}
                                                        title="View campaign"
                                                        aria-label={`View ${donation.petName} campaign`}
                                                        className="btn btn-sm btn-ghost btn-square text-gray-600"
                                                    >
                                                        <FiEye className="text-lg" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MyDonation;