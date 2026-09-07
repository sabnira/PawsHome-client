import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useDonationPet = (id) => {

    const axiosPublic = useAxiosPublic();

    const { data: donationPet = {}, isPending: loading, refetch } = useQuery({
        queryKey: ["donationPet", id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/donationPet/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    return [donationPet, loading, refetch];
};

export default useDonationPet;

