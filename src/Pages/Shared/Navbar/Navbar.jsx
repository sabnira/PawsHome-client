import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMoon, FiSun, FiMenu, FiLogOut, FiGrid, FiUser, FiChevronDown } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";
import { AuthContext } from "../../../providers/AuthProvider";

const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/pet-listing", label: "Pet listing" },
    { to: "/donation-pets", label: "Donation campaigns" },
];

const linkStyle = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-150
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7C948]
    ${
        isActive
            ? "bg-[#F7C948] text-gray-900"
            : "text-white/75 hover:bg-white/10 hover:text-white"
    }`;

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const navLinks = user
        ? [...publicLinks, { to: "/dashboard", label: "Dashboard" }]
        : publicLinks;

    // DaisyUI dropdowns stay open while focused, so drop focus after a choice
    const closeDropdown = () => document.activeElement?.blur();

    const handleLogout = async () => {
        closeDropdown();
        try {
            await logOut();
            navigate("/", { replace: true });
        } catch (error) {
            console.error(error);
        }
    };
// #195f35 #002842
    return (
        <header className="py-4 px-4 md:px-0 ">
            <div className="flex items-center justify-between rounded-full bg-[#14342A] py-2 pl-3 pr-2.5 shadow-lg shadow-[#14342A]/20 sm:pl-4">
                {/* Left: mobile menu + logo */}
                <div className="flex items-center gap-1">
                    <div className="dropdown">
                        <div
                            tabIndex={0}
                            role="button"
                            aria-label="Open menu"
                            className="btn btn-ghost btn-circle btn-sm text-white hover:bg-white/10 lg:hidden"
                        >
                            <FiMenu className="text-xl" />
                        </div>

                        <ul
                            tabIndex={-1}
                            className="dropdown-content z-50 mt-5 w-64 space-y-1 rounded-3xl bg-[#14342A] p-3 shadow-xl"
                        >
                            {navLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <NavLink
                                        to={to}
                                        end={to === "/"}
                                        onClick={closeDropdown}
                                        className={({ isActive }) =>
                                            `block ${linkStyle({ isActive })} !rounded-2xl !py-3`
                                        }
                                    >
                                        {label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Link
                        to="/"
                        className="flex items-center gap-2.5 font-berkshire text-xl font-extrabold text-white"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7C948] text-base text-gray-900">
                            <FaPaw />
                        </span>
                        <span className="hidden sm:inline">PawsHome</span>
                    </Link>
                </div>

                {/* Center: desktop links */}
                <nav aria-label="Main" className="hidden lg:block">
                    <ul className="flex items-center gap-1">
                        {navLinks.map(({ to, label }) => (
                            <li key={to}>
                                <NavLink to={to} end={to === "/"} className={linkStyle}>
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Right: theme toggle + account */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <label
                        className="btn btn-ghost btn-circle btn-sm swap swap-rotate text-white hover:bg-white/10"
                        title="Toggle dark mode"
                    >
                        <input
                            type="checkbox"
                            className="theme-controller"
                            value="dark"
                            aria-label="Toggle dark mode"
                        />
                        <FiMoon className="swap-off h-5 w-5" />
                        <FiSun className="swap-on h-5 w-5" />
                    </label>

                    {user ? (
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                aria-label="Account menu"
                                className="flex cursor-pointer items-center gap-1.5 rounded-full bg-white/10 py-1 pl-1 pr-3 transition hover:bg-white/15"
                            >
                                <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-[#F7C948]">
                                    {user.photoURL ? (
                                        <img
                                            referrerPolicy="no-referrer"
                                            className="h-full w-full object-cover"
                                            src={user.photoURL}
                                            alt={user.displayName || "User"}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-[#F7C948] text-gray-900">
                                            <FiUser />
                                        </div>
                                    )}
                                </div>
                                <FiChevronDown className="text-white/70" />
                            </div>

                            <div
                                tabIndex={-1}
                                className="dropdown-content z-50 mt-5 w-64 rounded-2xl border border-base-200 bg-base-100 p-2 shadow-xl"
                            >
                                <div className="px-3 py-3">
                                    <p className="truncate text-sm font-semibold">
                                        {user.displayName || "PawsHome User"}
                                    </p>
                                    <p className="truncate text-xs text-base-content/50">
                                        {user.email}
                                    </p>
                                </div>

                                <div className="my-1 border-t border-base-200"></div>

                                <Link
                                    to="/dashboard"
                                    onClick={closeDropdown}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-base-200"
                                >
                                    <FiGrid className="text-lg" />
                                    Dashboard
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10"
                                >
                                    <FiLogOut className="text-lg" />
                                    Log out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="btn btn-sm h-10 rounded-full border-none bg-[#F7C948] px-6 font-bold text-gray-900 hover:bg-[#EEBA2C]"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;