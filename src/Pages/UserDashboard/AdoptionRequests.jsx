import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { FiCheck, FiX, FiEye, FiInbox } from "react-icons/fi";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";

const TABS = ["all", "pending", "accepted", "rejected"];

const statusBadge = {
    pending: "badge badge-warning badge-soft",
    accepted: "badge badge-success badge-soft",
    rejected: "badge badge-error badge-soft",
};

const formatDate = (date) =>
    date
        ? new Date(date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "—";

const AdoptionRequests = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [tab, setTab] = useState("all");
    const [selected, setSelected] = useState(null);

    const {
        data: requests = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["adoption-requests", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/my-adoption-requests?email=${user.email}`
            );
            return res.data;
        },
    });

    // Requests without a status are treated as pending
    const getStatus = (request) => request.status || "pending";

    const counts = TABS.reduce((acc, name) => {
        acc[name] =
            name === "all"
                ? requests.length
                : requests.filter((r) => getStatus(r) === name).length;
        return acc;
    }, {});

    const visibleRequests =
        tab === "all"
            ? requests
            : requests.filter((r) => getStatus(r) === tab);

    const handleAccept = async (request) => {
        const result = await Swal.fire({
            title: "Accept this request?",
            text: `${request.petName || "The pet"} will be marked as adopted.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#43934A",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Accept request",
        });

        if (!result.isConfirmed) return;

        try {
            await axiosSecure.patch(`/adoption-requests/${request._id}/accept`);
            // The server doesn't update the pet when a request is accepted
            await axiosSecure.patch(`/pets/${request.petId}/adopted`);

            refetch();
            setSelected(null);
            Swal.fire({
                icon: "success",
                title: "Request accepted",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Could not accept request",
                text: error.response?.data?.message || "Please try again.",
            });
        }
    };

    const handleReject = async (request) => {
        const result = await Swal.fire({
            title: "Reject this request?",
            text: "The requester will see it as rejected.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e53e3e",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Reject request",
        });

        if (!result.isConfirmed) return;

        try {
            await axiosSecure.patch(`/adoption-requests/${request._id}/reject`);

            refetch();
            setSelected(null);
            Swal.fire({
                icon: "success",
                title: "Request rejected",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Could not reject request",
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
                <title>PawsHome | Adoption Requests</title>
            </Helmet>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Adoption Requests
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Requests people have sent for the pets you added
                </p>
            </div>

            {/* Status tabs */}
            <div role="tablist" className="mb-5 flex flex-wrap gap-2">
                {TABS.map((name) => (
                    <button
                        key={name}
                        type="button"
                        role="tab"
                        aria-selected={tab === name}
                        onClick={() => setTab(name)}
                        className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                            tab === name
                                ? "bg-[#F7C948] text-black"
                                : "bg-white text-gray-600 hover:bg-[#FFF8E1]"
                        }`}
                    >
                        {name} ({counts[name]})
                    </button>
                ))}
            </div>

            {/* Empty state */}
            {visibleRequests.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8E1] text-2xl text-[#D99A00]">
                        <FiInbox />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        {tab === "all"
                            ? "No adoption requests yet"
                            : `No ${tab} requests`}
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                        {tab === "all"
                            ? "When someone asks to adopt one of your pets, the request will show up here."
                            : "Switch to another tab to see your other requests."}
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs text-gray-500">
                                    <th>Pet</th>
                                    <th>Requester</th>
                                    <th>Phone</th>
                                    <th>Requested on</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {visibleRequests.map((request) => {
                                    const status = getStatus(request);
                                    const isPending = status === "pending";

                                    return (
                                        <tr
                                            key={request._id}
                                            className="border-b border-gray-50 last:border-0"
                                        >
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    {request.petImage && (
                                                        <div className="avatar">
                                                            <div className="h-12 w-12 rounded-2xl">
                                                                <img
                                                                    src={request.petImage}
                                                                    alt={request.petName}
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <p className="font-semibold text-gray-900">
                                                        {request.petName || "Pet"}
                                                    </p>
                                                </div>
                                            </td>

                                            <td>
                                                <p className="font-medium text-gray-900">
                                                    {request.name || request.userName || "—"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {request.email || request.userEmail}
                                                </p>
                                            </td>

                                            <td className="text-gray-700">
                                                {request.phone || "—"}
                                            </td>

                                            <td className="text-gray-700">
                                                {formatDate(request.createdAt)}
                                            </td>

                                            <td>
                                                <span className={statusBadge[status]}>
                                                    {status}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelected(request)}
                                                        title="View details"
                                                        aria-label="View request details"
                                                        className="btn btn-sm btn-ghost btn-square text-gray-600"
                                                    >
                                                        <FiEye className="text-lg" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleAccept(request)}
                                                        disabled={!isPending}
                                                        title="Accept"
                                                        aria-label="Accept request"
                                                        className="btn btn-sm btn-ghost btn-square text-green-600 disabled:opacity-30"
                                                    >
                                                        <FiCheck className="text-lg" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleReject(request)}
                                                        disabled={!isPending}
                                                        title="Reject"
                                                        aria-label="Reject request"
                                                        className="btn btn-sm btn-ghost btn-square text-red-500 disabled:opacity-30"
                                                    >
                                                        <FiX className="text-lg" />
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

            {/* Details modal */}
            {selected && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="w-full max-w-lg rounded-3xl bg-base-100 p-6 shadow-2xl md:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-5 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Request for {selected.petName || "this pet"}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Sent on {formatDate(selected.createdAt)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                aria-label="Close"
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                <FiX className="text-lg" />
                            </button>
                        </div>

                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-gray-500">Name</dt>
                                <dd className="font-medium">
                                    {selected.name || selected.userName || "—"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Email</dt>
                                <dd className="font-medium">
                                    {selected.email || selected.userEmail || "—"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Phone</dt>
                                <dd className="font-medium">{selected.phone || "—"}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Address</dt>
                                <dd className="font-medium">{selected.address || "—"}</dd>
                            </div>
                            {selected.message && (
                                <div>
                                    <dt className="text-gray-500">Message</dt>
                                    <dd className="font-medium">{selected.message}</dd>
                                </div>
                            )}
                        </dl>

                        {getStatus(selected) === "pending" && (
                            <div className="mt-7 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleReject(selected)}
                                    className="btn flex-1 rounded-xl border-red-200 text-red-500"
                                >
                                    Reject
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAccept(selected)}
                                    className="btn btn-warning flex-1 rounded-xl text-black"
                                >
                                    Accept
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdoptionRequests;