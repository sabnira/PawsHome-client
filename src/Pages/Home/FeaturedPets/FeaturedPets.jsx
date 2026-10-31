import SectionTitle from "../../../components/SectionTitle";
import usePets from "../../../hooks/usePets";
import PetCart from "../../../components/PetCart";
import { MdArrowRightAlt } from "react-icons/md";
import { Link } from "react-router-dom";

const FeaturedPets = () => {

    const [pets] = usePets();

    const featuredPets = pets.slice(0, 4);

    return (
        <section>

            <SectionTitle title={"Featured Pets"}></SectionTitle>

            {/* 2 columns on mobile and tablet, 3 on desktop */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-12">
                {
                    featuredPets.map((pet, index) => (
                        <div
                            key={pet._id}
                            className={index === 3 ? "contents lg:hidden" : "contents"}
                        >
                            <PetCart pet={pet}></PetCart>
                        </div>
                    ))
                }
            </div>

            <div className="mt-2 flex justify-center md:mt-4">

                <Link
                    to="/pet-listing"
                    className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-warning/10 font-semibold transition-all duration-300 hover:bg-warning hover:gap-3"
                >
                    View All Pets
                    <MdArrowRightAlt className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

            </div>

        </section>
    );
};

export default FeaturedPets;