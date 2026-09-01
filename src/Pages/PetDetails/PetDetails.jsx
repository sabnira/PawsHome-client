import { useParams } from "react-router-dom";
import usePets from "../../hooks/usePets";


const PetDetails = () => {

    const { id } = useParams();
    const [pet] = usePets();

    const { _id, name, image, age, location, price, gender, category } = pet;

    return (
        <div>
            <img src={image} alt={name} />
            <h2>{name}</h2>
            <p>{category}</p>
            <p>{age} old • {gender}</p>
            <p>{location}, Bangladesh</p>
            <p>${price}</p>
        </div>
    );
};

export default PetDetails;