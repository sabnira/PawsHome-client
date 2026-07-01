import { useEffect, useState } from "react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import banner1 from "../../../assets/banner1.jpg"
import banner2 from "../../../assets/banner2.jpg"
import banner3 from "../../../assets/banner3.jpg"

const Banner = () => {
    const [loaded, setLoaded] = useState(false)

    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        created() {
            setLoaded(true)
        },
    })


    useEffect(() => {
        if (!loaded) return

        const interval = setInterval(() => {
            instanceRef.current?.next()
        }, 3000)

        return () => clearInterval(interval)
    }, [loaded, instanceRef])

    return (
        <div className="w-full text-black">
            <div
                ref={sliderRef}
                className="keen-slider h-80 md:h-150 rounded-xl overflow-hidden"
            >

                {/* Slide 1 */}
                <div className="keen-slider__slide flex items-center justify-between gap-8 bg-[#FFF4D6] px-10 mx-auto lg:px-8">

                    <div className="flex-1">
                        <h2 className="text-xl lg:text-6xl font-bold mb-6">
                            Embrace <br /> Compassion: Rescue a Pet, Change a Life!
                        </h2>
                        <p className="text-xs lg:text-xl">Make a difference in the world by opening your heart and home to a shelter animal.</p>
                    </div>

                    <div className="flex-1 flex justify-end">
                        <img src={banner1} className="w-full max-w-xl" alt="" />
                    </div>
                </div>


                {/* Slide 2 */}
                <div className="keen-slider__slide flex items-center justify-between gap-8 bg-[#FBEDEC] px-10 lg:px-8">

                    <div className="flex-1">
                        <h2 className="text-xl lg:text-6xl font-bold mb-6">
                            Discover <br /> Unconditional Love: Adopt a Pet Today!
                        </h2>
                        <p className="text-xs lg:text-xl">Find your perfect companion and bring joy to your home by choosing adoption over buying.</p>
                    </div>

                    <div className="flex-1 flex justify-end">
                        <img src={banner2} className="w-full max-w-xl" alt="" />
                    </div>
                </div>


                {/* Slide 3 */}
                <div className="keen-slider__slide flex items-center justify-between gap-8 bg-[#FFFFFF] px-10 lg:px-8">

                    <div className="flex-1">
                        <h2 className="text-xl lg:text-6xl font-bold mb-6">
                            Transform <br /> Lives: Choose Adoption, Choose Love!
                        </h2>
                        <p className="text-xs lg:text-xl">Make a lasting impact by adopting a rescue pet and be a part of their incredible journey toward a brighter future. </p>
                    </div>

                    <div className="flex-1 flex justify-end">
                        <img src={banner3} className="w-full max-w-xl" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner