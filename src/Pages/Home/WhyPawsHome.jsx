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
            <SectionTitle
                title={"Why PawsHome?"}
                heading={
                    "We make adoption simple, safe, and full of heart, so every pet finds a family and every family finds a friend."
                }
            ></SectionTitle>

            <div className="grid gap-6 lg:grid-cols-3">

                {/* Lead card */}
                <div className="relative overflow-hidden rounded-3xl bg-warning p-8 text-warning-content shadow-lg md:p-10 lg:row-span-2">

                    <FaPaw
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-10 -right-8 text-[12rem] -rotate-12 opacity-15"
                    />

                    <div className="relative flex h-full flex-col">
                        <h3 className="text-3xl font-extrabold leading-tight md:text-4xl">
                            Find a friend who fits your life
                        </h3>

                        <p className="mt-4 max-w-sm leading-7 opacity-80">
                            From your first search to the day they come home, we keep every step clear and caring.
                        </p>

                        <ul className="mt-8 space-y-4">
                            {checklist.map((item) => (
                                <li key={item} className="flex items-start gap-3 font-medium">
                                    <FaCheckCircle className="mt-1 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Link
                            to="/pet-listing"
                            className="btn btn-neutral group mt-10 w-fit rounded-full px-6 lg:mt-auto"
                        >
                            Start adopting
                            <MdArrowRightAlt className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* Feature cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group card border border-base-300 bg-base-100 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-warning hover:shadow-xl"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/15 text-2xl text-warning transition-colors duration-300 group-hover:bg-warning group-hover:text-warning-content">
                                {feature.icon}
                            </div>

                            <h3 className="mt-5 text-xl font-bold">{feature.title}</h3>

                            <p className="mt-2 leading-7 text-base-content/70">{feature.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyPawsHome;