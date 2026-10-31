
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    FaPaw,
    FaHome,
    FaHandHoldingHeart,
    FaDonate,
} from "react-icons/fa";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import statsBg from "../../assets/slide0.jpg";

// Smooth count-up animation
const CountUp = ({ end = 0, prefix = "" }) => {
    const ref = useRef(null);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let frameId;
        let startTime;
        let hasStarted = false;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || hasStarted) return;

                hasStarted = true;
                observer.disconnect();

                const duration = 1800;

                const animate = (time) => {
                    if (!startTime) startTime = time;

                    const progress = Math.min(
                        (time - startTime) / duration,
                        1
                    );

                    const eased = 1 - Math.pow(1 - progress, 4);

                    setValue(Math.round(end * eased));

                    if (progress < 1) {
                        frameId = requestAnimationFrame(animate);
                    }
                };

                frameId = requestAnimationFrame(animate);
            },
            { threshold: 0.3 }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frameId);
        };
    }, [end]);

    return (
        <span ref={ref} className="inline-block tabular-nums">
            {prefix}{value.toLocaleString()}
        </span>
    );
};

const Stats = () => {
    const axiosPublic = useAxiosPublic();

    const { data: pets = [] } = useQuery({
        queryKey: ["stats-pets"],
        queryFn: async () => {
            const res = await axiosPublic.get("/pets");
            return res.data;
        },
    });

    const { data: campaigns = [] } = useQuery({
        queryKey: ["stats-campaigns"],
        queryFn: async () => {
            const res = await axiosPublic.get("/donationPets");
            return res.data;
        },
    });

    const stats = [
        {
            icon: <FaPaw />,
            value: pets.length,
            label: "Pets Listed",
        },
        {
            icon: <FaHome />,
            value: pets.filter((pet) => pet.adopted).length,
            label: "Adopted Pets",
        },
        {
            icon: <FaHandHoldingHeart />,
            value: campaigns.filter((campaign) => !campaign.paused).length,
            label: "Active Campaigns",
        },
        {
            icon: <FaDonate />,
            value: campaigns.reduce(
                (sum, campaign) =>
                    sum + (Number(campaign.donatedAmount) || 0),
                0
            ),
            prefix: "$",
            label: "Funds Raised",
        },
    ];

    return (
        <section className="my-16 md:my-30">
            <div
                className="relative isolate overflow-hidden rounded-[2rem] bg-cover bg-center"
                style={{ backgroundImage: `url(${statsBg})` }}
            >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-neutral/75" />

                <div className="relative px-4 py-14 md:px-12 md:py-36">
                    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                        {stats.map((item) => (
                            <div
                                key={item.label}
                                className="flex flex-col items-center text-center text-white"
                            >
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl text-[#14342A] shadow-lg transition-transform duration-300 hover:-translate-y-1 md:h-28 md:w-28 md:text-5xl">
                                    {item.icon}
                                </div>

                                <div className="mt-5 min-h-16 text-5xl font-extrabold leading-tight text-white">
                                    <CountUp
                                        end={item.value}
                                        prefix={item.prefix}
                                    />
                                </div>

                                <p className="text-lg font-semibold tracking-wide text-white">
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
