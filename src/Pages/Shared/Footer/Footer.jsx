import { Link } from "react-router-dom";
import {
    FaPaw,
    FaFacebookF,
    FaInstagram,
    FaXTwitter,
    FaYoutube,
    FaEnvelope,
    FaPhone,
    FaLocationDot,
    FaHeart,
} from "react-icons/fa6";

// Update these routes to match your router
const exploreLinks = [
    { label: "Home", to: "/" },
    { label: "Browse Pets", to: "/pet-listing" },
    { label: "Donation Campaigns", to: "/donation-pets" },
];

const getInvolvedLinks = [
    { label: "Adopt a Pet", to: "/pet-listing" },
    { label: "Donate Now", to: "/donation-pets" },
    { label: "Login", to: "/login" },
    { label: "Register", to: "/register" },
];

// Replace "#" with your real social media links
const socials = [
    { label: "Facebook", href: "#", icon: <FaFacebookF /> },
    { label: "Instagram", href: "#", icon: <FaInstagram /> },
    { label: "X (Twitter)", href: "#", icon: <FaXTwitter /> },
    { label: "YouTube", href: "#", icon: <FaYoutube /> },
];

const Footer = () => {
    return (
        <footer className="bg-neutral text-neutral-content">


            <div className="h-1.5 bg-linear-to-r from-warning/0 via-warning to-warning/0"></div>

            <div className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 sm:pb-8 sm:pt-16 lg:px-8">

                {/* Mobile and tablet: brand on top, two link columns side by side, contact at the bottom */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-y-12 lg:grid-cols-12 lg:gap-12">

                    {/* Brand */}
                    <div className="col-span-2 lg:col-span-4">
                        <Link to="/" className="inline-flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-warning text-lg text-black sm:h-12 sm:w-12 sm:text-xl">
                                <FaPaw />
                            </span>
                            <span className="text-2xl font-extrabold text-white sm:text-3xl">
                                Paws<span className="text-warning">Home</span>
                            </span>
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-content/70 sm:mt-5 sm:text-base sm:leading-7">
                            Connecting loving families with pets who need a home. Adopt, donate, and
                            help every pet find a place to belong.
                        </p>

                        <div className="mt-5 flex gap-3 sm:mt-6">
                            {socials.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-warning hover:text-black"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h3 className="text-base font-bold text-white sm:text-lg">Explore</h3>
                        <div className="mt-2 h-1 w-8 rounded-full bg-warning"></div>

                        <ul className="mt-4 space-y-2.5 text-sm sm:mt-6 sm:space-y-3 sm:text-base">
                            {exploreLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-neutral-content/70 transition-all duration-300 hover:pl-1 hover:text-warning"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Get involved */}
                    <div className="lg:col-span-2">
                        <h3 className="text-base font-bold text-white sm:text-lg">Get Involved</h3>
                        <div className="mt-2 h-1 w-8 rounded-full bg-warning"></div>

                        <ul className="mt-4 space-y-2.5 text-sm sm:mt-6 sm:space-y-3 sm:text-base">
                            {getInvolvedLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-neutral-content/70 transition-all duration-300 hover:pl-1 hover:text-warning"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact (placeholder details) */}
                    <div className="col-span-2 lg:col-span-3">
                        <h3 className="text-base font-bold text-white sm:text-lg">Contact Us</h3>
                        <div className="mt-2 h-1 w-8 rounded-full bg-warning"></div>

                        <ul className="mt-4 space-y-3 text-sm text-neutral-content/70 sm:mt-6 sm:space-y-4 sm:text-base">
                            <li className="flex items-start gap-3">
                                <FaLocationDot className="mt-1 shrink-0 text-warning" />
                                123 Pet Street, Your City
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhone className="shrink-0 text-warning" />
                                +000 000 000 000
                            </li>
                            <li className="flex items-center gap-3">
                                <FaEnvelope className="shrink-0 text-warning" />
                                hello@pawshome.com
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-5 text-center text-xs text-neutral-content/60 sm:mt-14 sm:flex-row sm:gap-3 sm:pt-6 sm:text-sm">
                    <p>© {new Date().getFullYear()} PawsHome. All rights reserved.</p>

                    <p className="flex items-center gap-2">
                        Made with <FaHeart className="text-warning" /> for every pet
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;