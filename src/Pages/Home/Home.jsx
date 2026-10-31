import { Helmet } from "react-helmet-async";
import Banner from "./Banner/Banner";
import FeaturedPets from "./FeaturedPets/FeaturedPets";
import WhyPawsHome from "./WhyPawsHome";
import AdoptionCTA from "./AdoptionCTA";
import Testimonials from "./Testimonials ";
import DonationCampaigns from "./DonationCampaigns";
import Stats from "./Stats";




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
                <Testimonials></Testimonials>
                <DonationCampaigns></DonationCampaigns>
                <Stats></Stats>
                <AdoptionCTA></AdoptionCTA>
            </div>
            
           
        </div>
    );
};

export default Home;