
import SectionTitle from "../../../components/SectionTitle";
import usePets from "../../../hooks/usePets";
import PetCart from "../../../components/PetCart";
import { MdArrowRightAlt } from "react-icons/md";
import { Link } from "react-router-dom";

const FeaturedPets = () => {

    const [pets] = usePets();

    const featuredPets = pets.slice(0, 6);

    return (
        <div>

            <SectionTitle
                title={"Featured Pets"}
                heading={"Browse a curated selection of pets ready to be adopted. Each one is healthy, well-loved, and eagerly waiting for a forever home filled with care and affection."}
            ></SectionTitle>

            <div className="grid md:grid-cols-3 gap-12">
                {
                    featuredPets.map(pet => <PetCart key={pet._id} pet={pet}></PetCart>)
                }
            </div>

            <div className="flex justify-center">

                <Link
                    to="/pet-listing"
                    className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-warning/10 font-semibold transition-all duration-300 hover:bg-warning hover:gap-3"
                >
                    View All Pets
                    <MdArrowRightAlt className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

            </div>



        </div>
    );
};

export default FeaturedPets;