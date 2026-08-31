const SectionTitle = ({ title, heading }) => {
    return (
        <div className="mx-auto my-16 max-w-2xl px-4 text-center">

            {/* Heading */}
            <h2 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl md:text-5xl">
                {title}
            </h2>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-base-content/60 md:text-lg">
                {heading}
            </p>
        </div>
    );
};

export default SectionTitle;