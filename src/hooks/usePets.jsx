import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const usePets = (searchParams = "", category = "") => {

    const axiosPublic = useAxiosPublic()

    //using tanstack

    const {data: pets = [], isPending: loading, refetch} = useQuery({
        queryKey: ['pets', searchParams, category],
        queryFn: async() => {
            const res = await axiosPublic.get('/pets', {
                params: { searchParams, category }
            })
            return res.data
        }
    })

    return [pets, loading, refetch]
};

export default usePets;
