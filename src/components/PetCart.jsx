import img from "../assets/img1.jpg"
import { FaLocationDot } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { FaLongArrowAltRight } from "react-icons/fa";

const PetCart = () => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl rounded-3xl overflow-hidden">

      {/* Image Section */}
      <div className="relative  pb-0">

        {/* Available Badge */}
        <span className="badge badge-warning absolute top-4 right-4 px-4 py-3 text-xs font-bold tracking-widest">
          AVAILABLE
        </span>

        {/* Pet Image */}
        <img
          src={img}
          alt="pet"
          className="w-full h-60 object-cover"
        />

      </div>

      {/* Content */}
      <div className="card-body p-5 gap-3">

        {/* Title + Price */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Max</h2>
            <p className="text-xs tracking-widest text-green-500 font-semibold">
              DOG
            </p>
          </div>

          <div className="border border-warning rounded-2xl px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Adoption Fee</p>
            <p className="text-warning text-lg font-bold">$150</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-outline">4 Years Old</span>
          <span className="badge badge-outline">Male</span>
          <span className="badge badge-outline">Healthy</span>
        </div>

        {/* Location */}
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <FaLocationDot className="text-red-500"/> Chattogram, Bangladesh
        </p>

        {/* Vaccinated Box */}
        <div className="flex items-center justify-between border rounded-xl p-3">
          <div>
            <p className="font-semibold text-sm">Fully Vaccinated</p>
            <p className="text-xs text-gray-500">Health checked & safe</p>
          </div>
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        </div>

        {/* Buttons */}
        <button className="btn btn-outline rounded-full">
          View Details <FaLongArrowAltRight />
        </button>

        <button className="btn bg-warning text-black rounded-full border-none">
          Adopt Now <FaHeart className="text-red-500"/>
        </button>

      </div>
    </div>
  );
};

export default PetCart;