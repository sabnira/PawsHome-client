import { Helmet } from "react-helmet-async";
import Banner from "./Banner/Banner";
import FeaturedPets from "./FeaturedPets/FeaturedPets";
import WhyPawsHome from "./WhyPawsHome";
import AdoptionCTA from "./AdoptionCTA";
import DonationCampaigns from "./Donationcampaigns";



const Home = () => {
    return (
        <div className="font-dmSans">
            <Helmet>
                <title>PawsHome | Home</title>
            </Helmet>
            <Banner></Banner>
            <div className="max-w-7xl mx-auto">
                <FeaturedPets></FeaturedPets>
                <WhyPawsHome></WhyPawsHome>
                <DonationCampaigns></DonationCampaigns>
                <AdoptionCTA></AdoptionCTA>
            </div>
            
           
        </div>
    );
};

export default Home;