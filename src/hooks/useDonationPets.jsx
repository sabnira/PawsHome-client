import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useDonationPets = () => {

    const axiosPublic = useAxiosPublic()

    //using tanstack

    const {data: donationPets = [], isPending: loading, refetch} = useQuery({
        queryKey: ['donationPets'],
        queryFn: async() => {
            const res = await axiosPublic.get('/donationPets')
            return res.data
        }
    })

    return [donationPets, loading, refetch]
};

export default useDonationPets;
