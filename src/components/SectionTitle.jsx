import { FaPaw } from "react-icons/fa";

const SectionTitle = ({ title, heading }) => {
    return (
        <header className="mx-auto my-12 max-w-2xl px-4 text-center md:my-16">

            {/* Paw divider: lines fade out on both sides of a soft paw badge */}
            <div aria-hidden="true" className="mb-6 flex items-center justify-center gap-4">
                <span className="h-px w-16 bg-gradient-to-r from-transparent to-warning/60 sm:w-24"></span>

                <span className="flex h-12 w-12 -rotate-12 items-center justify-center rounded-full bg-warning/15 text-xl text-warning ring-4 ring-warning/10">
                    <FaPaw />
                </span>

                <span className="h-px w-16 bg-gradient-to-l from-transparent to-warning/60 sm:w-24"></span>
            </div>

            <h2 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-base-content sm:text-4xl md:text-5xl">
                {title}
            </h2>

            {heading && (
                <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-7 text-base-content/70 md:text-lg md:leading-8">
                    {heading}
                </p>
            )}
        </header>
    );
};

export default SectionTitle;