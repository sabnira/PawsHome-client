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

    const statusBadge = (pet) =>
        pet.adopted ? (
            <span className="badge badge-success badge-soft shrink-0">Adopted</span>
        ) : (
            <span className="badge badge-warning badge-soft shrink-0">Available</span>
        );

    // Icon-only buttons in the table, labelled buttons in the mobile cards
    const renderActions = (pet, labeled = false) => {
        const square = labeled ? "" : "btn-square";

        return (
            <>
                <button
                    type="button"
                    onClick={() => handleToggleAdopted(pet)}
                    title={pet.adopted ? "Mark as available" : "Mark as adopted"}
                    aria-label={
                        pet.adopted
                            ? `Mark ${pet.name} as available`
                            : `Mark ${pet.name} as adopted`
                    }
                    className={`btn btn-sm btn-ghost text-green-600 ${square}`}
                >
                    {pet.adopted ? (
                        <FiRotateCcw className="text-lg" />
                    ) : (
                        <FiCheckCircle className="text-lg" />
                    )}
                    {labeled && (pet.adopted ? "Available" : "Adopted")}
                </button>

                <Link
                    to={`/dashboard/update-pet/${pet._id}`}
                    title="Edit pet"
                    aria-label={`Edit ${pet.name}`}
                    className={`btn btn-sm btn-ghost text-gray-600 ${square}`}
                >
                    <FiEdit2 className="text-lg" />
                    {labeled && "Edit"}
                </Link>

                <button
                    type="button"
                    onClick={() => handleDelete(pet)}
                    title="Delete pet"
                    aria-label={`Delete ${pet.name}`}
                    className={`btn btn-sm btn-ghost text-red-500 ${square}`}
                >
                    <FiTrash2 className="text-lg" />
                    {labeled && "Delete"}
                </button>
            </>
        );
    };

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return (
            <div className="rounded-3xl border border-red-100 bg-red-50 px-4 py-8 text-center sm:px-6 sm:py-10">
                <h2 className="text-lg font-semibold text-red-600">Could not load pets</h2>
                <p className="mt-2 break-words text-sm text-red-500">
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
            <div className="mb-5 sm:mb-6">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">All Pets</h1>
                <p className="mt-1 text-sm text-gray-500">
                    {counts.all} {counts.all === 1 ? "pet" : "pets"} listed by all users,{" "}
                    {counts.adopted} adopted
                </p>
            </div>

            {/* Filters */}
            <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <label className="input input-bordered flex w-full items-center gap-2 rounded-xl sm:w-72">
                        <FiSearch className="shrink-0 text-gray-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by pet or owner email"
                            aria-label="Search pets"
                            className="min-w-0 grow"
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

                {/* Status tabs: scroll sideways on narrow phones */}
                <div
                    role="tablist"
                    className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
                >
                    {STATUS_TABS.map((name) => (
                        <button
                            key={name}
                            type="button"
                            role="tab"
                            aria-selected={status === name}
                            onClick={() => setStatus(name)}
                            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
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
                <div className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white px-4 py-12 text-center sm:px-6 sm:py-16">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8E1] text-2xl text-[#D99A00]">
                        <FaPaw />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                        No pets found
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                        Try a different search, category or status.
                    </p>
                </div>
            ) : (
                <>
                    {/* Mobile: cards */}
                    <ul className="space-y-3 md:hidden">
                        {visiblePets.map((pet) => (
                            <li
                                key={pet._id}
                                className="rounded-3xl border border-gray-100 bg-white p-4"
                            >
                                <div className="flex gap-3">
                                    <div className="avatar shrink-0">
                                        <div className="h-20 w-20 rounded-2xl">
                                            <img
                                                src={pet.image}
                                                alt={pet.name}
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="truncate font-semibold text-gray-900">
                                                {pet.name}
                                            </p>
                                            {statusBadge(pet)}
                                        </div>

                                        <p className="mt-0.5 text-xs text-gray-500">
                                            {[pet.category, pet.age, pet.location]
                                                .filter(Boolean)
                                                .join(" · ")}
                                        </p>

                                        <p className="mt-0.5 truncate text-xs text-gray-400">
                                            Owner: {pet.ownerEmail || "—"}
                                        </p>

                                        <p className="mt-2 text-sm font-semibold text-gray-900">
                                            ${pet.price}{" "}
                                            <span className="font-normal text-gray-500">
                                                adoption fee
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap justify-end gap-1 border-t border-gray-50 pt-3">
                                    {renderActions(pet, true)}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Tablet and up: table */}
                    <div className="hidden overflow-hidden rounded-3xl border border-gray-100 bg-white md:block">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs text-gray-500">
                                        <th className="hidden w-12 xl:table-cell">#</th>
                                        <th>Pet</th>
                                        <th className="hidden xl:table-cell">Category</th>
                                        <th className="hidden xl:table-cell">Owner</th>
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
                                            <td className="hidden text-gray-400 xl:table-cell">
                                                {index + 1}
                                            </td>

                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar shrink-0">
                                                        <div className="h-14 w-14 rounded-2xl">
                                                            <img
                                                                src={pet.image}
                                                                alt={pet.name}
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-gray-900">
                                                            {pet.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {pet.age} old · {pet.location}
                                                            <span className="xl:hidden">
                                                                {" "}
                                                                · {pet.category}
                                                            </span>
                                                        </p>
                                                        <p className="break-all text-xs text-gray-400 xl:hidden">
                                                            {pet.ownerEmail || "—"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="hidden text-gray-700 xl:table-cell">
                                                {pet.category}
                                            </td>

                                            <td className="hidden text-sm text-gray-700 xl:table-cell">
                                                {pet.ownerEmail || "—"}
                                            </td>

                                            <td className="font-semibold text-gray-900">
                                                ${pet.price}
                                            </td>

                                            <td>{statusBadge(pet)}</td>

                                            <td>
                                                <div className="flex justify-end gap-2">
                                                    {renderActions(pet)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AllPets;