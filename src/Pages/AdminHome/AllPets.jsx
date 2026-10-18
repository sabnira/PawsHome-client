import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2, FiCheckCircle, FiRotateCcw, FiSearch } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";

const STATUS_TABS = ["all", "available", "adopted"];

const AllPets = () => {
    const axiosSecure = useAxiosSecure();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [status, setStatus] = useState("all");

    const {
        data: pets = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["all-pets"],
        queryFn: async () => {
            const res = await axiosSecure.get("/pets");
            return res.data;
        },
    });

    const categories = [...new Set(pets.map((p) => p.category).filter(Boolean))].sort();

    const counts = {
        all: pets.length,
        available: pets.filter((p) => !p.adopted).length,
        adopted: pets.filter((p) => p.adopted).length,
    };

    const query = search.trim().toLowerCase();
    const visiblePets = pets.filter((p) => {
        const matchesStatus =
            status === "all" || (status === "adopted" ? p.adopted : !p.adopted);
        const matchesCategory = category === "all" || p.category === category;
        const matchesSearch =
            !query ||
            p.name?.toLowerCase().includes(query) ||
            p.ownerEmail?.toLowerCase().includes(query);
        return matchesStatus && matchesCategory && matchesSearch;
    });

    const handleToggleAdopted = async (pet) => {
        const markAdopted = !pet.adopted;

        const result = await Swal.fire({
            title: markAdopted
                ? `Mark ${pet.name} as adopted?`
                : `Mark ${pet.name} as available?`,
            text: markAdopted
                ? "The pet will no longer be shown as available."
                : "The pet will be listed as available again.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#43934A",
            cancelButtonColor: "#6b7280",
            confirmButtonText: markAdopted ? "Mark as adopted" : "Mark as available",
        });

        if (!result.isConfirmed) return;

        try {
            await axiosSecure.patch(`/pets/${pet._id}/adopted`, { adopted: markAdopted });
            refetch();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Could not update status",
                text: err.response?.data?.message || "Please try again.",
            });
        }
    };

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
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Could not delete pet",
                text: err.response?.data?.message || "Please try again.",
            });
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return (
            <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-10 text-center">
                <h2 className="text-lg font-semibold text-red-600">Could not load pets</h2>
                <p className="mt-2 text-sm text-red-500">
                    {error.response?.data?.message || error.message}
                </p>
            </div>
        );
    }

    return (
        <div>
            <Helmet>
                <title>PawsHome | All Pets</title>
            </Helmet>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">All Pets</h1>
                <p className="mt-1 text-sm text-gray-500">
                    {counts.all} {counts.all === 1 ? "pet" : "pets"} listed by all users,{" "}
                    {counts.adopted} adopted
                </p>
            </div>

            {/* Filters */}
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <label className="input input-bordered flex w-full items-center gap-2 rounded-xl sm:w-72">
                        <FiSearch className="text-gray-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by pet or owner email"
                            aria-label="Search pets"
                            className="grow"
                        />
                    </label>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        aria-label="Filter by category"
                        className="select select-bordered w-full rounded-xl sm:w-48"
                    >
                        <option value="all">All categories</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <div role="tablist" className="flex flex-wrap gap-2">
                    {STATUS_TABS.map((name) => (
                        <button
                            key={name}
                            type="button"
                            role="tab"
                            aria-selected={status === name}
                            onClick={() => setStatus(name)}
                            className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                                status === name
                                    ? "bg-[#F7C948] text-black"
                                    : "bg-white text-gray-600 hover:bg-[#FFF8E1]"
                            }`}
                        >
                            {name} ({counts[name]})
                        </button>
                    ))}
                </div>
            </div>

            {/* Empty state */}
            {visiblePets.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8E1] text-2xl text-[#D99A00]">
                        <FaPaw />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">No pets found</h2>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                        Try a different search, category or status.
                    </p>
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
                                    <th>Owner</th>
                                    <th>Adoption fee</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {visiblePets.map((pet, index) => (
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
                                                        {pet.age} old · {pet.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="text-gray-700">{pet.category}</td>

                                        <td className="text-sm text-gray-700">
                                            {pet.ownerEmail || "—"}
                                        </td>

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
                                                    onClick={() => handleToggleAdopted(pet)}
                                                    title={
                                                        pet.adopted
                                                            ? "Mark as available"
                                                            : "Mark as adopted"
                                                    }
                                                    aria-label={
                                                        pet.adopted
                                                            ? `Mark ${pet.name} as available`
                                                            : `Mark ${pet.name} as adopted`
                                                    }
                                                    className="btn btn-sm btn-ghost btn-square text-green-600"
                                                >
                                                    {pet.adopted ? (
                                                        <FiRotateCcw className="text-lg" />
                                                    ) : (
                                                        <FiCheckCircle className="text-lg" />
                                                    )}
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

export default AllPets;