import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Main from "../Layout/Main";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Register from "../Pages/Register/Register";
import Login from "../Pages/Login/Login";
import PetListing from "../Pages/PetListing/PetListing";
import PetDetails from "../Pages/PetDetails/PetDetails";
import DonationPets from "../Pages/DonationPets/DonationPets";
import DonationDetails from "../Pages/DonationDetails/DonationDetails";
import Dashboard from "../Layout/Dashboard";
import AdminRoute from "./AdminRoute";
import UserDashboard from "../Pages/UserDashboard/UserDashboard";




const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: 'register',
                element: <Register></Register>
            },
            {
                path: 'login',
                element: <Login></Login>
            },
            {
                path: 'pet-listing',
                element: <PetListing></PetListing>
            },
            {
                path: 'pet-details/:id',
                element: <PetDetails></PetDetails>
            },
            {
                path: 'donation-pets',
                element: <DonationPets></DonationPets>
            },
            {
                path: 'donation-details/:id',
                element: <DonationDetails></DonationDetails>
            },
        ]
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
        children: [

            // User + Admin
            {
                index: true,
                element: <UserDashboard></UserDashboard>
            },
            {
                path: "add-pet",
                // element: <AddPet />
            },
            {
                path: "my-pets",
                // element: <MyAddedPets />
            },
            {
                path: "adoption-requests",
                // element: <AdoptionRequests />
            },
            {
                path: "create-campaign",
                // element: <CreateCampaign />
            },
            {
                path: "my-campaigns",
                // element: <MyCampaigns />
            },
            {
                path: "my-donations",
                // element: <MyDonations />
            },


            // Admin only
            {
                element: <AdminRoute />,
                children: [
                    {
                        path: "users",
                        // element: <Users />
                    },
                    {
                        path: "all-pets",
                        // element: <AllPets />
                    },
                    {
                        path: "all-donations",
                        // element: <AllDonations />
                    }
                ]
            }
        ]
    }
]);


export default router;