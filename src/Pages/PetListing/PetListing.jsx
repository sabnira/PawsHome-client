import { FaSearch, FaDog, FaCat, FaPaw } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import listBanner from "../../assets/listBanner.png"
import PetCart from "../../components/PetCart";
import usePets from "../../hooks/usePets";
import { useState } from "react";



const PetListing = () => {

    const [searchText, setSearchText] = useState("");
    const [searchParams, setSearchParams] = useState("");
    const [category, setCategory] = useState("");

    const [pets] = usePets(searchParams, category);
    const [allPets] = usePets("", "");

    return (
        <>
            <div className="bg-base-200 py-8 px-4 sm:px-6 md:py-10 md:px-10">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-10 items-center">

                    {/* LEFT CONTENT */}
                    <div>
                        <p className="mb-3 text-sm sm:text-base">
                            Find your new pet from our animal shelters.
                        </p>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 md:mb-6 leading-tight">
                            Adopt Your <span className="text-green-700">Pretty</span> <br /> Friend
                        </h1>

                        {/* SEARCH BAR: stacked on mobile, one row on wide tablet, stacked in the half-width hero, one row on desktop */}
                        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 mb-6">

                            {/* CATEGORY */}
                            <div className="flex items-center gap-2 bg-base-100 rounded-full px-4 h-12 border border-gray-300 w-full min-w-0">
                                <BiCategory className="text-[#224fb1] shrink-0"></BiCategory>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="outline-none w-full min-w-0 bg-base-100">

                                    <option value="">Select Category</option>
                                    <option value="Dog">Dogs</option>
                                    <option value="Cat">Cats</option>
                                    <option value="Bird">Birds</option>
                                    <option value="Rabbit">Rabbits</option>
                                    <option value="Others">Others</option>

                                </select>
                            </div>

                            {/* Input */}
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search pet by name..."
                                className="input input-bordered w-full min-w-0 rounded-full"
                            />

                            {/* Button */}
                            <button
                                type="button"
                                onClick={() => setSearchParams(searchText)}
                                className="btn bg-[#F7C948] text-black rounded-full px-6 w-full sm:w-auto md:w-full lg:w-auto">
                                Search <FaSearch />
                            </button>
                        </div>

                        {/* CATEGORY */}
                        <div className="flex flex-wrap gap-x-6 gap-y-3 sm:gap-8 text-sm">

                            <div className="flex items-center gap-2">
                                <FaDog className="text-[#224fb1] text-xl" />
                                <div>
                                    <p className="font-semibold">Dogs</p>
                                    <p className="text-gray-500">
                                        ({allPets.filter(pet => pet.category === "Dog").length})
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <FaCat className="text-[#224fb1] text-xl" />
                                <div>
                                    <p className="font-semibold">Cats</p>
                                    <p className="text-gray-500">
                                        ({allPets.filter(pet => pet.category === "Cat").length})
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <FaPaw className="text-[#224fb1] text-xl" />
                                <div>
                                    <p className="font-semibold">Others Pet</p>
                                    <p className="text-gray-500">
                                        ({allPets.filter(pet => pet.category !== "Cat" && pet.category !== "Dog").length})
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT IMAGE: smaller and centered on mobile */}
                    <div className="relative flex justify-center md:justify-end">
                        <img
                            src={listBanner}
                            alt=""
                            className="w-full max-w-[16rem] sm:max-w-sm md:max-w-none md:w-125"
                        />
                    </div>

                </div>
            </div>


            {/* 2 columns on mobile and tablet, 3 on desktop */}
            <div className="max-w-7xl mx-auto grid grid-cols-2 gap-x-3 gap-y-2 px-4 sm:gap-x-6 sm:px-6 lg:grid-cols-3 lg:gap-x-12 lg:px-8 my-8 md:my-10">
                {
                    pets.map(pet => <PetCart key={pet._id} pet={pet}></PetCart>)
                }
            </div>


        </>
    );
};

export default PetListing;