import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { FiEdit2, FiPause, FiPlay, FiEye, FiPlusCircle, FiX } from "react-icons/fi";
import { FaHandHoldingHeart } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";

const inputClass = "input input-bordered w-full rounded-xl";
const textareaClass = "textarea textarea-bordered w-full rounded-xl";

const getPercentage = (donated = 0, goal = 0) =>
    goal > 0 ? Math.min(Math.round((donated / goal) * 100), 100) : 0;

const formatDate = (date) =>
    date
        ? new Date(date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "—";

/* ---------------- Edit modal ---------------- */

const EditCampaignModal = ({ campaign, onClose, onSaved }) => {
    const axiosSecure = useAxiosSecure();
    const donated = campaign.donatedAmount || 0;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            petName: campaign.petName,
            image: campaign.image,
            maximumDonation: campaign.maximumDonation,
            lastDate: campaign.lastDate?.split("T")[0] || "",
            shortDescription: campaign.shortDescription || "",
            longDescription: campaign.longDescription || "",
        },
    });

    const onSubmit = async (data) => {
        try {
            const res = await axiosSecure.patch(`/donationPets/${campaign._id}`, {
                petName: data.petName.trim(),
                image: data.image.trim(),
                maximumDonation: Number(data.maximumDonation),
                lastDate: data.lastDate,
                shortDescription: data.shortDescription.trim(),
                longDescription: data.longDescription.trim(),
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

    const errorText = (error) =>
        error ? <p className="mt-1 text-xs text-red-500">{error.message}</p> : null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6"
            onClick={onClose}
        >
            <div
                className="w-full max-w-xl rounded-3xl bg-base-100 p-6 shadow-2xl md:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-5 flex items-start justify-between">
                    <h2 className="text-xl font-bold">Edit campaign</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="btn btn-sm btn-circle btn-ghost"
                    >
                        <FiX className="text-lg" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-semibold">Pet name</label>
                        <input
                            type="text"
                            className={inputClass}
                            {...register("petName", { required: "Pet name is required" })}
                        />
                        {errorText(errors.petName)}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">
                            Pet image URL
                        </label>
                        <input
                            type="url"
                            className={inputClass}
                            {...register("image", {
                                required: "Image URL is required",
                                pattern: {
                                    value: /^https?:\/\/.+/i,
                                    message: "Enter a valid image URL",
                                },
                            })}
                        />
                        {errorText(errors.image)}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Donation goal ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className={inputClass}
                                {...register("maximumDonation", {
                                    required: "Goal is required",
                                    min: {
                                        value: Math.max(donated, 1),
                                        message: `Goal can't be below $${Math.max(donated, 1)}`,
                                    },
                                })}
                            />
                            {errorText(errors.maximumDonation)}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Last date to donate
                            </label>
                            <input
                                type="date"
                                className={inputClass}
                                {...register("lastDate", { required: "Last date is required" })}
                            />
                            {errorText(errors.lastDate)}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">
                            Short description
                        </label>
                        <input
                            type="text"
                            className={inputClass}
                            {...register("shortDescription", {
                                required: "Short description is required",
                                maxLength: {
                                    value: 120,
                                    message: "Keep it under 120 characters",
                                },
                            })}
                        />
                        {errorText(errors.shortDescription)}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">Full story</label>
                        <textarea
                            rows={5}
                            className={textareaClass}
                            {...register("longDescription", {
                                required: "Full story is required",
                                minLength: {
                                    value: 30,
                                    message: "Please write at least 30 characters",
                                },
                            })}
                        />
                        {errorText(errors.longDescription)}
                    </div>

                    <div className="flex gap-3 pt-2">
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

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <Helmet>
                <title>PawsHome | My Campaigns</title>
            </Helmet>

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                    className="btn btn-warning rounded-xl text-black"
                >
                    <FiPlusCircle className="text-lg" />
                    Create campaign
                </Link>
            </div>

            {/* Empty state */}
            {campaigns.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8E1] text-2xl text-[#D99A00]">
                        <FaHandHoldingHeart />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
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
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs text-gray-500">
                                    <th className="w-12">#</th>
                                    <th>Pet</th>
                                    <th className="min-w-48">Progress</th>
                                    <th>Last date</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {campaigns.map((campaign, index) => {
                                    const donated = campaign.donatedAmount || 0;
                                    const goal = campaign.maximumDonation || 0;
                                    const percentage = getPercentage(donated, goal);
                                    const ended =
                                        campaign.lastDate &&
                                        new Date(campaign.lastDate) < new Date(new Date().toDateString());

                                    return (
                                        <tr
                                            key={campaign._id}
                                            className="border-b border-gray-50 last:border-0"
                                        >
                                            <td className="text-gray-400">{index + 1}</td>

                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="h-14 w-14 rounded-2xl">
                                                            <img
                                                                src={campaign.image}
                                                                alt={campaign.petName}
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="font-semibold text-gray-900">
                                                        {campaign.petName}
                                                    </p>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="mb-1 flex justify-between text-xs">
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
                                            </td>

                                            <td className="text-gray-700">
                                                {formatDate(campaign.lastDate)}
                                            </td>

                                            <td>
                                                {campaign.paused ? (
                                                    <span className="badge badge-neutral badge-soft">
                                                        Paused
                                                    </span>
                                                ) : percentage >= 100 ? (
                                                    <span className="badge badge-success badge-soft">
                                                        Goal reached
                                                    </span>
                                                ) : ended ? (
                                                    <span className="badge badge-error badge-soft">
                                                        Ended
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-warning badge-soft">
                                                        Active
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        to={`/donation-details/${campaign._id}`}
                                                        title="View campaign"
                                                        aria-label={`View ${campaign.petName} campaign`}
                                                        className="btn btn-sm btn-ghost btn-square text-gray-600"
                                                    >
                                                        <FiEye className="text-lg" />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => setEditing(campaign)}
                                                        title="Edit campaign"
                                                        aria-label={`Edit ${campaign.petName} campaign`}
                                                        className="btn btn-sm btn-ghost btn-square text-gray-600"
                                                    >
                                                        <FiEdit2 className="text-lg" />
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
                                                        className="btn btn-sm btn-ghost btn-square text-[#D99A00]"
                                                    >
                                                        {campaign.paused ? (
                                                            <FiPlay className="text-lg" />
                                                        ) : (
                                                            <FiPause className="text-lg" />
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