import { FaLocationDot } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router-dom";


const PetCart = ({ pet }) => {

  const { _id, name, image, age, location, price, gender, category} = pet;

  return (

    <div className="card bg-base-100 rounded-4xl overflow-hidden mb-10 border border-gray-300 transition-all duration-500 ease-in-out hover:shadow-2xl hover:-translate-y-1">

      {/* Image Section */}
      <div className="relative  pb-0">

        {/* Available Badge */}
        <span className="badge badge-warning absolute top-4 right-4 px-4 py-3 text-xs font-bold tracking-widest">
          AVAILABLE
        </span>

        {/* Pet Image */}
        <img
          src={image}
          alt="pet"
          className="w-full h-60 object-cover"
        />

      </div>

      {/* Content */}
      <div className="card-body p-6 gap-3 space-y-2">

        {/* Title + Price */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-sm tracking-widest text-warning  font-semibold">
              {category}
            </p>
          </div>

          <div className="border border-warning rounded-2xl px-3 py-2 text-center ">
            <p className="text-xs text-gray-500">Adoption Fee</p>
            <p className="text-warning text-lg font-bold">${price}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-outline bg-base-200 border-gray-300 p-4 rounded-2xl">{age} old</span>
          <span className="badge badge-outline bg-base-200 border-gray-300 p-4 rounded-2xl">{gender}</span>
          <span className="badge badge-outline bg-[#EEBA2C]/40 border-none p-4 rounded-2xl">Healthy</span>
        </div>

        {/* Location */}
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <FaLocationDot className="text-red-500" /> {location}, Bangladesh
        </p>

        {/* Vaccinated Box */}
        <div className="flex items-center justify-between border rounded-2xl p-3 bg-base-200 border-gray-300">
          <div>
            <p className="font-semibold text-sm">Fully Vaccinated</p>
            <p className="text-xs text-gray-500">Health checked & safe</p>
          </div>
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        </div>

        {/* Buttons */}
        <Link to="/pet-details" className="btn btn-outline btn-lg rounded-full border-gray-300">
          View Details <FaLongArrowAltRight />
        </Link>

         <Link to={`/pet-details/${_id}`} 
         className="group btn btn-lg bg-warning text-black rounded-full border-none transition-all duration-300 ease-in-out hover:bg-warning/80">
          Adopt Now
          <FaHeart className="text-red-500 transition-transform duration-400 group-hover:scale-140" />
         </Link>

      </div>
    </div>
  );
};

export default PetCart;