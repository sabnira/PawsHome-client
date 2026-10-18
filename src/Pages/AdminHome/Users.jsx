import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { FiSearch, FiShield, FiShieldOff, FiUsers } from "react-icons/fi";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";

const FILTERS = ["all", "admin", "user"];

const Users = () => {
    const { user: currentUser } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const {
        data: users = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data;
        },
    });

    const getRole = (u) => u.role || "user";

    const counts = {
        all: users.length,
        admin: users.filter((u) => getRole(u) === "admin").length,
        user: users.filter((u) => getRole(u) !== "admin").length,
    };

    const query = search.trim().toLowerCase();
    const visibleUsers = users.filter((u) => {
        const matchesFilter =
            filter === "all" ||
            (filter === "admin" ? getRole(u) === "admin" : getRole(u) !== "admin");
        const matchesSearch =
            !query ||
            u.name?.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
    });

    const handleRoleChange = async (target) => {
        const makeAdmin = getRole(target) !== "admin";

        const result = await Swal.fire({
            title: makeAdmin ? "Make this user an admin?" : "Remove admin access?",
            text: makeAdmin
                ? `${target.name || target.email} will be able to manage users, pets and donations.`
                : `${target.name || target.email} will become a regular user.`,
            icon: makeAdmin ? "question" : "warning",
            showCancelButton: true,
            confirmButtonColor: makeAdmin ? "#43934A" : "#e53e3e",
            cancelButtonColor: "#6b7280",
            confirmButtonText: makeAdmin ? "Make admin" : "Remove admin",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.patch(`/users/${target._id}/role`, {
                role: makeAdmin ? "admin" : "user",
            });

            if (res.data.modifiedCount > 0) {
                refetch();
                Swal.fire({
                    icon: "success",
                    title: makeAdmin ? "Admin added" : "Admin removed",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Could not change role",
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
                <h2 className="text-lg font-semibold text-red-600">
                    Could not load users
                </h2>
                <p className="mt-2 text-sm text-red-500">
                    {error.response?.data?.message || error.message}
                </p>
            </div>
        );
    }

    return (
        <div>
            <Helmet>
                <title>PawsHome | Users</title>
            </Helmet>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Users</h1>
                <p className="mt-1 text-sm text-gray-500">
                    {counts.all} registered {counts.all === 1 ? "user" : "users"},{" "}
                    {counts.admin} {counts.admin === 1 ? "admin" : "admins"}
                </p>
            </div>

            {/* Search + filter */}
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <label className="input input-bordered flex w-full items-center gap-2 rounded-xl md:max-w-sm">
                    <FiSearch className="text-gray-400" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email"
                        aria-label="Search users"
                        className="grow"
                    />
                </label>

                <div role="tablist" className="flex flex-wrap gap-2">
                    {FILTERS.map((name) => (
                        <button
                            key={name}
                            type="button"
                            role="tab"
                            aria-selected={filter === name}
                            onClick={() => setFilter(name)}
                            className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                                filter === name
                                    ? "bg-[#F7C948] text-black"
                                    : "bg-white text-gray-600 hover:bg-[#FFF8E1]"
                            }`}
                        >
                            {name === "user" ? "users" : name === "admin" ? "admins" : "all"} (
                            {counts[name]})
                        </button>
                    ))}
                </div>
            </div>

            {/* Empty state */}
            {visibleUsers.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8E1] text-2xl text-[#D99A00]">
                        <FiUsers />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">No users found</h2>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                        Try a different name or email, or switch the filter.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs text-gray-500">
                                    <th className="w-12">#</th>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {visibleUsers.map((u, index) => {
                                    const isAdminUser = getRole(u) === "admin";
                                    const isSelf = u.email === currentUser?.email;

                                    return (
                                        <tr
                                            key={u._id}
                                            className="border-b border-gray-50 last:border-0"
                                        >
                                            <td className="text-gray-400">{index + 1}</td>

                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF8E1] text-sm font-semibold text-[#D99A00]">
                                                        {(u.name || u.email || "?")
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <p className="font-semibold text-gray-900">
                                                        {u.name || "Unnamed user"}
                                                        {isSelf && (
                                                            <span className="ml-2 text-xs font-normal text-gray-400">
                                                                (you)
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="text-gray-700">{u.email}</td>

                                            <td>
                                                {isAdminUser ? (
                                                    <span className="badge badge-success badge-soft">
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-ghost">
                                                        User
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                <div className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRoleChange(u)}
                                                        disabled={isSelf}
                                                        title={
                                                            isSelf
                                                                ? "You can't change your own role"
                                                                : isAdminUser
                                                                ? "Remove admin"
                                                                : "Make admin"
                                                        }
                                                        className={`btn btn-sm rounded-xl ${
                                                            isAdminUser
                                                                ? "btn-ghost text-red-500"
                                                                : "btn-warning text-black"
                                                        }`}
                                                    >
                                                        {isAdminUser ? (
                                                            <>
                                                                <FiShieldOff /> Remove admin
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiShield /> Make admin
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;