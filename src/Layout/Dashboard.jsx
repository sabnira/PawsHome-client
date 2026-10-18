import { useContext } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
    FiGrid,
    FiPlusCircle,
    FiHeart,
    FiTarget,
    FiList,
    FiGift,
    FiUsers,
    FiDollarSign,
    FiLogOut,
    FiMenu,
    FiUser,
    FiExternalLink,
} from "react-icons/fi";
import { FaPaw } from "react-icons/fa";
import useAdmin from "../hooks/useAdmin";
import { AuthContext } from "../providers/AuthProvider";

const userSections = [
    {
        title: "Pets",
        items: [
            { to: "/dashboard", label: "Overview", icon: FiGrid, end: true },
            { to: "/dashboard/add-pet", label: "Add a pet", icon: FiPlusCircle },
            { to: "/dashboard/my-pets", label: "My added pets", icon: FaPaw },
            { to: "/dashboard/adoption-requests", label: "Adoption requests", icon: FiHeart },
        ],
    },
    {
        title: "Donations",
        items: [
            { to: "/dashboard/create-campaign", label: "Create campaign", icon: FiTarget },
            { to: "/dashboard/my-campaigns", label: "My campaigns", icon: FiList },
            { to: "/dashboard/my-donations", label: "My donations", icon: FiGift },
        ],
    },
];

const adminSection = {
    title: "Admin",
    items: [
        { to: "/dashboard/users", label: "Users", icon: FiUsers },
        { to: "/dashboard/all-pets", label: "All pets", icon: FaPaw },
        { to: "/dashboard/all-donations", label: "All donations", icon: FiDollarSign },
    ],
};

// Page names for the header breadcrumb, keyed by the first path segment after /dashboard
const pageNames = {
    "add-pet": "Add a pet",
    "my-pets": "My added pets",
    "update-pet": "Update pet",
    "adoption-requests": "Adoption requests",
    "create-campaign": "Create campaign",
    "my-campaigns": "My campaigns",
    "my-donations": "My donations",
    users: "Users",
    "all-pets": "All pets",
    "all-donations": "All donations",
};

const Dashboard = () => {
    const [isAdmin] = useAdmin();
    const { user, logOut } = useContext(AuthContext);
    const { pathname } = useLocation();

    const segment = pathname.split("/")[2];
    const currentPage = segment ? pageNames[segment] : null;

    // Close the mobile drawer after choosing a page
    const closeDrawer = () => {
        const toggle = document.getElementById("dashboard-drawer");
        if (toggle) toggle.checked = false;
    };

    const handleLogout = async () => {
        try {
            await logOut();
        } catch (error) {
            console.error(error);
        }
    };

    const navLinkStyle = ({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium
        transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7C948]
        ${
            isActive
                ? "bg-[#F7C948] font-semibold text-gray-900"
                : "text-white/70 hover:bg-white/10 hover:text-white"
        }`;

    // Admin group is shown to every role for now; AdminRoute still blocks non-admins
    const sections = [...userSections, adminSection];

    const avatar = (
        <div className="avatar">
            <div className="w-10 rounded-full ring-2 ring-white/20">
                {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "User"} />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#F7C948] text-gray-900">
                        <FiUser />
                    </div>
                )}
            </div>
        </div>
    );

    const sidebarContent = (
        <div className="flex h-full flex-col bg-[#14342A]">
            {/* Logo */}
            <Link
                to="/"
                className="flex items-center gap-3 px-6 py-6 font-berkshire text-2xl font-extrabold text-white"
            >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7C948] text-lg text-gray-900">
                    <FaPaw />
                </span>
                PawsHome
            </Link>

            {/* Navigation */}
            <nav
                aria-label="Dashboard"
                className="flex-1 space-y-7 overflow-y-auto px-4 pb-6 pt-2"
            >
                {sections.map((section) => (
                    <div key={section.title}>
                        <p
                            className={`mb-2 px-3.5 text-xs font-medium ${
                                section.title === "Admin"
                                    ? "text-[#F7C948]"
                                    : "text-white/40"
                            }`}
                        >
                            {section.title}
                        </p>

                        <ul className="space-y-1">
                            {section.items.map(({ to, label, icon: Icon, end }) => (
                                <li key={to}>
                                    <NavLink
                                        to={to}
                                        end={end}
                                        onClick={closeDrawer}
                                        className={navLinkStyle}
                                    >
                                        <Icon className="text-lg" />
                                        {label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Sidebar bottom: signed-in user + logout */}
            <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                    {avatar}

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                            {user?.displayName || "PawsHome User"}
                        </p>
                        <p className="truncate text-xs text-white/50">
                            {isAdmin ? "Administrator" : "Pet lover"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        title="Log out"
                        aria-label="Log out"
                        className="btn btn-sm btn-circle btn-ghost text-white/70 hover:bg-white/10 hover:text-white"
                    >
                        <FiLogOut className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAFAFB]">
            <div className="drawer lg:drawer-open">
                <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

                {/* Main content */}
                <div className="drawer-content flex min-h-screen flex-col">
                    {/* Header */}
                    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-gray-100 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="dashboard-drawer"
                                aria-label="Open menu"
                                className="btn btn-ghost btn-circle lg:hidden"
                            >
                                <FiMenu className="text-xl" />
                            </label>

                            <nav aria-label="Breadcrumb" className="text-sm">
                                {currentPage ? (
                                    <ol className="flex items-center gap-2">
                                        <li>
                                            <Link
                                                to="/dashboard"
                                                className="text-gray-400 hover:text-gray-700"
                                            >
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li aria-hidden="true" className="text-gray-300">
                                            /
                                        </li>
                                        <li
                                            aria-current="page"
                                            className="font-semibold text-gray-900"
                                        >
                                            {currentPage}
                                        </li>
                                    </ol>
                                ) : (
                                    <p className="font-semibold text-gray-900">Dashboard</p>
                                )}
                            </nav>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                to="/"
                                className="btn btn-sm rounded-xl border-gray-200 bg-white font-medium text-gray-700 hover:bg-[#FFF8E1]"
                            >
                                <FiExternalLink />
                                <span className="hidden sm:inline">Visit site</span>
                            </Link>

                            <div className="avatar" title={user?.displayName || "PawsHome User"}>
                                <div className="w-10 rounded-full ring-1 ring-gray-200">
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user.displayName || "User"}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-[#FFF8E1] text-[#D99A00]">
                                            <FiUser />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <div className="mx-auto w-full max-w-7xl">
                            <Outlet />
                        </div>
                    </main>
                </div>

                {/* Sidebar */}
                <div className="drawer-side z-40">
                    <label
                        htmlFor="dashboard-drawer"
                        aria-label="Close sidebar"
                        className="drawer-overlay"
                    ></label>

                    <aside className="min-h-full w-[272px] bg-[#14342A]">
                        {sidebarContent}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;