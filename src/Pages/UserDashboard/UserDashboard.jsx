import { useContext } from "react";
import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiPlusCircle, FiHeart, FiDollarSign, FiList, FiArrowRight, FiSearch } from "react-icons/fi";
import { FaPaw, FaHandHoldingHeart } from "react-icons/fa";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";

const statusBadge = {
    pending: "badge badge-warning badge-soft",
    accepted: "badge badge-success badge-soft",
    rejected: "badge badge-error badge-soft",
};

const formatDate = (date) =>
    date
        ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
        : "—";

const formatMoney = (amount = 0) => `$${Number(amount).toLocaleString()}`;

const getPercentage = (donated = 0, goal = 0) =>
    goal > 0 ? Math.min(Math.round((donated / goal) * 100), 100) : 0;

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const email = user?.email;

    // Same query keys as the individual pages, so data is shared through the cache
    const results = useQueries({
        queries: [
            {
                queryKey: ["my-pets", email],
                enabled: !!email,
                queryFn: async () => (await axiosSecure.get(`/my-pets?email=${email}`)).data,
            },
            {
                queryKey: ["adoption-requests", email],
                enabled: !!email,
                queryFn: async () =>
                    (await axiosSecure.get(`/my-adoption-requests?email=${email}`)).data,
            },
            {
                queryKey: ["my-campaigns"],
                enabled: !!email,
                queryFn: async () => (await axiosSecure.get("/my-campaigns")).data,
            },
            {
                queryKey: ["my-donations", email],
                enabled: !!email,
                queryFn: async () => (await axiosSecure.get("/my-donations")).data,
            },
        ],
    });

    const [petsQuery, requestsQuery, campaignsQuery, donationsQuery] = results;

    if (results.some((r) => r.isLoading)) {
        return <Loading />;
    }

    const pets = petsQuery.data || [];
    const requests = requestsQuery.data || [];
    const campaigns = campaignsQuery.data || [];
    const donations = donationsQuery.data || [];

    const firstName = (user?.displayName || "there").split(" ")[0];
    const availablePets = pets.filter((p) => !p.adopted).length;
    const pendingRequests = requests.filter((r) => (r.status || "pending") === "pending").length;
    const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

    const today = new Date(new Date().toDateString());
    const activeCampaigns = campaigns.filter(
        (c) =>
            !c.paused &&
            getPercentage(c.donatedAmount, c.maximumDonation) < 100 &&
            (!c.lastDate || new Date(c.lastDate) >= today)
    );

    const recentRequests = requests.slice(0, 5);

    const stats = [
        {
            label: "Pets available",
            value: availablePets,
            note: `${pets.length} listed in total`,
            icon: FaPaw,
            to: "/dashboard/my-pets",
        },
        {
            label: "Pending requests",
            value: pendingRequests,
            note: `${requests.length} received in total`,
            icon: FiHeart,
            to: "/dashboard/adoption-requests",
        },
        {
            label: "Active campaigns",
            value: activeCampaigns.length,
            note: `${campaigns.length} created in total`,
            icon: FaHandHoldingHeart,
            to: "/dashboard/my-campaigns",
        },
        {
            label: "Total donated",
            value: formatMoney(totalDonated),
            note: `${donations.length} ${donations.length === 1 ? "donation" : "donations"}`,
            icon: FiDollarSign,
            to: "/dashboard/my-donations",
        },
    ];

    const quickActions = [
        { label: "Add a pet", to: "/dashboard/add-pet", icon: FiPlusCircle },
        { label: "Create a campaign", to: "/dashboard/create-campaign", icon: FiDollarSign },
        { label: "Browse pets", to: "/pet-listing", icon: FiSearch },
        { label: "My pets", to: "/dashboard/my-pets", icon: FiList },
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            <Helmet>
                <title>PawsHome | Dashboard</title>
            </Helmet>

            {/* Welcome */}
            <section className="relative overflow-hidden rounded-3xl bg-[#F7C948] p-5 sm:p-8">
                <FaPaw
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-6 -top-6 text-[10rem] text-black/10 sm:text-[13rem]"
                />

                <div className="relative max-w-xl">
                    <h1 className="break-words text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
                        Hi {firstName}, welcome back
                    </h1>
                    <p className="mt-2 text-sm text-gray-800 sm:text-base">
                        {pendingRequests > 0
                            ? `${pendingRequests} adoption ${
                                  pendingRequests === 1 ? "request is" : "requests are"
                              } waiting for your reply.`
                            : "No adoption requests are waiting. Everything is up to date."}
                    </p>

                    <Link
                        to={
                            pendingRequests > 0
                                ? "/dashboard/adoption-requests"
                                : "/dashboard/add-pet"
                        }
                        className="btn mt-5 w-full rounded-xl border-none bg-gray-900 text-white hover:bg-gray-800 sm:w-auto"
                    >
                        {pendingRequests > 0 ? "Review requests" : "Add a pet"}
                        <FiArrowRight />
                    </Link>
                </div>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ label, value, note, icon: Icon, to }) => (
                    <Link
                        key={label}
                        to={to}
                        className="group min-w-0 rounded-3xl border border-gray-100 bg-white p-4 transition hover:border-[#F7C948] sm:p-5"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="text-xs text-gray-500 sm:text-sm">{label}</p>
                                <p className="mt-1.5 truncate text-2xl font-bold text-gray-900 sm:mt-2 sm:text-3xl">
                                    {value}
                                </p>
                            </div>
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#FFF8E1] text-base text-[#D99A00] sm:h-11 sm:w-11 sm:text-lg">
                                <Icon />
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-400 sm:mt-3">{note}</p>
                    </Link>
                ))}
            </section>

            {/* Recent requests + campaigns */}
            <section className="grid gap-4 sm:gap-6 xl:grid-cols-5">
                {/* Recent adoption requests */}
                <div className="min-w-0 rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 xl:col-span-3">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Recent adoption requests
                        </h2>
                        <Link
                            to="/dashboard/adoption-requests"
                            className="shrink-0 text-sm font-medium text-[#D99A00] hover:underline"
                        >
                            View all
                        </Link>
                    </div>

                    {recentRequests.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-500">
                            Requests for your pets will show up here.
                        </p>
                    ) : (
                        <ul className="divide-y divide-gray-50">
                            {recentRequests.map((request) => {
                                const status = request.status || "pending";
                                return (
                                    <li
                                        key={request._id}
                                        className="flex items-center justify-between gap-3 py-3"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            {request.petImage ? (
                                                <div className="avatar">
                                                    <div className="h-11 w-11 rounded-2xl">
                                                        <img
                                                            src={request.petImage}
                                                            alt={request.petName}
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF8E1] text-[#D99A00]">
                                                    <FaPaw />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="break-words text-sm font-semibold text-gray-900 sm:truncate">
                                                    {request.name || request.userName || "Someone"}{" "}
                                                    <span className="font-normal text-gray-500">
                                                        wants to adopt
                                                    </span>{" "}
                                                    {request.petName || "a pet"}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {formatDate(request.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`${statusBadge[status]} shrink-0`}>{status}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Campaign progress */}
                <div className="min-w-0 rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 xl:col-span-2">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Campaign progress
                        </h2>
                        <Link
                            to="/dashboard/my-campaigns"
                            className="shrink-0 text-sm font-medium text-[#D99A00] hover:underline"
                        >
                            Manage
                        </Link>
                    </div>

                    {activeCampaigns.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-sm text-gray-500">No active campaigns.</p>
                            <Link
                                to="/dashboard/create-campaign"
                                className="btn btn-warning btn-sm mt-4 rounded-xl text-black"
                            >
                                Create campaign
                            </Link>
                        </div>
                    ) : (
                        <ul className="space-y-5">
                            {activeCampaigns.slice(0, 3).map((campaign) => {
                                const percentage = getPercentage(
                                    campaign.donatedAmount,
                                    campaign.maximumDonation
                                );
                                return (
                                    <li key={campaign._id}>
                                        <div className="mb-1 flex items-center justify-between text-sm">
                                            <span className="font-semibold text-gray-900">
                                                {campaign.petName}
                                            </span>
                                            <span className="text-gray-500">{percentage}%</span>
                                        </div>
                                        <progress
                                            className="progress progress-warning w-full"
                                            value={percentage}
                                            max="100"
                                        ></progress>
                                        <p className="mt-1 text-xs text-gray-400">
                                            {formatMoney(campaign.donatedAmount || 0)} of{" "}
                                            {formatMoney(campaign.maximumDonation)}
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </section>

            {/* Quick actions */}
            <section className="rounded-3xl border border-gray-100 bg-white p-4 sm:p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick actions</h2>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                    {quickActions.map(({ label, to, icon: Icon }) => (
                        <Link
                            key={label}
                            to={to}
                            className="flex min-w-0 items-center gap-2.5 rounded-2xl bg-[#FAFAFB] px-3 py-3 text-sm sm:gap-3 sm:px-4 font-medium text-gray-700 transition hover:bg-[#FFF8E1] hover:text-gray-900"
                        >
                            <Icon className="shrink-0 text-lg text-[#D99A00]" />
                            {label}
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default UserDashboard;