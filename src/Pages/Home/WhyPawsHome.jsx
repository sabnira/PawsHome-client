import { Link } from "react-router-dom";
import { FaPaw, FaSearch, FaHandHoldingHeart, FaLock, FaCheckCircle } from "react-icons/fa";
import { MdVerified, MdArrowRightAlt } from "react-icons/md";
import SectionTitle from "../../components/SectionTitle";


const features = [
    {
        icon: <MdVerified />,
        title: "Verified, healthy pets",
        text: "Every listing is reviewed, so you know exactly who you are bringing home.",
    },
    {
        icon: <FaSearch />,
        title: "Easy to find your match",
        text: "Search by category, age, and location to find a pet that fits your life.",
    },
    {
        icon: <FaHandHoldingHeart />,
        title: "Donations that help",
        text: "Support campaigns for pets in need and see where your help goes.",
    },
    {
        icon: <FaLock />,
        title: "Safe and secure",
        text: "Protected sign-in and secure Stripe payments keep your details private.",
    },
];

const checklist = [
    "Send an adoption request in a few clicks",
    "Track every request from your dashboard",
    "Give a pet a second chance, one pet at a time",
];

const WhyPawsHome = () => {
    return (
        <section className="my-16 md:my-24">
            <SectionTitle title={"Why PawsHome?"}></SectionTitle>

            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">

                {/* Lead card */}
                <div className="relative overflow-hidden rounded-3xl bg-warning p-6 text-warning-content shadow-lg sm:p-8 md:p-10 lg:row-span-2">

                    <FaPaw
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-8 -right-6 text-[8rem] -rotate-12 opacity-15 md:-bottom-10 md:-right-8 md:text-[12rem]"
                    />

                    <div className="relative flex h-full flex-col">
                        <h3 className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
                            Find a friend who fits your life
                        </h3>

                        <p className="mt-3 max-w-sm text-sm leading-6 opacity-80 sm:mt-4 sm:text-base sm:leading-7">
                            From your first search to the day they come home, we keep every step clear and caring.
                        </p>

                        <ul className="mt-6 space-y-3 text-sm sm:mt-8 sm:space-y-4 sm:text-base">
                            {checklist.map((item) => (
                                <li key={item} className="flex items-start gap-3 font-medium">
                                    <FaCheckCircle className="mt-1 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Link
                            to="/pet-listing"
                            className="btn btn-neutral group mt-8 w-fit rounded-full px-6 sm:mt-10 lg:mt-auto"
                        >
                            Start adopting
                            <MdArrowRightAlt className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* Feature cards: 2 per row on every screen size */}
                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:col-span-2 lg:pt-6">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group card border border-base-300 bg-base-100 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-warning hover:shadow-xl sm:p-6 md:p-7"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/15 text-xl text-warning transition-colors duration-300 group-hover:bg-warning group-hover:text-warning-content sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl">
                                {feature.icon}
                            </div>

                            <h3 className="mt-3 text-base font-bold leading-snug sm:mt-5 sm:text-xl">
                                {feature.title}
                            </h3>

                            <p className="mt-1.5 text-sm leading-6 text-base-content/70 sm:mt-2 sm:text-base sm:leading-7">
                                {feature.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyPawsHome;