import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { FiEdit2, FiPause, FiPlay, FiEye, FiPlusCircle, FiX } from "react-icons/fi";
import { FaHandHoldingHeart, FaPaw } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";
import CampaignFields from "../../components/CampaignFields";




const getPercentage = (donated = 0, goal = 0) =>
    goal > 0 ? Math.min(Math.round((donated / goal) * 100), 100) : 0;

// Short description line shown under the pet name
const campaignMeta = (campaign) =>
    [campaign.reason, campaign.location].filter(Boolean).join(" · ") || "Donation campaign";

// Shows the campaign photo, or a paw placeholder when the URL is missing or broken
const CampaignImage = ({ src, alt, className }) => {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div
                className={`flex items-center justify-center bg-[#FFF8E1] text-[#D99A00] ${className}`}
            >
                <FaPaw />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setFailed(true)}
            className={`object-cover ${className}`}
        />
    );
};

// Everything the cards and the table need to know about one campaign
const getInfo = (campaign) => {
    const donated = campaign.donatedAmount || 0;
    const goal = campaign.maximumDonation || 0;
    const percentage = getPercentage(donated, goal);
    return { donated, goal, percentage };
};

const statusBadge = (campaign, { percentage }) => {
    if (campaign.paused) {
        return <span className="badge badge-neutral badge-soft shrink-0">Paused</span>;
    }
    if (percentage >= 100) {
        return <span className="badge badge-success badge-soft shrink-0">Goal reached</span>;
    }
    return <span className="badge badge-warning badge-soft shrink-0">Active</span>;
};

/* ---------------- Edit modal ---------------- */

const EditCampaignModal = ({ campaign, onClose, onSaved }) => {
    const axiosSecure = useAxiosSecure();
    const donated = campaign.donatedAmount || 0;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            petName: campaign.petName || "",
            image: campaign.image || "",
            category: campaign.category || "",
            age: campaign.age || "",
            location: campaign.location || "",
            reason: campaign.reason || "",
            maximumDonation: campaign.maximumDonation || "",
            description: campaign.description || "",
        },
    });

    const onSubmit = async (data) => {
        try {
            const res = await axiosSecure.patch(`/donationPets/${campaign._id}`, {
                petName: data.petName.trim(),
                image: data.image.trim(),
                category: data.category,
                age: data.age.trim(),
                location: data.location.trim(),
                reason: data.reason,
                description: data.description.trim(),
                maximumDonation: Number(data.maximumDonation),
            });

            if (res.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Campaign updated",
                    timer: 1500,
                    showConfirmButton: false,
                });
                onSaved();
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Could not update campaign",
                text: error.response?.data?.message || "Please try again.",
            });
        }
    };

    return (
        // Bottom sheet on phones, centered dialog from sm up
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:px-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-base-100 p-5 shadow-2xl sm:rounded-3xl sm:p-6 md:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-5 flex items-start justify-between gap-3">
                    <h2 className="text-lg font-bold sm:text-xl">Edit campaign</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="btn btn-sm btn-circle btn-ghost shrink-0"
                    >
                        <FiX className="text-lg" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <CampaignFields
                        register={register}
                        errors={errors}
                        imageUrl={watch("image") || ""}
                        minGoal={Math.max(donated, 1)}
                        currentCategory={campaign.category}
                        currentReason={campaign.reason}
                    />

                    <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn flex-1 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-warning flex-1 rounded-xl text-black"
                        >
                            {isSubmitting ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                "Save changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ---------------- Page ---------------- */

const MyCampaign = () => {
    const axiosSecure = useAxiosSecure();
    const [editing, setEditing] = useState(null);

    const {
        data: campaigns = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["my-campaigns"],
        queryFn: async () => {
            const res = await axiosSecure.get("/my-campaigns");
            return res.data;
        },
    });

    const handleTogglePause = async (campaign) => {
        const willPause = !campaign.paused;

        const result = await Swal.fire({
            title: willPause ? "Pause this campaign?" : "Resume this campaign?",
            text: willPause
                ? "People won't be able to donate until you resume it."
                : "People will be able to donate again.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#F7C948",
            cancelButtonColor: "#6b7280",
            confirmButtonText: willPause ? "Pause campaign" : "Resume campaign",
        });

        if (!result.isConfirmed) return;

        try {
            await axiosSecure.patch(`/donationPets/${campaign._id}/pause`, {
                paused: willPause,
            });
            refetch();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Could not update campaign",
                text: error.response?.data?.message || "Please try again.",
            });
        }
    };

    // Icon-only buttons in the table, labelled buttons in the mobile cards
    const renderActions = (campaign, labeled = false) => {
        const square = labeled ? "" : "btn-square";

        return (
            <>
                <Link
                    to={`/donation-details/${campaign._id}`}
                    title="View campaign"
                    aria-label={`View ${campaign.petName} campaign`}
                    className={`btn btn-sm btn-ghost text-gray-600 ${square}`}
                >
                    <FiEye className="text-lg" />
                    {labeled && "View"}
                </Link>

                <button
                    type="button"
                    onClick={() => setEditing(campaign)}
                    title="Edit campaign"
                    aria-label={`Edit ${campaign.petName} campaign`}
                    className={`btn btn-sm btn-ghost text-gray-600 ${square}`}
                >
                    <FiEdit2 className="text-lg" />
                    {labeled && "Edit"}
                </button>

                <button
                    type="button"
                    onClick={() => handleTogglePause(campaign)}
                    title={campaign.paused ? "Resume" : "Pause"}
                    aria-label={
                        campaign.paused
                            ? `Resume ${campaign.petName} campaign`
                            : `Pause ${campaign.petName} campaign`
                    }
                    className={`btn btn-sm btn-ghost text-[#D99A00] ${square}`}
                >
                    {campaign.paused ? (
                        <FiPlay className="text-lg" />
                    ) : (
                        <FiPause className="text-lg" />
                    )}
                    {labeled && (campaign.paused ? "Resume" : "Pause")}
                </button>
            </>
        );
    };

    const progress = ({ donated, goal, percentage }) => (
        <>
            <div className="mb-1 flex justify-between gap-2 text-xs">
                <span className="font-semibold text-gray-900">
                    ${donated.toLocaleString()}
                </span>
                <span className="text-gray-500">
                    of ${goal.toLocaleString()} ({percentage}%)
                </span>
            </div>
            <progress
                className="progress progress-warning w-full"
                value={percentage}
                max="100"
            ></progress>
        </>
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <Helmet>
                <title>PawsHome | My Campaigns</title>
            </Helmet>

            {/* Header */}
            <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        My Campaigns
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {campaigns.length}{" "}
                        {campaigns.length === 1 ? "campaign" : "campaigns"} created by you
                    </p>
                </div>

                <Link
                    to="/dashboard/create-campaign"
                    className="btn btn-warning w-full rounded-xl text-black sm:w-auto"
                >
                    <FiPlusCircle className="text-lg" />
                    Create campaign
                </Link>
            </div>

            {/* Empty state */}
            {campaigns.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white px-4 py-12 text-center sm:px-6 sm:py-16">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8E1] text-2xl text-[#D99A00]">
                        <FaHandHoldingHeart />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                        You haven't created any campaigns yet
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                        Start a campaign to raise money for a pet's care.
                    </p>
                    <Link
                        to="/dashboard/create-campaign"
                        className="btn btn-warning mt-6 rounded-xl text-black"
                    >
                        Create campaign
                    </Link>
                </div>
            ) : (
                <>
                    {/* Mobile: cards */}
                    <ul className="space-y-3 md:hidden">
                        {campaigns.map((campaign) => {
                            const info = getInfo(campaign);

                            return (
                                <li
                                    key={campaign._id}
                                    className="rounded-3xl border border-gray-100 bg-white p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <CampaignImage
                                            src={campaign.image}
                                            alt={campaign.petName}
                                            className="h-16 w-16 shrink-0 rounded-2xl"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="truncate font-semibold text-gray-900">
                                                    {campaign.petName}
                                                </p>
                                                {statusBadge(campaign, info)}
                                            </div>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                {campaignMeta(campaign)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4">{progress(info)}</div>

                                    <div className="mt-3 flex flex-wrap justify-end gap-1 border-t border-gray-50 pt-3">
                                        {renderActions(campaign, true)}
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
                                        <th className="hidden w-12 xl:table-cell">#</th>
                                        <th>Pet</th>
                                        <th className="min-w-48">Progress</th>
                                        <th>Status</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {campaigns.map((campaign, index) => {
                                        const info = getInfo(campaign);

                                        return (
                                            <tr
                                                key={campaign._id}
                                                className="border-b border-gray-50 last:border-0"
                                            >
                                                <td className="hidden text-gray-400 xl:table-cell">
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <CampaignImage
                                                            src={campaign.image}
                                                            alt={campaign.petName}
                                                            className="h-14 w-14 shrink-0 rounded-2xl"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-gray-900">
                                                                {campaign.petName}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {campaignMeta(campaign)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>{progress(info)}</td>

                                                <td>{statusBadge(campaign, info)}</td>

                                                <td>
                                                    <div className="flex justify-end gap-2">
                                                        {renderActions(campaign)}
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

            {editing && (
                <EditCampaignModal
                    campaign={editing}
                    onClose={() => setEditing(null)}
                    onSaved={() => {
                        setEditing(null);
                        refetch();
                    }}
                />
            )}
        </div>
    );
};

export default MyCampaign;