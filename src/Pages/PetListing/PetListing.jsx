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
            <div className="bg-base-200 py-10 px-4 md:px-10">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

                    {/* LEFT CONTENT */}
                    <div>
                        <p className="mb-3">
                            Find your new pet from our animal shelters.
                        </p>

                        <h1 className="text-4xl md:text-5xl font-bold  mb-6 leading-tight">
                            Adopt Your <span className="text-green-500">Pretty</span> <br /> Friend
                        </h1>

                        {/* SEARCH BAR */}
                        <div className="flex flex-col md:flex-row gap-3 mb-6">

                            {/* CATEGORY */}
                            <div className="flex items-center gap-2 bg-base-100 rounded-full px-4 border border-gray-300 w-full">
                                <BiCategory className="text-[#224fb1]"></BiCategory>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="outline-none w-full bg-base-100">

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
                                className="input input-bordered w-full rounded-full"
                            />

                            {/* Button */}
                            <button
                                type="button"
                                onClick={() => setSearchParams(searchText)}
                                className="btn bg-green-500 text-white rounded-full px-6">
                                Search <FaSearch />
                            </button>
                        </div>

                        {/* CATEGORY */}
                        <div className="flex gap-8 text-sm">

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

                    {/* RIGHT IMAGE */}
                    <div className="relative flex justify-end">
                        <img src={listBanner} alt="" className="w-125" />
                    </div>

                </div>
            </div>


            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 my-10">
                {
                    pets.map(pet => <PetCart key={pet._id} pet={pet}></PetCart>)
                }
            </div>

     
        </>
    );
};

export default PetListing;
