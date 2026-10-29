// import { useEffect, useState } from "react"
// import { useKeenSlider } from "keen-slider/react"
// import "keen-slider/keen-slider.min.css"
// import banner1 from "../../../assets/banner1.jpg"
// import banner2 from "../../../assets/banner2.jpg"
// import banner3 from "../../../assets/banner3.jpg"

// const Banner = () => {
//     const [loaded, setLoaded] = useState(false)

//     const [sliderRef, instanceRef] = useKeenSlider({
//         loop: true,
//         created() {
//             setLoaded(true)
//         },
//     })


//     useEffect(() => {
//         if (!loaded) return

//         const interval = setInterval(() => {
//             instanceRef.current?.next()
//         }, 3000)

//         return () => clearInterval(interval)
//     }, [loaded, instanceRef])

//     return (
//         <div className="w-full text-black">
//             <div
//                 ref={sliderRef}
//                 className="keen-slider h-80 md:h-150 rounded-xl overflow-hidden"
//             >

//                 {/* Slide 1 */}
//                 <div className="keen-slider__slide flex items-center justify-between gap-8 bg-[#FFF4D6] px-10 mx-auto lg:px-8">

//                     <div className="flex-1">
//                         <h2 className="text-xl lg:text-6xl font-bold mb-6">
//                             Embrace <br /> Compassion: Rescue a Pet, Change a Life!
//                         </h2>
//                         <p className="text-xs lg:text-xl">Make a difference in the world by opening your heart and home to a shelter animal.</p>
//                     </div>

//                     <div className="flex-1 flex justify-end">
//                         <img src={banner1} className="w-full max-w-xl" alt="" />
//                     </div>
//                 </div>


//                 {/* Slide 2 */}
//                 <div className="keen-slider__slide flex items-center justify-between gap-8 bg-[#FBEDEC] px-10 lg:px-8">

//                     <div className="flex-1">
//                         <h2 className="text-xl lg:text-6xl font-bold mb-6">
//                             Discover <br /> Unconditional Love: Adopt a Pet Today!
//                         </h2>
//                         <p className="text-xs lg:text-xl">Find your perfect companion and bring joy to your home by choosing adoption over buying.</p>
//                     </div>

//                     <div className="flex-1 flex justify-end">
//                         <img src={banner2} className="w-full max-w-xl" alt="" />
//                     </div>
//                 </div>


//                 {/* Slide 3 */}
//                 <div className="keen-slider__slide flex items-center justify-between gap-8 bg-[#FFFFFF] px-10 lg:px-8">

//                     <div className="flex-1">
//                         <h2 className="text-xl lg:text-6xl font-bold mb-6">
//                             Transform <br /> Lives: Choose Adoption, Choose Love!
//                         </h2>
//                         <p className="text-xs lg:text-xl">Make a lasting impact by adopting a rescue pet and be a part of their incredible journey toward a brighter future. </p>
//                     </div>

//                     <div className="flex-1 flex justify-end">
//                         <img src={banner3} className="w-full max-w-xl" alt="" />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Banner;







import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FiArrowRight } from "react-icons/fi";
import banner1 from "../../../assets/banner1.jpg";
import banner2 from "../../../assets/banner2.jpg";
import banner3 from "../../../assets/banner3.jpg";

const AUTOPLAY_MS = 3000;

// Slide backgrounds match the banner images, so the photos blend in
const slides = [
    {
        lead: "Embrace Compassion:",
        tagline: "Rescue a Pet, Change a Life!",
        text: "Make a difference in the world by opening your heart and home to a shelter animal.",
        image: banner1,
        bg: "#FFF4D6",
    },
    {
        lead: "Discover Unconditional Love:",
        tagline: "Adopt a Pet Today!",
        text: "Find your perfect companion and bring joy to your home by choosing adoption over buying.",
        image: banner2,
        bg: "#FBEDEC",
    },
    {
        lead: "Transform Lives:",
        tagline: "Choose Adoption, Choose Love!",
        text: "Make a lasting impact by adopting a rescue pet and be a part of their incredible journey toward a brighter future.",
        image: banner3,
        bg: "#FFFFFF",
    },
];

const Banner = () => {
    const [loaded, setLoaded] = useState(false);
    const [current, setCurrent] = useState(0);
    const pausedRef = useRef(false);

    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        created() {
            setLoaded(true);
        },
        slideChanged(slider) {
            setCurrent(slider.track.details.rel);
        },
        dragStarted() {
            pausedRef.current = true;
        },
        dragEnded() {
            pausedRef.current = false;
        },
    });

    useEffect(() => {
        if (!loaded) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const interval = setInterval(() => {
            if (!pausedRef.current) instanceRef.current?.next();
        }, AUTOPLAY_MS);

        return () => clearInterval(interval);
    }, [loaded, instanceRef]);

    return (
        <section
            aria-roledescription="carousel"
            aria-label="Adoption highlights"
            className="mx-auto mt-4 w-full max-w-7xl px-3 text-[#14342A] sm:px-4"
            onMouseEnter={() => (pausedRef.current = true)}
            onMouseLeave={() => (pausedRef.current = false)}
            onFocus={() => (pausedRef.current = true)}
            onBlur={() => (pausedRef.current = false)}
        >
            <div className="relative overflow-hidden rounded-3xl">
                <div ref={sliderRef} className="keen-slider">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.tagline}
                            className="keen-slider__slide"
                            style={{ backgroundColor: slide.bg }}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${index + 1} of ${slides.length}`}
                        >
                            <div className="grid min-h-[34rem] items-center gap-6 px-6 pb-20 pt-10 sm:px-10 md:min-h-[32rem] md:grid-cols-2 md:gap-10 md:pb-16 lg:min-h-[36rem] lg:px-16">
                                {/* Text */}
                                <div className="max-w-xl">
                                    <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-6xl">
                                        {slide.lead}
                                        <span className="mt-3 block">
                                            <span className="box-decoration-clone rounded-xl bg-[#F7C948] px-2 py-0.5">
                                                {slide.tagline}
                                            </span>
                                        </span>
                                    </h2>

                                    <p className="mt-6 max-w-md text-base text-[#14342A]/75 lg:text-lg">
                                        {slide.text}
                                    </p>

                                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                        <Link
                                            to="/pet-listing"
                                            className="btn h-12 rounded-full border-none bg-[#14342A] px-7 text-white hover:bg-[#0F271F]"
                                        >
                                            Adopt a pet
                                            <FiArrowRight />
                                        </Link>
                                        <Link
                                            to="/donation-pets"
                                            className="btn h-12 rounded-full border-2 border-[#14342A] bg-transparent px-7 text-[#14342A] hover:bg-[#14342A]/10"
                                        >
                                            Donate to a pet
                                        </Link>
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="flex justify-center md:justify-end">
                                    <img
                                        src={slide.image}
                                        alt=""
                                        className="max-h-56 w-full max-w-xl object-contain sm:max-h-72 md:max-h-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                {loaded  && (
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 pb-6 sm:px-10 lg:px-16">
                        {/* Dots */}
                        <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
                            {slides.map((slide, index) => (
                                <button
                                    key={slide.tagline}
                                    type="button"
                                    role="tab"
                                    aria-selected={current === index}
                                    aria-label={`Go to slide ${index + 1}`}
                                    onClick={() => instanceRef.current?.moveToIdx(index)}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${
                                        current === index
                                            ? "w-8 bg-[#14342A]"
                                            : "w-2.5 bg-[#14342A]/25 hover:bg-[#14342A]/50"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Banner;