import { NavLink, Outlet } from "react-router-dom";
import { FiHome, FiPlusCircle, FiList, FiHeart, FiDollarSign, FiUsers, FiLogOut, FiMenu, FiUser } from "react-icons/fi";
import { useContext } from "react";
import useAdmin from "../hooks/useAdmin";
import { AuthContext } from "../providers/AuthProvider";
import { FaPaw } from "react-icons/fa";



const Dashboard = () => {
    const [isAdmin] = useAdmin();
    const { user, logOut } = useContext(AuthContext);

    const navLinkStyle = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium
        transition-all duration-200
        ${isActive
            ? "bg-[#F7C948] font-semibold"
            : "text-gray-600 hover:bg-[#FFF8E1] hover:text-gray-900"
        }`;

    const handleLogout = async () => {
        try {
            await logOut();
        } catch (error) {
            console.error(error);
        }
    };


    const sidebarContent = (
        <div className="flex h-full flex-col bg-white">

            {/* Logo */}
            <NavLink to="/" className="flex items-center pl-7 gap-3 text-2xl font-berkshire py-6 font-extrabold border-b border-gray-100">
                <FaPaw className="text-green-500"></FaPaw>
                PawsHome
            </NavLink>
            

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-6">

                {/* Main */}
                <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                    Main Menu
                </p>

                <ul className="space-y-1">

                    <li>
                        <NavLink
                            to="/dashboard"
                            end
                            className={navLinkStyle}
                        >
                            <FiHome className="text-lg" />
                            Dashboard
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/add-pet"
                            className={navLinkStyle}
                        >
                            <FiPlusCircle className="text-lg" />
                            Add a Pet
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/my-pets"
                            className={navLinkStyle}
                        >
                            <FiList className="text-lg" />
                            My Added Pets
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/adoption-requests"
                            className={navLinkStyle}
                        >
                            <FiHeart className="text-lg" />
                            Adoption Requests
                        </NavLink>
                    </li>

                </ul>


                {/* Donations */}
                <p className="mb-3 mt-8 px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                    Donations
                </p>

                <ul className="space-y-1">

                    <li>
                        <NavLink
                            to="/dashboard/create-campaign"
                            className={navLinkStyle}
                        >
                            <FiDollarSign className="text-lg" />
                            Create Campaign
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/my-campaigns"
                            className={navLinkStyle}
                        >
                            <FiList className="text-lg" />
                            My Campaigns
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/my-donations"
                            className={navLinkStyle}
                        >
                            <FiHeart className="text-lg" />
                            My Donations
                        </NavLink>
                    </li>

                </ul>


                {/* Admin */}
                {isAdmin && (
                    <>
                        <div className="my-7 border-t border-gray-100"></div>

                        <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-purple-500">
                            Administration
                        </p>

                        <ul className="space-y-1">

                            <li>
                                <NavLink
                                    to="/dashboard/users"
                                    className={navLinkStyle}
                                >
                                    <FiUsers className="text-lg" />
                                    Users
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/all-pets"
                                    className={navLinkStyle}
                                >
                                    <FiList className="text-lg" />
                                    All Pets
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/all-donations"
                                    className={navLinkStyle}
                                >
                                    <FiDollarSign className="text-lg" />
                                    All Donations
                                </NavLink>
                            </li>

                        </ul>
                    </>
                )}

            </div>


            {/* Sidebar Bottom */}
            <div className="border-t border-gray-100 p-4">

                <NavLink
                    to="/"
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                >
                    <FiHome className="text-lg" />
                    Back to Home
                </NavLink>

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
                >
                    <FiLogOut className="text-lg" />
                    Logout
                </button>

            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAFAFB]">

            {/* ================= DAISYUI DRAWER ================= */}
            <div className="drawer lg:drawer-open">

                {/* Drawer checkbox */}
                <input
                    id="dashboard-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                />


                {/* ================= MAIN CONTENT ================= */}
                <div className="drawer-content flex min-h-screen flex-col">

                    {/* Navbar */}
                    <header className="navbar sticky top-0 z-30 h-[82px] border-b border-gray-100 bg-white px-4 sm:px-6 lg:px-8">

                        {/* Left */}
                        <div className="navbar-start">

                            {/* Mobile Menu Button */}
                            <label
                                htmlFor="dashboard-drawer"
                                className="btn btn-ghost btn-circle mr-2 lg:hidden"
                            >
                                <FiMenu className="text-xl" />
                            </label>

                            <div>
                                <p className="hidden text-[11px] font-medium uppercase tracking-wider text-gray-400 sm:block">
                                    PawsHome Dashboard
                                </p>

                                <h2 className="text-base font-semibold text-gray-900 sm:text-xl">
                                    Welcome back! 👋
                                </h2>
                            </div>

                        </div>


                        {/* Right */}
                        <div className="navbar-end">

                            <div className="dropdown dropdown-end">

                                {/* User button */}
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="flex cursor-pointer items-center gap-2 rounded-full p-1.5 transition hover:bg-gray-50 sm:gap-3"
                                >

                                    <div className="avatar">

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

                                    <div className="hidden text-left sm:block">

                                        <p className="text-sm font-semibold text-gray-900">
                                            {user?.displayName || "PawsHome User"}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            {isAdmin ? "Administrator" : "Pet Lover"}
                                        </p>

                                    </div>

                                </div>


                                {/* Dropdown */}
                                <ul
                                    tabIndex={0}
                                    className="menu dropdown-content z-[50] mt-3 w-52 rounded-2xl border border-gray-100 bg-white p-2 shadow-lg"
                                >

                                    <li>
                                        <NavLink to="/dashboard/profile">
                                            <FiUser />
                                            Profile
                                        </NavLink>
                                    </li>

                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="text-red-500"
                                        >
                                            <FiLogOut />
                                            Logout
                                        </button>
                                    </li>

                                </ul>

                            </div>

                        </div>

                    </header>


                    {/* Page Content */}
                    <main className="flex-1 bg-[#FAFAFB] p-4 sm:p-6 lg:p-8">

                        <div className="mx-auto w-full max-w-7xl">
                            <Outlet />
                        </div>

                    </main>

                </div>


                {/* ================= DRAWER SIDE ================= */}
                <div className="drawer-side z-40">

                    {/* Mobile overlay */}
                    <label
                        htmlFor="dashboard-drawer"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>

                    {/* Sidebar */}
                    <aside className="min-h-full w-[270px] bg-white">

                        {sidebarContent}

                    </aside>

                </div>

            </div>
        </div>
    );
};

export default Dashboard;