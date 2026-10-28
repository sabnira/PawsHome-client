import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiEye } from "react-icons/fi";
import { FaHandHoldingHeart } from "react-icons/fa";

import Loading from "../../components/Loading";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";

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
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: donations = [], isLoading, isError, error } = useQuery({
        queryKey: ["my-donations", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get("/my-donations");
            return res.data;
        },
    });

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return (
            <div className="rounded-3xl border border-red-100 bg-red-50 px-4 py-8 text-center sm:px-6 sm:py-10">
                <h2 className="text-lg font-semibold text-red-600">
                    Could not load your donations
                </h2>
                <p className="mt-2 break-words text-sm text-red-500">
                    {error.response?.data?.message || error.message}
                </p>
            </div>
        );
    }

    const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const petsSupported = new Set(donations.map((d) => d.campaignId)).size;

    const stats = [
        // Total donated spans the full row on phones so the three cards fit
        { label: "Total donated", value: formatMoney(totalDonated), wide: true },
        { label: "Donations made", value: donations.length },
        { label: "Pets supported", value: petsSupported },
    ];

    return (
        <div>
            <Helmet>
                <title>PawsHome | My Donations</title>
            </Helmet>

            {/* Header */}
            <div className="mb-5 sm:mb-6">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    My Donations
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Every donation you've made through PawsHome
                </p>
            </div>

            {donations.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white px-4 py-12 text-center sm:px-6 sm:py-16">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8E1] text-2xl text-[#D99A00]">
                        <FaHandHoldingHeart />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
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
                    <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:grid-cols-3 sm:gap-4">
                        {stats.map(({ label, value, wide }) => (
                            <div
                                key={label}
                                className={`min-w-0 rounded-3xl border border-gray-100 bg-white p-4 sm:col-span-1 sm:p-5 ${
                                    wide ? "col-span-2" : ""
                                }`}
                            >
                                <p className="text-xs text-gray-500 sm:text-sm">{label}</p>
                                <p className="mt-1 truncate text-2xl font-bold text-gray-900">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Mobile: cards */}
                    <ul className="space-y-3 md:hidden">
                        {donations.map((donation) => (
                            <li
                                key={donation._id}
                                className="rounded-3xl border border-gray-100 bg-white p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-gray-900">
                                            {donation.petName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(donation.donatedAt)}
                                        </p>
                                    </div>
                                    <p className="shrink-0 text-lg font-bold text-gray-900">
                                        {formatMoney(donation.amount)}
                                    </p>
                                </div>

                                <code className="mt-3 block break-all rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-600">
                                    {donation.transactionId}
                                </code>

                                <div className="mt-3 border-t border-gray-50 pt-3">
                                    <Link
                                        to={`/donation-details/${donation.campaignId}`}
                                        aria-label={`View ${donation.petName} campaign`}
                                        className="btn btn-sm btn-ghost w-full text-gray-600"
                                    >
                                        <FiEye className="text-lg" />
                                        View campaign
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Tablet and up: table */}
                    <div className="hidden overflow-hidden rounded-3xl border border-gray-100 bg-white md:block">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs text-gray-500">
                                        <th className="hidden w-12 xl:table-cell">#</th>
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
                                            <td className="hidden text-gray-400 xl:table-cell">
                                                {index + 1}
                                            </td>

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