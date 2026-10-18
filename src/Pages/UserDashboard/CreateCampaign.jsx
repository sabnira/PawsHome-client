import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const inputClass = "input input-bordered w-full rounded-xl";
const textareaClass = "textarea textarea-bordered w-full rounded-xl";

const FieldError = ({ error }) =>
    error ? <p className="mt-1 text-xs text-red-500">{error.message}</p> : null;

const CreateCampaign = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    // Campaigns can't end in the past
    const today = new Date().toISOString().split("T")[0];

    const onSubmit = async (data) => {
        const campaign = {
            petName: data.petName.trim(),
            image: data.image.trim(),
            maximumDonation: Number(data.maximumDonation),
            lastDate: data.lastDate,
            shortDescription: data.shortDescription.trim(),
            longDescription: data.longDescription.trim(),
            donatedAmount: 0,
            paused: false,
        };

        try {
            const res = await axiosSecure.post("/donationPets", campaign);

            if (res.data.insertedId) {
                reset();
                await Swal.fire({
                    icon: "success",
                    title: "Campaign created",
                    text: `${campaign.petName}'s campaign is now live.`,
                    confirmButtonColor: "#F7C948",
                });
                navigate("/dashboard/my-campaigns");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Could not create campaign",
                text: error.response?.data?.message || "Please try again.",
            });
        }
    };

    return (
        <div>
            <Helmet>
                <title>PawsHome | Create Campaign</title>
            </Helmet>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Create Donation Campaign
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Raise money for a pet's treatment, food or other care
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="max-w-3xl space-y-6 rounded-3xl border border-gray-100 bg-white p-6 md:p-8"
            >
                {/* Pet name + image */}
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label htmlFor="petName" className="mb-2 block text-sm font-semibold">
                            Pet name
                        </label>
                        <input
                            id="petName"
                            type="text"
                            placeholder="e.g. Mimi"
                            className={inputClass}
                            {...register("petName", {
                                required: "Pet name is required",
                                minLength: {
                                    value: 2,
                                    message: "Pet name must be at least 2 characters",
                                },
                            })}
                        />
                        <FieldError error={errors.petName} />
                    </div>

                    <div>
                        <label htmlFor="image" className="mb-2 block text-sm font-semibold">
                            Pet image URL
                        </label>
                        <input
                            id="image"
                            type="url"
                            placeholder="https://..."
                            className={inputClass}
                            {...register("image", {
                                required: "Image URL is required",
                                pattern: {
                                    value: /^https?:\/\/.+/i,
                                    message: "Enter a valid image URL",
                                },
                            })}
                        />
                        <FieldError error={errors.image} />
                    </div>
                </div>

                {/* Goal + last date */}
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="maximumDonation"
                            className="mb-2 block text-sm font-semibold"
                        >
                            Donation goal ($)
                        </label>
                        <input
                            id="maximumDonation"
                            type="number"
                            step="0.01"
                            placeholder="e.g. 500"
                            className={inputClass}
                            {...register("maximumDonation", {
                                required: "Donation goal is required",
                                min: {
                                    value: 1,
                                    message: "Goal must be at least $1",
                                },
                            })}
                        />
                        <FieldError error={errors.maximumDonation} />
                    </div>

                    <div>
                        <label htmlFor="lastDate" className="mb-2 block text-sm font-semibold">
                            Last date to donate
                        </label>
                        <input
                            id="lastDate"
                            type="date"
                            min={today}
                            className={inputClass}
                            {...register("lastDate", {
                                required: "Last date is required",
                                validate: (value) =>
                                    value >= today || "Date can't be in the past",
                            })}
                        />
                        <FieldError error={errors.lastDate} />
                    </div>
                </div>

                {/* Short description */}
                <div>
                    <label
                        htmlFor="shortDescription"
                        className="mb-2 block text-sm font-semibold"
                    >
                        Short description
                    </label>
                    <input
                        id="shortDescription"
                        type="text"
                        placeholder="One line about why you're raising money"
                        className={inputClass}
                        {...register("shortDescription", {
                            required: "Short description is required",
                            maxLength: {
                                value: 120,
                                message: "Keep it under 120 characters",
                            },
                        })}
                    />
                    <FieldError error={errors.shortDescription} />
                </div>

                {/* Long description */}
                <div>
                    <label
                        htmlFor="longDescription"
                        className="mb-2 block text-sm font-semibold"
                    >
                        Full story
                    </label>
                    <textarea
                        id="longDescription"
                        rows={6}
                        placeholder="Tell donors about the pet, what it needs and how the money will be used"
                        className={textareaClass}
                        {...register("longDescription", {
                            required: "Full story is required",
                            minLength: {
                                value: 30,
                                message: "Please write at least 30 characters",
                            },
                        })}
                    />
                    <FieldError error={errors.longDescription} />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-warning h-12 w-full rounded-xl font-bold text-black md:w-auto md:px-10"
                >
                    {isSubmitting ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Creating...
                        </>
                    ) : (
                        "Create campaign"
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateCampaign;