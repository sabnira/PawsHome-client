import { Link } from "react-router-dom";
import { FaBone, FaPaw } from "react-icons/fa";
import { MdArrowRightAlt } from "react-icons/md";


import puppy from "../../assets/puppy.webp";

const AdoptionCTA = () => {
    return (
        <section className="relative my-16 mt-32 md:my-44 md:mt-80">

            <img
                src={puppy}
                alt="A happy puppy peeking over the banner"
                className="pointer-events-none absolute bottom-full left-1/2 z-10 w-48 -translate-x-1/2 translate-y-3 select-none sm:w-60 md:w-80"
            />

           
            <FaBone
                aria-hidden="true"
                className="absolute -top-24 left-[8%] hidden rotate-[25deg] text-3xl text-neutral/70 md:block"
            />
            <FaBone
                aria-hidden="true"
                className="absolute -top-36 right-[12%] hidden -rotate-[35deg] text-4xl text-neutral/70 md:block"
            />

            {/* Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-warning px-6 py-12 text-neutral sm:px-10 md:px-16 md:py-28">

                <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">

                    {/* Headline with burst lines */}
                    <div className="relative pl-10 md:pl-14">
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 60 70"
                            className="absolute left-0 top-0 h-14 w-12 md:h-20 md:w-16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            strokeLinecap="round"
                        >
                            <path d="M30 6 L34 24" />
                            <path d="M6 24 L26 34" />
                            <path d="M8 56 L26 50" />
                        </svg>

                        <h2
                            className="pt-8 text-4xl font-extrabold leading-[1.1] md:pt-10 md:text-5xl lg:text-6xl font-berkshire"
                        >
                            Your new best friend is waiting
                        </h2>
                    </div>

                   
                    <div className="relative md:pl-4">
                        <p className="max-w-md text-base leading-7 md:text-lg">
                            Browse healthy, well-loved pets and send your adoption request in minutes.
                            Every adoption gives a pet a second chance.
                        </p>

                        <Link
                            to="/pet-listing"
                            className="btn btn-neutral group mt-8 rounded-full px-8 text-base"
                        >
                            Adopt a Pet
                            <MdArrowRightAlt className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>

                    </div>
                </div>

                {/* Paw waving from the bottom edge */}
                <FaPaw
                    aria-hidden="true"
                    className="absolute -bottom-6 left-[42%] hidden rotate-18 text-7xl text-neutral/80 lg:block"
                />
            </div>
        </section>
    );
};

export default AdoptionCTA;