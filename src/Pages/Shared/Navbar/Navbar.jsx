import { Link, NavLink } from "react-router-dom";
import { FiMoon, FiSun } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";


const navLinks = [
    { to: "/", label: "Home" },
    { to: "/pet-listing", label: "Pet listing" },
    { to: "/donation-campaigns", label: "Donation campaigns" },
]

const Navbar = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm">
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

                <a className="btn btn-ghost text-xl">
                    <FaPaw></FaPaw>
                    PawsHome
                </a>
                
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navLinks.map(({ to, label }) => (
                        <li key={to}>
                            <NavLink to={to} className={({ isActive }) => isActive ? "font-medium text-emerald-600" : ""}>
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="navbar-end gap-2">

                {/* Dark mode */}
                <label className="swap swap-rotate">

                    <input type="checkbox" className="theme-controller" value="dark" />

                    <FiSun className="swap-off h-6 w-6 fill-current"></FiSun>

                    <FiMoon className="swap-on h-6 w-6 fill-current"></FiMoon>
                </label>


                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>

                <Link to="/register" className="btn bg-emerald-500 hover:bg-emerald-600 text-white btn-sm border-none">Register</Link>
            </div>
        </div>
    );
};

export default Navbar;