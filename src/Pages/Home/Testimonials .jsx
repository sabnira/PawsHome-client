import { useMemo, useRef } from "react";
import Flicking from "@egjs/react-flicking";
import { AutoPlay } from "@egjs/flicking-plugins";
import "@egjs/react-flicking/dist/flicking.css";
import { FaQuoteLeft } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import SectionTitle from "../../components/SectionTitle";


import kitten from "../../assets/testimonial.png";

// Sample content
const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Adopted a Golden Retriever",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
        text: "The whole process was simple and clear. We sent a request, got a reply quickly, and now our home feels complete. Thank you, PawsHome!",
    },
    {
        name: "Michael Chen",
        role: "Adopted a Tabby Cat",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
        text: "I loved being able to browse pets by category and see everything about them before deciding. Our cat settled in on day one.",
    },
    {
        name: "Emily Davis",
        role: "Campaign Donor",
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop",
        text: "Donating was quick and felt safe. I could see how much each campaign had raised, and that made me trust where my money was going.",
    },
    {
        name: "Daniel Rahman",
        role: "Adopted a Beagle",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
        text: "Great platform for finding a pet that fits your family. Tracking my adoption request from the dashboard was a really nice touch.",
    },
    {
        name: "Olivia Martinez",
        role: "Listed a Pet for Adoption",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop",
        text: "Adding my pet's profile took only a few minutes, and I found a loving family for her within days. I would recommend it to anyone.",
    },
    {
        name: "James Wilson",
        role: "Campaign Donor",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        text: "A caring community and an easy way to help animals in need. I now check the campaigns every week.",
    },
];



const Testimonials = () => {
    const flickingRef = useRef(null);


    // Plugins must be created once, not on every render
    const plugins = useMemo(
        () => [new AutoPlay({ duration: 3000, direction: "NEXT", stopOnHover: true })],
        []
    );

    const goPrev = () => flickingRef.current?.prev().catch(() => {});
    const goNext = () => flickingRef.current?.next().catch(() => {});
   

    return (
        <section className="my-16 md:my-24">
            <SectionTitle
                title={"What People Are Saying"}
                heading={
                    "Real stories from the families, adopters, and donors who make PawsHome a place where every pet can find love."
                }
            ></SectionTitle>

            <div className="flex items-end lg:gap-0">

                {/* Kitten (large screens only) */}
                <div className="hidden w-1/3 shrink-0 self-end lg:block">
                    <img
                        src={kitten}
                        alt="A playful kitten reaching up"
                        className="pointer-events-none -mb-1 w-full max-w-md translate-x-24 select-none object-contain object-bottom lg:-ml-6"
                        draggable="false"
                    />
                </div>

                {/* Slider */}
                <div className="relative min-w-0 flex-1">

                    {/* Arrow: left (flat edge toward the cards) */}
                    <button
                        onClick={goPrev}
                        aria-label="Previous testimonial"
                        className="absolute left-0 top-1/2 z-10 flex h-14 w-12 -translate-y-1/2 items-center justify-center rounded-l-2xl bg-warning text-3xl text-black shadow-md transition-all duration-300 hover:w-14 hover:bg-warning/90 lg:-left-3"
                    >
                        <MdChevronLeft />
                    </button>

                    {/* Arrow: right */}
                    <button
                        onClick={goNext}
                        aria-label="Next testimonial"
                        className="absolute right-0 top-1/2 z-10 flex h-14 w-12 -translate-y-1/2 items-center justify-center rounded-r-2xl bg-warning text-3xl text-black shadow-md transition-all duration-300 hover:w-14 hover:bg-warning/90 lg:-right-3"
                    >
                        <MdChevronRight />
                    </button>

                    <Flicking
                        ref={flickingRef}
                        plugins={plugins}
                        circular={true}
                        align="prev"
                        className="cursor-grab select-none active:cursor-grabbing"
                    >
                        {testimonials.map((item) => (
                            <div
                                key={item.name}
                                className="flicking-panel w-full px-3 pb-14 pt-2 sm:w-1/2"
                            >
                                <div className="relative flex h-full flex-col items-center rounded-[2rem] bg-base-200 px-7 pb-16 pt-10 text-center md:px-9">

                                    {/* Name and role */}
                                    <h3 className="text-xl font-extrabold uppercase tracking-wide">
                                        {item.name}
                                    </h3>
                                    <p className="mt-1 font-bold text-amber-600">{item.role}</p>

                                    {/* Quote */}
                                    <div className="mt-6 flex-1">
                                        <FaQuoteLeft
                                            aria-hidden="true"
                                            className="mb-2 text-4xl text-warning"
                                        />
                                        <p className="font-medium leading-8 text-base-content/60">
                                            {item.text}
                                        </p>
                                    </div>

                                    {/* Avatar overlapping the bottom edge */}
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            loading="lazy"
                                            draggable="false"
                                            className="h-20 w-20 rounded-full object-cover ring-8 ring-base-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Flicking>

                </div>
            </div>
        </section>
    );
};

export default Testimonials;