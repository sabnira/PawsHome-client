import { FaLocationDot } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router-dom";


const PetCart = ({ pet }) => {

  const { _id, name, image, age, location, price, gender, category } = pet;

  return (

    <div className="card bg-base-100 rounded-3xl sm:rounded-4xl overflow-hidden mb-4 sm:mb-6 md:mb-10 border border-gray-300 transition-all duration-500 ease-in-out hover:shadow-2xl hover:-translate-y-1">

      {/* Image Section */}
      <div className="relative pb-0">

        {/* Available Badge */}
        <span className="badge badge-warning absolute top-2 right-2 sm:top-4 sm:right-4 px-2 sm:px-4 py-2.5 sm:py-3 text-[9px] sm:text-xs font-bold tracking-wider sm:tracking-widest">
          AVAILABLE
        </span>

        {/* Pet Image */}
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-32 sm:h-56 lg:h-60 object-cover"
        />

      </div>

      {/* Content */}
      <div className="card-body flex-1 p-3 sm:p-5 lg:p-6 gap-2 sm:gap-3 space-y-0 sm:space-y-2">

        {/* Title + Price */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="min-w-0 space-y-0.5 sm:space-y-2">
            <h2 className="text-base sm:text-2xl font-bold truncate">{name}</h2>
            <p className="text-[10px] sm:text-sm tracking-wider sm:tracking-widest text-warning font-semibold truncate">
              {category}
            </p>
          </div>

          {/* Price: one line on mobile, boxed on tablet and up */}
          <div className="flex items-center justify-between gap-2 border border-warning rounded-xl sm:rounded-2xl px-2 py-1 sm:block sm:shrink-0 sm:px-3 sm:py-2 sm:text-center">
            <p className="text-[10px] sm:text-xs text-gray-500">Adoption Fee</p>
            <p className="text-warning text-sm sm:text-lg font-bold">${price}</p>
          </div>
        </div>

        {/* Tags (Healthy tag hidden on mobile to save space) */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <span className="badge badge-outline bg-base-200 border-gray-300 px-2 py-2.5 sm:p-4 text-[10px] sm:text-sm rounded-xl sm:rounded-2xl">{age} old</span>
          <span className="badge badge-outline bg-base-200 border-gray-300 px-2 py-2.5 sm:p-4 text-[10px] sm:text-sm rounded-xl sm:rounded-2xl">{gender}</span>
          <span className="badge badge-outline hidden sm:inline-flex bg-[#EEBA2C]/40 border-none sm:p-4 sm:text-sm rounded-2xl">Healthy</span>
        </div>

        {/* Location */}
        <p className="text-[11px] sm:text-sm text-gray-500 flex items-start gap-1">
          <FaLocationDot className="text-red-500 mt-0.5 sm:mt-1 shrink-0" />
          <span className="line-clamp-2">{location}, Bangladesh</span>
        </p>

        {/* Vaccinated Box (hidden on mobile) */}
        <div className="hidden sm:flex items-center justify-between gap-3 border rounded-2xl p-3 bg-base-200 border-gray-300">
          <div>
            <p className="font-semibold text-sm">Fully Vaccinated</p>
            <p className="text-xs text-gray-500">Health checked & safe</p>
          </div>
          <span className="w-2 h-2 shrink-0 bg-green-500 rounded-full"></span>
        </div>

        {/* Buttons: stacked on mobile, side by side on tablet, stacked again on desktop */}
        <div className="mt-auto grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2 sm:gap-3 lg:grid-cols-1">

          <Link
            to={`/pet-details/${_id}`}
            className="btn btn-outline btn-sm sm:btn-md lg:btn-lg rounded-full border-gray-300 px-3 text-xs sm:text-sm lg:text-base whitespace-nowrap"
          >
            <span className="lg:hidden">Details</span>
            <span className="hidden lg:inline">View Details</span>
            <FaLongArrowAltRight />
          </Link>

          <Link
            to={`/pet-details/${_id}`}
            className="group btn btn-sm sm:btn-md lg:btn-lg bg-warning text-black rounded-full border-none px-3 text-xs sm:text-sm lg:text-base whitespace-nowrap transition-all duration-300 ease-in-out hover:bg-warning/80"
          >
            Adopt Now
            <FaHeart className="text-red-500 transition-transform duration-400 group-hover:scale-140" />
          </Link>

        </div>

      </div>
    </div>
  );
};

export default PetCart;