
import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'https://paws-home-server-mu.vercel.app/'
})


const useAxiosPublic = () => {
    return axiosPublic
};

export default useAxiosPublic;