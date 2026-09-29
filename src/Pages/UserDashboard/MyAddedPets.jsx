import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowUpDown,
    Check,
    Pencil,
    Trash2,
} from "lucide-react";
import {
    createSortedRowModel,
    rowSortingFeature,
    tableFeatures,
    useTable,
} from "@tanstack/react-table";
import Swal from "sweetalert2";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../providers/AuthProvider";


// TanStack Table v9 sorting feature
const features = tableFeatures({
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
});


const MyAddedPets = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);


    // ==========================================
    // GET MY ADDED PETS
    // ==========================================
    useEffect(() => {
        if (!user?.email) return;

        const fetchMyPets = async () => {
            try {
                setLoading(true);

                const res = await axiosSecure.get(
                    `/my-pets?email=${encodeURIComponent(user.email)}`
                );

                const petsWithSerial = res.data.map(
                    (pet, index) => ({
                        ...pet,
                        serialNumber: index + 1,
                    })
                );

                setPets(petsWithSerial);
            } catch (error) {
                console.error(
                    "Error loading my pets:",
                    error
                );

                Swal.fire({
                    icon: "error",
                    title: "Failed to Load Pets",
                    text:
                        error.response?.data?.message ||
                        "Something went wrong while loading your pets.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchMyPets();
    }, [user?.email, axiosSecure]);


    // ==========================================
    // DELETE PET
    // ==========================================
    const handleDelete = async (pet) => {
        const result = await Swal.fire({
            title: "Delete Pet?",
            text: `Are you sure you want to delete ${pet.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6b7280",
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            Swal.fire({
                title: "Deleting...",
                text: "Please wait while the pet is being deleted.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            await axiosSecure.delete(
                `/pets/${pet._id}`
            );

            setPets((previousPets) =>
                previousPets.filter(
                    (item) => item._id !== pet._id
                )
            );

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: `${pet.name} has been deleted successfully.`,
                confirmButtonText: "OK",
                confirmButtonColor: "#F7C948",
            });
        } catch (error) {
            console.error(
                "Error deleting pet:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text:
                    error.response?.data?.message ||
                    "Failed to delete the pet.",
            });
        }
    };


    // ==========================================
    // MARK PET AS ADOPTED
    // ==========================================
    const handleAdopted = async (pet) => {
        // Already adopted
        if (pet.adopted === true) {
            return;
        }

        const result = await Swal.fire({
            title: "Mark as Adopted?",
            text: `Are you sure ${pet.name} has been adopted?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: "#F7C948",
            cancelButtonColor: "#6b7280",
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            Swal.fire({
                title: "Updating...",
                text: "Please wait while the adoption status is being updated.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            // MongoDB:
            // adopted: false -> true
            await axiosSecure.patch(
                `/pets/${pet._id}/adopted`
            );

            // Update the table immediately
            setPets((previousPets) =>
                previousPets.map((item) =>
                    item._id === pet._id
                        ? {
                            ...item,
                            adopted: true,
                        }
                        : item
                )
            );

            Swal.fire({
                icon: "success",
                title: "Adopted!",
                text: `${pet.name} has been marked as adopted.`,
                confirmButtonText: "OK",
                confirmButtonColor: "#F7C948",
            });
        } catch (error) {
            console.error(
                "Error updating adoption status:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text:
                    error.response?.data?.message ||
                    "Failed to update adoption status.",
            });
        }
    };


    // ==========================================
    // TABLE COLUMNS
    // ==========================================
    const columns = [
        // --------------------------------------
        // SERIAL NUMBER
        // --------------------------------------
        {
            accessorKey: "serialNumber",

            header: ({ column }) => (
                <button
                    type="button"
                    onClick={column.getToggleSortingHandler()}
                    className="flex items-center gap-1 font-semibold"
                >
                    Serial Number
                    <ArrowUpDown size={15} />
                </button>
            ),

            cell: ({ row }) =>
                row.original.serialNumber,
        },


        // --------------------------------------
        // PET NAME
        // --------------------------------------
        {
            accessorKey: "name",

            header: ({ column }) => (
                <button
                    type="button"
                    onClick={column.getToggleSortingHandler()}
                    className="flex items-center gap-1 font-semibold"
                >
                    Pet Name
                    <ArrowUpDown size={15} />
                </button>
            ),

            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.name}
                </span>
            ),
        },


        // --------------------------------------
        // PET CATEGORY
        // --------------------------------------
        {
            accessorKey: "category",

            header: ({ column }) => (
                <button
                    type="button"
                    onClick={column.getToggleSortingHandler()}
                    className="flex items-center gap-1 font-semibold"
                >
                    Pet Category
                    <ArrowUpDown size={15} />
                </button>
            ),

            cell: ({ row }) => (
                <span className="capitalize">
                    {row.original.category}
                </span>
            ),
        },


        // --------------------------------------
        // PET IMAGE
        // --------------------------------------
        {
            accessorKey: "image",

            header: ({ column }) => (
                <button
                    type="button"
                    onClick={column.getToggleSortingHandler()}
                    className="flex items-center gap-1 font-semibold"
                >
                    Pet Image
                    <ArrowUpDown size={15} />
                </button>
            ),

            cell: ({ row }) => (
                <img
                    src={row.original.image}
                    alt={row.original.name}
                    className="h-14 w-14 rounded-lg object-cover"
                />
            ),
        },


        // --------------------------------------
        // ADOPTION STATUS
        // --------------------------------------
        {
            accessorKey: "adopted",

            header: ({ column }) => (
                <button
                    type="button"
                    onClick={column.getToggleSortingHandler()}
                    className="flex items-center gap-1 font-semibold"
                >
                    Adoption Status
                    <ArrowUpDown size={15} />
                </button>
            ),

            cell: ({ row }) => {
                const adopted =
                    row.original.adopted === true;

                return (
                    <span
                        className={`badge ${adopted
                            ? "badge-success"
                            : "badge-warning"
                            }`}
                    >
                        {adopted
                            ? "Adopted"
                            : "Not Adopted"}
                    </span>
                );
            },
        },


        // --------------------------------------
        // THREE ACTION BUTTONS
        // --------------------------------------
        {
            id: "actions",

            header: "Actions",

            enableSorting: false,

            cell: ({ row }) => {
                const pet = row.original;

                const isAdopted =
                    pet.adopted === true;

                return (
                    <div className="flex flex-wrap gap-2">

                        {/* UPDATE BUTTON */}
                        <Link
                            to={`/dashboard/update-pet/${pet._id}`}
                            className="btn btn-sm btn-outline"
                        >
                            <Pencil size={15} />
                            Update
                        </Link>


                        {/* DELETE BUTTON */}
                        <button
                            type="button"
                            onClick={() =>
                                handleDelete(pet)
                            }
                            className="btn btn-sm btn-error btn-outline"
                        >
                            <Trash2 size={15} />
                            Delete
                        </button>

                        <button
                            type="button"
                            onClick={() => handleAdopted(pet)}
                            disabled={isAdopted}
                            className={`btn btn-sm ${isAdopted
                                    ? "cursor-not-allowed border-gray-300 bg-gray-300 text-gray-500"
                                    : "border-[#F7C948] bg-[#F7C948] text-black hover:bg-[#eab93f]"
                                }`}
                        >
                            <Check size={15} />
                            Adopted
                        </button>

                    </div>
                );
            },
        },
    ];


    // ==========================================
    // CREATE TABLE
    // ==========================================
    const table = useTable({
        key: "my-added-pets",
        features,
        columns,
        data: pets,
    });


    // ==========================================
    // LOADING
    // ==========================================
    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================
    return (
        <div className="p-4 md:p-6">

            {/* PAGE HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold md:text-3xl">
                    My Added Pets
                </h1>

                <p className="mt-1 text-gray-500">
                    Manage the pets you have added for
                    adoption.
                </p>
            </div>


            {/* NO PETS */}
            {pets.length === 0 ? (
                <div className="rounded-xl border bg-base-100 p-10 text-center shadow-sm">

                    <h2 className="text-xl font-semibold">
                        No Pets Added Yet
                    </h2>

                    <p className="mt-2 text-gray-500">
                        You have not added any pets yet.
                    </p>

                    <Link
                        to="/dashboard/add-pet"
                        className="btn mt-5 border-[#F7C948] bg-[#F7C948] text-black hover:bg-[#eab93f]"
                    >
                        Add a Pet
                    </Link>

                </div>
            ) : (

                /* TABLE */
                <div className="overflow-x-auto rounded-xl border bg-base-100 shadow-sm">

                    <table className="table">

                        {/* TABLE HEADER */}
                        <thead>
                            {table
                                .getHeaderGroups()
                                .map((headerGroup) => (
                                    <tr
                                        key={headerGroup.id}
                                    >
                                        {headerGroup.headers.map(
                                            (header) => (
                                                <th
                                                    key={
                                                        header.id
                                                    }
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : (
                                                            <table.FlexRender
                                                                header={
                                                                    header
                                                                }
                                                            />
                                                        )}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                ))}
                        </thead>


                        {/* TABLE BODY */}
                        <tbody>
                            {table
                                .getRowModel()
                                .rows.map((row) => (
                                    <tr key={row.id}>

                                        {row
                                            .getAllCells()
                                            .map(
                                                (
                                                    cell
                                                ) => (
                                                    <td
                                                        key={
                                                            cell.id
                                                        }
                                                    >
                                                        <table.FlexRender
                                                            cell={
                                                                cell
                                                            }
                                                        />
                                                    </td>
                                                )
                                            )}

                                    </tr>
                                ))}
                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
};

export default MyAddedPets;