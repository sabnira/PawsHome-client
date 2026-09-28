import { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { FiPlus, FiLoader } from "react-icons/fi";
import { AuthContext } from "../../providers/AuthProvider";


const petCategories = [
    { value: "Dog", label: "Dog" },
    { value: "Cat", label: "Cat" },
    { value: "Rabbit", label: "Rabbit" },
    { value: "Bird", label: "Bird" },
    { value: "Fish", label: "Fish" },
    { value: "Hamster", label: "Hamster" },
    { value: "Other", label: "Other" },
];

const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
];

const AddPet = () => {
    const { user } = useContext(AuthContext);

    const [uploadingImage, setUploadingImage] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const handleImageUpload = async (file) => {
        if (!file) return;

        setUploadingImage(true);
        setSubmitError("");

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!data.success) {
                throw new Error("Image upload failed");
            }

            setValue("image", data.data.display_url, {
                shouldValidate: true,
            });
        } catch (error) {
            console.error(error);
            setSubmitError("Failed to upload image. Please try again.");
        } finally {
            setUploadingImage(false);
        }
    };

    const onSubmit = async (data) => {
        setSubmitError("");

        try {
            const petData = {
                image: data.image,
                name: data.name,
                age: data.age,
                location: data.location,
                price: Number(data.price),
                gender: data.gender.value,
                category: data.category.value,
                ownerEmail: user?.email,
                adopted: false,
            };

            const response = await fetch(
                "http://localhost:5000/pets",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(petData),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to add pet"
                );
            }

            reset();

            alert("Pet added successfully!");
        } catch (error) {
            console.error(error);
            setSubmitError(
                error.message || "Something went wrong. Please try again."
            );
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">
                    Add a Pet
                </h1>

                <p className="mt-1 text-sm text-base-content/60">
                    Add a pet to PawsHome and help them find a loving home.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-3xl border border-base-200 bg-white p-5 md:p-8 space-y-6"
            >
                {/* Image */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">
                        Pet Image
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered w-full"
                        {...register("imageFile", {
                            required: "Pet image is required",
                            onChange: (e) =>
                                handleImageUpload(e.target.files?.[0]),
                        })}
                    />

                    <input
                        type="hidden"
                        {...register("image", {
                            required: "Pet image is required",
                        })}
                    />

                    {uploadingImage && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-info">
                            <FiLoader className="animate-spin" />
                            Uploading image...
                        </p>
                    )}

                    {errors.image && !uploadingImage && (
                        <p className="mt-2 text-sm text-error">
                            {errors.image.message}
                        </p>
                    )}
                </div>

                {/* Name + Age */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold">
                            Pet Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter pet name"
                            className={`input input-bordered w-full ${errors.name ? "input-error" : ""
                                }`}
                            {...register("name", {
                                required: "Pet name is required",
                            })}
                        />

                        {errors.name && (
                            <p className="mt-2 text-sm text-error">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">
                            Pet Age
                        </label>

                        <input
                            type="text"
                            placeholder="e.g. 2 years"
                            className={`input input-bordered w-full ${errors.age ? "input-error" : ""
                                }`}
                            {...register("age", {
                                required: "Pet age is required",
                            })}
                        />

                        {errors.age && (
                            <p className="mt-2 text-sm text-error">
                                {errors.age.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Category + Gender */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold">
                            Pet Category
                        </label>

                        <Controller
                            name="category"
                            control={control}
                            rules={{
                                required: "Pet category is required",
                            }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={petCategories}
                                    placeholder="Select category"
                                />
                            )}
                        />

                        {errors.category && (
                            <p className="mt-2 text-sm text-error">
                                {errors.category.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">
                            Gender
                        </label>

                        <Controller
                            name="gender"
                            control={control}
                            rules={{
                                required: "Gender is required",
                            }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={genderOptions}
                                    placeholder="Select gender"
                                />
                            )}
                        />

                        {errors.gender && (
                            <p className="mt-2 text-sm text-error">
                                {errors.gender.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">
                        Pet Location
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. Chattogram"
                        className={`input input-bordered w-full ${errors.location ? "input-error" : ""
                            }`}
                        {...register("location", {
                            required: "Pet location is required",
                        })}
                    />

                    {errors.location && (
                        <p className="mt-2 text-sm text-error">
                            {errors.location.message}
                        </p>
                    )}
                </div>

                {/* Price */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">
                        Price
                    </label>

                    <input
                        type="number"
                        min="0"
                        placeholder="Enter price"
                        className={`input input-bordered w-full ${errors.price ? "input-error" : ""
                            }`}
                        {...register("price", {
                            required: "Price is required",
                            min: {
                                value: 0,
                                message: "Price cannot be negative",
                            },
                        })}
                    />

                    {errors.price && (
                        <p className="mt-2 text-sm text-error">
                            {errors.price.message}
                        </p>
                    )}
                </div>

                {/* Submit Error */}
                {submitError && (
                    <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
                        {submitError}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={
                        isSubmitting ||
                        uploadingImage
                    }
                    className="btn w-full rounded-xl bg-[#F7C948] border-none text-gray-900 hover:bg-[#e9b92e]"
                >
                    {isSubmitting ? (
                        <>
                            <FiLoader className="animate-spin" />
                            Adding Pet...
                        </>
                    ) : (
                        <>
                            <FiPlus />
                            Add Pet
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddPet;