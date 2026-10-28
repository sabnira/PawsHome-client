import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { FiCheck, FiX, FiEye, FiInbox } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";
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

    const requesterName = (r) => r.name || r.userName || "—";
    const requesterEmail = (r) => r.email || r.userEmail;

    const petAvatar = (request, size) =>
        request.petImage ? (
            <div className="avatar shrink-0">
                <div className={`${size} rounded-2xl`}>
                    <img src={request.petImage} alt={request.petName} className="object-cover" />
                </div>
            </div>
        ) : (
            <div
                className={`${size} flex shrink-0 items-center justify-center rounded-2xl bg-[#FFF8E1] text-[#D99A00]`}
            >
                <FaPaw />
            </div>
        );

    // Icon-only buttons in the table, labelled buttons in the mobile cards
    const renderActions = (request, labeled = false) => {
        const isPending = getStatus(request) === "pending";
        const square = labeled ? "" : "btn-square";

        return (
            <>
                <button
                    type="button"
                    onClick={() => setSelected(request)}
                    title="View details"
                    aria-label="View request details"
                    className={`btn btn-sm btn-ghost text-gray-600 ${square}`}
                >
                    <FiEye className="text-lg" />
                    {labeled && "Details"}
                </button>

                <button
                    type="button"
                    onClick={() => handleAccept(request)}
                    disabled={!isPending}
                    title="Accept"
                    aria-label="Accept request"
                    className={`btn btn-sm btn-ghost text-green-600 disabled:opacity-30 ${square}`}
                >
                    <FiCheck className="text-lg" />
                    {labeled && "Accept"}
                </button>

                <button
                    type="button"
                    onClick={() => handleReject(request)}
                    disabled={!isPending}
                    title="Reject"
                    aria-label="Reject request"
                    className={`btn btn-sm btn-ghost text-red-500 disabled:opacity-30 ${square}`}
                >
                    <FiX className="text-lg" />
                    {labeled && "Reject"}
                </button>
            </>
        );
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
            <div className="mb-5 sm:mb-6">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Adoption Requests
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Requests people have sent for the pets you added
                </p>
            </div>

            {/* Status tabs: scroll sideways on narrow phones */}
            <div
                role="tablist"
                className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
            >
                {TABS.map((name) => (
                    <button
                        key={name}
                        type="button"
                        role="tab"
                        aria-selected={tab === name}
                        onClick={() => setTab(name)}
                        className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
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
                <div className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white px-4 py-12 text-center sm:px-6 sm:py-16">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8E1] text-2xl text-[#D99A00]">
                        <FiInbox />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
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
                <>
                    {/* Mobile: cards */}
                    <ul className="space-y-3 md:hidden">
                        {visibleRequests.map((request) => {
                            const status = getStatus(request);

                            return (
                                <li
                                    key={request._id}
                                    className="rounded-3xl border border-gray-100 bg-white p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        {petAvatar(request, "h-14 w-14")}

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="truncate font-semibold text-gray-900">
                                                    {request.petName || "Pet"}
                                                </p>
                                                <span className={`${statusBadge[status]} shrink-0`}>
                                                    {status}
                                                </span>
                                            </div>

                                            <p className="mt-0.5 truncate text-sm text-gray-700">
                                                {requesterName(request)}
                                            </p>
                                            <p className="truncate text-xs text-gray-500">
                                                {requesterEmail(request)}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-xs text-gray-500">
                                        {[request.phone, formatDate(request.createdAt)]
                                            .filter(Boolean)
                                            .join(" · ")}
                                    </p>

                                    <div className="mt-3 flex flex-wrap justify-end gap-1 border-t border-gray-50 pt-3">
                                        {renderActions(request, true)}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Tablet and up: table */}
                    <div className="hidden overflow-hidden rounded-3xl border border-gray-100 bg-white md:block">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs text-gray-500">
                                        <th>Pet</th>
                                        <th>Requester</th>
                                        <th className="hidden xl:table-cell">Phone</th>
                                        <th className="hidden xl:table-cell">Requested on</th>
                                        <th>Status</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {visibleRequests.map((request) => {
                                        const status = getStatus(request);

                                        return (
                                            <tr
                                                key={request._id}
                                                className="border-b border-gray-50 last:border-0"
                                            >
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        {petAvatar(request, "h-12 w-12")}
                                                        <p className="font-semibold text-gray-900">
                                                            {request.petName || "Pet"}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td>
                                                    <p className="font-medium text-gray-900">
                                                        {requesterName(request)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {requesterEmail(request)}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-gray-400 xl:hidden">
                                                        {[request.phone, formatDate(request.createdAt)]
                                                            .filter(Boolean)
                                                            .join(" · ")}
                                                    </p>
                                                </td>

                                                <td className="hidden text-gray-700 xl:table-cell">
                                                    {request.phone || "—"}
                                                </td>

                                                <td className="hidden text-gray-700 xl:table-cell">
                                                    {formatDate(request.createdAt)}
                                                </td>

                                                <td>
                                                    <span className={statusBadge[status]}>
                                                        {status}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="flex justify-end gap-2">
                                                        {renderActions(request)}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Details modal: bottom sheet on phones, centered dialog from sm up */}
            {selected && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:px-4"
                    onClick={() => setSelected(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-base-100 p-5 shadow-2xl sm:rounded-3xl sm:p-6 md:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-5 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h2 className="break-words text-lg font-bold sm:text-xl">
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
                                className="btn btn-sm btn-circle btn-ghost shrink-0"
                            >
                                <FiX className="text-lg" />
                            </button>
                        </div>

                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-gray-500">Name</dt>
                                <dd className="break-words font-medium">
                                    {requesterName(selected)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Email</dt>
                                <dd className="break-all font-medium">
                                    {requesterEmail(selected) || "—"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Phone</dt>
                                <dd className="font-medium">{selected.phone || "—"}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Address</dt>
                                <dd className="break-words font-medium">
                                    {selected.address || "—"}
                                </dd>
                            </div>
                            {selected.message && (
                                <div>
                                    <dt className="text-gray-500">Message</dt>
                                    <dd className="break-words font-medium">{selected.message}</dd>
                                </div>
                            )}
                        </dl>

                        {getStatus(selected) === "pending" && (
                            <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-7 sm:flex-row">
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