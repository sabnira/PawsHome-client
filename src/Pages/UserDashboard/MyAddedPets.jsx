import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2, FiCheckCircle, FiPlusCircle } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";

const MyAddedPets = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const {
        data: pets = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["my-pets", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-pets?email=${user.email}`);
            return res.data;
        },
    });

    const handleDelete = async (pet) => {
        const result = await Swal.fire({
            title: `Delete ${pet.name}?`,
            text: "This pet will be removed permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e53e3e",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Delete pet",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.delete(`/pets/${pet._id}`);
            if (res.data.deletedCount > 0) {
                refetch();
                Swal.fire({
                    icon: "success",
                    title: "Pet deleted",
                    text: `${pet.name} has been removed.`,
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Could not delete pet",
                text: error.response?.data?.message || "Please try again.",
            });
        }
    };

    const handleAdopted = async (pet) => {
        const result = await Swal.fire({
            title: `Mark ${pet.name} as adopted?`,
            text: "The pet will no longer be shown as available.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#43934A",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Mark as adopted",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.patch(`/pets/${pet._id}/adopted`);
            if (res.data.modifiedCount > 0) {
                refetch();
                Swal.fire({
                    icon: "success",
                    title: "Marked as adopted",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Could not update status",
                text: error.response?.data?.message || "Please try again.",
            });
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <Helmet>
                <title>PawsHome | My Added Pets</title>
            </Helmet>

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        My Added Pets
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {pets.length} {pets.length === 1 ? "pet" : "pets"} listed for adoption
                    </p>
                </div>

                <Link
                    to="/dashboard/add-pet"
                    className="btn btn-warning rounded-xl text-black"
                >
                    <FiPlusCircle className="text-lg" />
                    Add a pet
                </Link>
            </div>

            {/* Empty state */}
            {pets.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8E1] text-2xl text-[#D99A00]">
                        <FaPaw />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        You haven't added any pets yet
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                        Add your first pet and adopters will be able to find it and send requests.
                    </p>
                    <Link
                        to="/dashboard/add-pet"
                        className="btn btn-warning mt-6 rounded-xl text-black"
                    >
                        Add a pet
                    </Link>
                </div>
            ) : (
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs text-gray-500">
                                    <th className="w-12">#</th>
                                    <th>Pet</th>
                                    <th>Category</th>
                                    <th>Age</th>
                                    <th>Adoption fee</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pets.map((pet, index) => (
                                    <tr
                                        key={pet._id}
                                        className="border-b border-gray-50 last:border-0"
                                    >
                                        <td className="text-gray-400">{index + 1}</td>

                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="h-14 w-14 rounded-2xl">
                                                        <img
                                                            src={pet.image}
                                                            alt={pet.name}
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {pet.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {pet.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="text-gray-700">{pet.category}</td>
                                        <td className="text-gray-700">{pet.age}</td>
                                        <td className="font-semibold text-gray-900">
                                            ${pet.price}
                                        </td>

                                        <td>
                                            {pet.adopted ? (
                                                <span className="badge badge-success badge-soft">
                                                    Adopted
                                                </span>
                                            ) : (
                                                <span className="badge badge-warning badge-soft">
                                                    Available
                                                </span>
                                            )}
                                        </td>

                                        <td>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAdopted(pet)}
                                                    disabled={pet.adopted}
                                                    title="Mark as adopted"
                                                    aria-label={`Mark ${pet.name} as adopted`}
                                                    className="btn btn-sm btn-ghost btn-square text-green-600 disabled:opacity-30"
                                                >
                                                    <FiCheckCircle className="text-lg" />
                                                </button>

                                                <Link
                                                    to={`/dashboard/update-pet/${pet._id}`}
                                                    title="Edit pet"
                                                    aria-label={`Edit ${pet.name}`}
                                                    className="btn btn-sm btn-ghost btn-square text-gray-600"
                                                >
                                                    <FiEdit2 className="text-lg" />
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(pet)}
                                                    title="Delete pet"
                                                    aria-label={`Delete ${pet.name}`}
                                                    className="btn btn-sm btn-ghost btn-square text-red-500"
                                                >
                                                    <FiTrash2 className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAddedPets;