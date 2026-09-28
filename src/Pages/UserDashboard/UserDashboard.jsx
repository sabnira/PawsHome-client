import {
    FiHeart,
    FiPlus,
    FiDollarSign,
    FiUsers,
    FiArrowRight,
    FiCheckCircle,
    FiClock,
    FiHome,
    FiTarget,
    FiAlertCircle,
} from "react-icons/fi";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";

const UserDashboard = () => {
    const { user } = useContext(AuthContext);

    // --------------------------------------------------
    // Demo data
    // Replace these with your real API/query data later
    // --------------------------------------------------

    const donationData = [
        { month: "Apr", amount: 40 },
        { month: "May", amount: 85 },
        { month: "Jun", amount: 60 },
        { month: "Jul", amount: 120 },
        { month: "Aug", amount: 95 },
        { month: "Sep", amount: 150 },
    ];

    const recentRequests = [
        {
            id: 1,
            petName: "Max",
            petImage:
                "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200",
            requester: "Ayesha Rahman",
            date: "Sep 15, 2026",
            status: "Pending",
        },
        {
            id: 2,
            petName: "Luna",
            petImage:
                "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200",
            requester: "Nusrat Jahan",
            date: "Sep 13, 2026",
            status: "Approved",
        },
        {
            id: 3,
            petName: "Coco",
            petImage:
                "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200",
            requester: "Sakib Hasan",
            date: "Sep 10, 2026",
            status: "Rejected",
        },
    ];

    const campaigns = [
        {
            id: 1,
            petName: "Bruno",
            image:
                "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300",
            raised: 650,
            goal: 1000,
        },
        {
            id: 2,
            petName: "Milo",
            image:
                "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=300",
            raised: 380,
            goal: 500,
        },
    ];

   

    const totalDonations = donationData.reduce(
        (total, item) => total + item.amount,
        0
    );

    const activeCampaigns = campaigns.length;

    const totalRaised = campaigns.reduce(
        (total, campaign) => total + campaign.raised,
        0
    );

    return (
        <div className="space-y-6">

            {/* =====================================================
                WELCOME SECTION
            ====================================================== */}
            <section className="rounded-3xl bg-white border border-base-200 p-5 md:p-7">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    {/* Welcome */}
                    <div className="flex items-center gap-4">

                        <div className="avatar">
                            <div className="w-16 rounded-2xl ring-1 ring-base-200">
                                {user?.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user?.displayName || "User"}
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[#FFF8E1] text-2xl">
                                        🐾
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-base-content/50">
                                Welcome back
                            </p>

                            <h1 className="text-2xl md:text-3xl font-bold">
                                {user?.displayName || "Pet Lover"} 👋
                            </h1>

                            <p className="mt-1 text-sm text-base-content/60">
                                Here’s what's happening with your PawsHome
                                activities.
                            </p>
                        </div>

                    </div>


                    {/* Quick action */}
                    <Link
                        to="/dashboard/add-pet"
                        className="btn bg-[#F7C948] border-none text-gray-900 hover:bg-[#e9b92e] rounded-xl"
                    >
                        <FiPlus />
                        Add a Pet
                    </Link>

                </div>

            </section>


            {/* =====================================================
                STATISTICS
            ====================================================== */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {/* My Pets */}
                <div className="card bg-white border border-base-200">
                    <div className="card-body p-5">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm text-base-content/50">
                                    My Added Pets
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    12
                                </h2>

                                <p className="mt-1 text-xs text-success flex items-center gap-1">
                                    <FiArrowRight />
                                    3 adopted
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                <FiHeart className="text-xl" />
                            </div>

                        </div>

                    </div>
                </div>


                {/* Requests */}
                <div className="card bg-white border border-base-200">
                    <div className="card-body p-5">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm text-base-content/50">
                                    Adoption Requests
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    8
                                </h2>

                                <p className="mt-1 text-xs text-warning flex items-center gap-1">
                                    <FiClock />
                                    3 pending
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <FiUsers className="text-xl" />
                            </div>

                        </div>

                    </div>
                </div>


                {/* Campaigns */}
                <div className="card bg-white border border-base-200">
                    <div className="card-body p-5">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm text-base-content/50">
                                    Active Campaigns
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    {activeCampaigns}
                                </h2>

                                <p className="mt-1 text-xs text-purple-600">
                                    ${totalRaised} raised
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                <FiTarget className="text-xl" />
                            </div>

                        </div>

                    </div>
                </div>


                {/* Donations */}
                <div className="card bg-white border border-base-200">
                    <div className="card-body p-5">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm text-base-content/50">
                                    Total Donations
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    ${totalDonations}
                                </h2>

                                <p className="mt-1 text-xs text-success">
                                    This year
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                <FiDollarSign className="text-xl" />
                            </div>

                        </div>

                    </div>
                </div>

            </section>


            {/* =====================================================
                QUICK ACTIONS
            ====================================================== */}
            <section>

                <div className="mb-4">
                    <h2 className="text-lg font-bold">
                        Quick Actions
                    </h2>

                    <p className="text-sm text-base-content/50">
                        Common things you can do from your dashboard.
                    </p>
                </div>


                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                    <Link
                        to="/dashboard/add-pet"
                        className="group flex items-center gap-3 rounded-2xl border border-base-200 bg-white p-4 transition hover:border-purple-200 hover:bg-purple-50"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <FiPlus />
                        </div>

                        <div>
                            <p className="font-semibold text-sm">
                                Add Pet
                            </p>

                            <p className="text-xs text-base-content/50">
                                New listing
                            </p>
                        </div>
                    </Link>


                    <Link
                        to="/dashboard/adoption-requests"
                        className="group flex items-center gap-3 rounded-2xl border border-base-200 bg-white p-4 transition hover:border-purple-200 hover:bg-purple-50"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                            <FiHeart />
                        </div>

                        <div>
                            <p className="font-semibold text-sm">
                                Requests
                            </p>

                            <p className="text-xs text-base-content/50">
                                Review adoption
                            </p>
                        </div>
                    </Link>


                    <Link
                        to="/dashboard/create-campaign"
                        className="group flex items-center gap-3 rounded-2xl border border-base-200 bg-white p-4 transition hover:border-purple-200 hover:bg-purple-50"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <FiTarget />
                        </div>

                        <div>
                            <p className="font-semibold text-sm">
                                Campaign
                            </p>

                            <p className="text-xs text-base-content/50">
                                Raise funds
                            </p>
                        </div>
                    </Link>


                    <Link
                        to="/dashboard/my-donations"
                        className="group flex items-center gap-3 rounded-2xl border border-base-200 bg-white p-4 transition hover:border-purple-200 hover:bg-purple-50"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <FiDollarSign />
                        </div>

                        <div>
                            <p className="font-semibold text-sm">
                                Donate
                            </p>

                            <p className="text-xs text-base-content/50">
                                Help a pet
                            </p>
                        </div>
                    </Link>

                </div>

            </section>


            {/* =====================================================
                CHART + PROFILE COMPLETION
            ====================================================== */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* Donation chart */}
                <div className="card bg-white border border-base-200 xl:col-span-2">

                    <div className="card-body">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <h2 className="card-title text-lg">
                                    Donation Overview
                                </h2>

                                <p className="text-sm text-base-content/50">
                                    Your donation activity over the last 6 months.
                                </p>
                            </div>

                            <div className="badge badge-outline">
                                2026
                            </div>

                        </div>


                        <div className="mt-5 h-[280px] w-full">

                            <ResponsiveContainer width="100%" height="100%">

                                <AreaChart data={donationData}>

                                    <defs>
                                        <linearGradient
                                            id="donationGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#8B5CF6"
                                                stopOpacity={0.25}
                                            />

                                            <stop
                                                offset="95%"
                                                stopColor="#8B5CF6"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#eeeeee"
                                    />

                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        width={35}
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "1px solid #eee",
                                        }}
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#8B5CF6"
                                        strokeWidth={3}
                                        fill="url(#donationGradient)"
                                    />

                                </AreaChart>

                            </ResponsiveContainer>

                        </div>

                    </div>

                </div>


                {/* Profile completion */}
                <div className="card bg-white border border-base-200">

                    <div className="card-body">

                        <h2 className="card-title text-lg">
                            Profile Completion
                        </h2>

                        <p className="text-sm text-base-content/50">
                            Complete your profile to build more trust with adopters.
                        </p>


                        <div className="mt-5 flex items-center justify-center">

                            <div
                                className="radial-progress text-purple-600"
                                style={{
                                    "--value": 80,
                                    "--size": "9rem",
                                    "--thickness": "10px",
                                }}
                                role="progressbar"
                            >
                                <span className="text-2xl font-bold text-gray-900">
                                    80%
                                </span>
                            </div>

                        </div>


                        <div className="mt-5 space-y-3">

                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                    <FiCheckCircle className="text-success" />
                                    Profile photo
                                </span>

                                <span className="text-xs text-success">
                                    Done
                                </span>
                            </div>


                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                    <FiCheckCircle className="text-success" />
                                    Contact information
                                </span>

                                <span className="text-xs text-success">
                                    Done
                                </span>
                            </div>


                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                    <FiAlertCircle className="text-warning" />
                                    Bio
                                </span>

                                <span className="text-xs text-warning">
                                    Missing
                                </span>
                            </div>

                        </div>


                        <Link
                            to="/dashboard/profile"
                            className="btn btn-outline rounded-xl mt-4"
                        >
                            Complete Profile
                        </Link>

                    </div>

                </div>

            </section>


            {/* =====================================================
                ADOPTION REQUESTS + CAMPAIGNS
            ====================================================== */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* Adoption Requests */}
                <div className="card bg-white border border-base-200">

                    <div className="card-body">

                        <div className="flex items-center justify-between">

                            <div>
                                <h2 className="card-title text-lg">
                                    Recent Adoption Requests
                                </h2>

                                <p className="text-sm text-base-content/50">
                                    Latest requests for your pets.
                                </p>
                            </div>

                            <Link
                                to="/dashboard/adoption-requests"
                                className="btn btn-ghost btn-sm rounded-xl"
                            >
                                View All
                                <FiArrowRight />
                            </Link>

                        </div>


                        <div className="mt-4 divide-y divide-base-200">

                            {recentRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="flex items-center gap-3 py-4"
                                >

                                    <div className="avatar">

                                        <div className="h-12 w-12 rounded-xl">
                                            <img
                                                src={request.petImage}
                                                alt={request.petName}
                                            />
                                        </div>

                                    </div>


                                    <div className="min-w-0 flex-1">

                                        <p className="font-semibold">
                                            {request.petName}
                                        </p>

                                        <p className="truncate text-xs text-base-content/50">
                                            Requested by {request.requester}
                                        </p>

                                        <p className="mt-1 text-[11px] text-base-content/40">
                                            {request.date}
                                        </p>

                                    </div>


                                    <div>

                                        {request.status === "Pending" && (
                                            <span className="badge badge-warning badge-sm">
                                                Pending
                                            </span>
                                        )}

                                        {request.status === "Approved" && (
                                            <span className="badge badge-success badge-sm">
                                                Approved
                                            </span>
                                        )}

                                        {request.status === "Rejected" && (
                                            <span className="badge badge-error badge-sm">
                                                Rejected
                                            </span>
                                        )}

                                    </div>

                                </div>
                            ))}

                        </div>

                    </div>

                </div>


                {/* Donation Campaigns */}
                <div className="card bg-white border border-base-200">

                    <div className="card-body">

                        <div className="flex items-center justify-between">

                            <div>
                                <h2 className="card-title text-lg">
                                    My Donation Campaigns
                                </h2>

                                <p className="text-sm text-base-content/50">
                                    Track how your campaigns are performing.
                                </p>
                            </div>

                            <Link
                                to="/dashboard/my-campaigns"
                                className="btn btn-ghost btn-sm rounded-xl"
                            >
                                View All
                                <FiArrowRight />
                            </Link>

                        </div>


                        <div className="mt-4 space-y-4">

                            {campaigns.map((campaign) => {

                                const progress =
                                    (campaign.raised / campaign.goal) * 100;

                                return (
                                    <div
                                        key={campaign.id}
                                        className="flex gap-3"
                                    >

                                        <div className="avatar">

                                            <div className="h-14 w-14 rounded-xl">
                                                <img
                                                    src={campaign.image}
                                                    alt={campaign.petName}
                                                />
                                            </div>

                                        </div>


                                        <div className="flex-1">

                                            <div className="flex items-center justify-between">

                                                <p className="font-semibold">
                                                    Help {campaign.petName}
                                                </p>

                                                <span className="text-xs font-semibold">
                                                    {Math.round(progress)}%
                                                </span>

                                            </div>


                                            <progress
                                                className="progress progress-warning mt-2 w-full"
                                                value={progress}
                                                max="100"
                                            />


                                            <div className="mt-1 flex justify-between text-xs text-base-content/50">

                                                <span>
                                                    ${campaign.raised} raised
                                                </span>

                                                <span>
                                                    Goal ${campaign.goal}
                                                </span>

                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </div>

                </div>

            </section>



            {/* =====================================================
                BOTTOM SUMMARY
            ====================================================== */}
            <section className="rounded-3xl bg-white border border-base-200 p-5 md:p-6">

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                            <FiHome className="text-xl" />
                        </div>

                        <div>
                            <h2 className="font-bold">
                                Thank you for being part of PawsHome
                            </h2>

                            <p className="mt-1 text-sm text-base-content/50">
                                Every listing, adoption and donation helps
                                connect pets with better lives.
                            </p>
                        </div>

                    </div>


                    <div className="flex flex-wrap gap-2">

                        <Link
                            to="/pets"
                            className="btn btn-sm btn-outline rounded-xl"
                        >
                            Find a Pet
                        </Link>

                        <Link
                            to="/dashboard/create-campaign"
                            className="btn btn-sm bg-[#F7C948] border-none text-gray-900 hover:bg-[#e9b92e] rounded-xl"
                        >
                            Create Campaign
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default UserDashboard;