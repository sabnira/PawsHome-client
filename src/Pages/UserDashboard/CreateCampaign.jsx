import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import CampaignFields from "../../components/CampaignFields";


const CreateCampaign = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { category: "", reason: "" },
    });

    const onSubmit = async (data) => {
        // Same shape as the documents in the donationPets collection.
        // donatedAmount starts at 0 and is updated by the server on each donation.
        const campaign = {
            petName: data.petName.trim(),
            image: data.image.trim(),
            category: data.category,
            age: data.age.trim(),
            location: data.location.trim(),
            reason: data.reason,
            description: data.description.trim(),
            maximumDonation: Number(data.maximumDonation),
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
            <div className="mb-5 sm:mb-6">
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
                className="max-w-3xl space-y-6 rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 md:p-8"
            >
                <CampaignFields
                    register={register}
                    errors={errors}
                    imageUrl={watch("image") || ""}
                />

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