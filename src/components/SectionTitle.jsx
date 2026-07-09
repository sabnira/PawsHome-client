const SectionTitle = ({title, heading, subHeading}) => {
    return (
        <div className="mx-auto text-center md:w-6/12 my-12">
            <p className="text-[#EEBA2C] mb-4 text-2xl font-berkshire">--- {title} ---</p>
            <p className="text-xl md:text-3xl uppercase border-y-2 py-4">{subHeading}</p>
            <h3 className="mt-4">{heading}</h3>
        </div>
    );
};

export default SectionTitle;