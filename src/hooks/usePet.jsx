import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const usePet = (id) => {
  const axiosPublic = useAxiosPublic();

  const { data: pet = {}, isPending: loading, refetch } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/pets/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  return [pet, loading, refetch];
};

export default usePet;