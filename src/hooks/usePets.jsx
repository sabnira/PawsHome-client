import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const usePets = () => {

    const axiosPublic = useAxiosPublic()

    //using tanstack

    const {data: pets = [], isPending: loading, refetch} = useQuery({
        queryKey: ['pets'],
        queryFn: async() => {
            const res = await axiosPublic.get('/pets')
            return res.data
        }
    })

    return [pets, loading, refetch]
};

export default usePets;