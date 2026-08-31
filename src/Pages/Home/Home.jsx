import { Helmet } from "react-helmet-async";
import Banner from "./Banner/Banner";
import FeaturedPets from "./FeaturedPets/FeaturedPets";



const Home = () => {
    return (
        <div>
            <Helmet>
                <title>PawsHome | Home</title>
            </Helmet>
            <Banner></Banner>
            <div className="max-w-7xl mx-auto">
                <FeaturedPets></FeaturedPets>
            </div>
            
           
        </div>
    );
};

export default Home;