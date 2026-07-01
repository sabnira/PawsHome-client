import { Link, NavLink } from "react-router-dom";
import { FiMoon, FiSun } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";
import { MdArrowDropDown} from "react-icons/md";
import { useContext} from "react";

import { CgProfile } from "react-icons/cg";
import { AuthContext } from "../../../providers/AuthProvider";


const navLinks = [
    { to: "/", label: "Home" },
    { to: "/pet-listing", label: "Pet listing" },
    { to: "/donation-campaigns", label: "Donation campaigns" },
]

const Navbar = () => {

    const { user, logOut } = useContext(AuthContext);

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">

                        {navLinks.map(({ to, label }) => (
                            <li key={to}>
                                <NavLink to={to}>{label}</NavLink>
                            </li>
                        ))}

                    </ul>
                </div>

                <a className="btn btn-ghost text-2xl font-berkshire">
                    <FaPaw className="text-green-500"></FaPaw>
                    PawsHome
                </a>

            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navLinks.map(({ to, label }) => (
                        <li key={to} className="text-lg font-bold">
                            <NavLink to={to} className={({ isActive }) => isActive ? " text-green-500 mr-2" : "mr-2"}>
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="navbar-end gap-2 lg:gap-6">

                {/* Dark mode */}
                <label className="swap swap-rotate">

                    <input type="checkbox" className="theme-controller" value="dark" />

                    <FiSun className="swap-off h-6 w-6 fill-current"></FiSun>

                    <FiMoon className="swap-on h-6 w-6 fill-current"></FiMoon>
                </label>


                {
                    user ?
                        <>
                            <div className="dropdown dropdown-end">

                                <div tabIndex={0} role="button" className="m-2 px-6 py-2 rounded-4xl border-2 border-gray-300">
                                    <div className="flex items-end">
                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-3xl overflow-hidden ring-2 ring-green-400 shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                                            {user?.photoURL ? (
                                                <img
                                                    referrerPolicy='no-referrer'
                                                    className="w-full h-full object-cover"
                                                    src={user.photoURL}
                                                    alt="User Profile"
                                                />
                                            ) : (
                                                <CgProfile className="w-full h-full" />
                                            )}
                                        </div>

                                        <MdArrowDropDown className="text-2xl text-black"></MdArrowDropDown> 

                                    </div>
                                </div>

                                <ul tabIndex="-1" className="dropdown-content menu bg-base-200 rounded-box z-1 w-56 p-4 shadow-sm ">

                                    <div className=" flex text-center items-center gap-3 mb-2">
                                        <div className="w-7 h-7 md:w-10 md:h-10 rounded-3xl overflow-hidden ring-2 ring-green-400">
                                            {user?.photoURL ? (
                                                <img
                                                    referrerPolicy='no-referrer'
                                                    className="w-full h-full object-cover"
                                                    src={user.photoURL}
                                                    alt="User Profile"
                                                />
                                            ) : (
                                                <CgProfile className="w-full h-full" />
                                            )}
                                        </div>

                                        <p>{user?.displayName}</p>
                                    </div>

                                    <div className="divider m-0"></div>

                                    <Link to="/dashboard" className="btn btn-ghost btn-sm lg:btn-md my-2 rounded-4xl">
                                        Dashboard
                                    </Link>

                                    <button onClick={logOut} className="btn bg-green-500 hover:bg-green-600 text-white btn-sm lg:btn-md border-none rounded-4xl">
                                        Logout
                                    </button>

                                </ul>
                            </div>
                        </>
                        :
                        <>

                            <Link to="/login" className="btn bg-green-500 hover:bg-green-600 text-white btn-sm border-none">Login</Link>
                        </>
                }

            </div>
        </div>
    );
};

export default Navbar;