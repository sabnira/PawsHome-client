import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiEye, FiSearch } from "react-icons/fi";
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

const AllDonations = () => {
    const axiosSecure = useAxiosSecure();

    const [search, setSearch] = useState("");
    const [campaign, setCampaign] = useState("all");

    const {
        data: donations = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["all-donations"],
        queryFn: async () => {
            const res = await axiosSecure.get("/donations");
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
                    Could not load donations
                </h2>
                <p className="mt-2 break-words text-sm text-red-500">
                    {error.response?.data?.message || error.message}
                </p>
            </div>
        );
    }

    // Campaign options for the dropdown, keyed by campaign id
    const campaigns = [
        ...new Map(donations.map((d) => [d.campaignId, d.petName])).entries(),
    ].sort((a, b) => (a[1] || "").localeCompare(b[1] || ""));

    const query = search.trim().toLowerCase();
    const visibleDonations = donations.filter((d) => {
        const matchesCampaign = campaign === "all" || d.campaignId === campaign;
        const matchesSearch =
            !query ||
            d.petName?.toLowerCase().includes(query) ||
            d.donorEmail?.toLowerCase().includes(query) ||
            d.transactionId?.toLowerCase().includes(query);
        return matchesCampaign && matchesSearch;
    });

    const totalRaised = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const uniqueDonors = new Set(donations.map((d) => d.donorEmail).filter(Boolean)).size;
    const shownTotal = visibleDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const isFiltered = campaign !== "all" || query;

    const stats = [
        { label: "Total raised", value: formatMoney(totalRaised) },
        { label: "Donations", value: donations.length },
        { label: "Donors", value: uniqueDonors },
        { label: "Campaigns supported", value: campaigns.length },
    ];

    return (
        <div>
            <Helmet>
                <title>PawsHome | All Donations</title>
            </Helmet>

            {/* Header */}
            <div className="mb-5 sm:mb-6">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    All Donations
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Every donation made across all campaigns
                </p>
            </div>

            {donations.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white px-4 py-12 text-center sm:px-6 sm:py-16">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8E1] text-2xl text-[#D99A00]">
                        <FaHandHoldingHeart />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                        No donations yet
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                        Donations will appear here as soon as someone supports a campaign.
                    </p>
                </div>
            ) : (
                <>
                    {/* Summary */}
                    <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                        {stats.map(({ label, value }) => (
                            <div
                                key={label}
                                className="min-w-0 rounded-3xl border border-gray-100 bg-white p-4 sm:p-5"
                            >
                                <p className="text-xs text-gray-500 sm:text-sm">{label}</p>
                                <p className="mt-1 truncate text-xl font-bold text-gray-900 sm:text-2xl">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="mb-5 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
                        <label className="input input-bordered flex w-full items-center gap-2 rounded-xl md:w-80">
                            <FiSearch className="shrink-0 text-gray-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search pet, donor email or transaction"
                                aria-label="Search donations"
                                className="min-w-0 grow"
                            />
                        </label>

                        <select
                            value={campaign}
                            onChange={(e) => setCampaign(e.target.value)}
                            aria-label="Filter by campaign"
                            className="select select-bordered w-full rounded-xl md:w-56"
                        >
                            <option value="all">All campaigns</option>
                            {campaigns.map(([id, name]) => (
                                <option key={id} value={id}>
                                    {name}
                                </option>
                            ))}
                        </select>

                        {isFiltered && (
                            <p className="text-sm text-gray-500 md:ml-auto">
                                {visibleDonations.length}{" "}
                                {visibleDonations.length === 1 ? "donation" : "donations"},{" "}
                                <span className="font-semibold text-gray-900">
                                    {formatMoney(shownTotal)}
                                </span>
                            </p>
                        )}
                    </div>

                    {visibleDonations.length === 0 ? (
                        <div className="rounded-3xl border border-gray-100 bg-white px-4 py-10 text-center sm:px-6 sm:py-14">
                            <h2 className="text-lg font-semibold text-gray-900">
                                No matching donations
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Try a different search or campaign.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile: cards */}
                            <ul className="space-y-3 md:hidden">
                                {visibleDonations.map((donation) => (
                                    <li
                                        key={donation._id}
                                        className="rounded-3xl border border-gray-100 bg-white p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-gray-900">
                                                    {donation.petName}
                                                </p>
                                                <p className="truncate text-xs text-gray-500">
                                                    {donation.donorEmail || "Unknown donor"}
                                                </p>
                                            </div>
                                            <p className="shrink-0 text-lg font-bold text-gray-900">
                                                {formatMoney(donation.amount)}
                                            </p>
                                        </div>

                                        <p className="mt-2 text-xs text-gray-500">
                                            {formatDate(donation.donatedAt)}
                                        </p>

                                        <code className="mt-2 block break-all rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-600">
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
                                                <th>Campaign</th>
                                                <th className="hidden xl:table-cell">Donor</th>
                                                <th>Amount</th>
                                                <th className="hidden xl:table-cell">Date</th>
                                                <th>Transaction ID</th>
                                                <th className="text-right">View</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {visibleDonations.map((donation, index) => (
                                                <tr
                                                    key={donation._id}
                                                    className="border-b border-gray-50 last:border-0"
                                                >
                                                    <td className="hidden text-gray-400 xl:table-cell">
                                                        {index + 1}
                                                    </td>

                                                    <td>
                                                        <p className="font-semibold text-gray-900">
                                                            {donation.petName}
                                                        </p>
                                                        <p className="break-all text-xs text-gray-500 xl:hidden">
                                                            {donation.donorEmail || "Unknown donor"}
                                                            {" · "}
                                                            {formatDate(donation.donatedAt)}
                                                        </p>
                                                    </td>

                                                    <td className="hidden text-sm text-gray-700 xl:table-cell">
                                                        {donation.donorEmail || "—"}
                                                    </td>

                                                    <td className="font-semibold text-gray-900">
                                                        {formatMoney(donation.amount)}
                                                    </td>

                                                    <td className="hidden text-gray-700 xl:table-cell">
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
                </>
            )}
        </div>
    );
};

export default AllDonations;