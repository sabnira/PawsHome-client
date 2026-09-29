import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { FiEdit, FiLoader } from "react-icons/fi";
import Swal from "sweetalert2";

import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";

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

const UpdatePet = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [loading, setLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [currentImage, setCurrentImage] = useState("");

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    // GET PET DATA
    useEffect(() => {
        const fetchPet = async () => {
            try {
                setLoading(true);

                const response = await axiosSecure.get(`/pet/${id}`);

                const pet = response.data;

                setCurrentImage(pet.image);

                reset({
                    name: pet.name,
                    age: pet.age,
                    location: pet.location,
                    price: pet.price,
                    category: petCategories.find(
                        (item) => item.value === pet.category
                    ),
                    gender: genderOptions.find(
                        (item) => item.value === pet.gender
                    ),
                    image: pet.image,
                });
            } catch (error) {
                console.error("Error loading pet:", error);

                Swal.fire({
                    icon: "error",
                    title: "Failed to Load Pet",
                    text:
                        error.response?.data?.message ||
                        "Something went wrong while loading the pet.",
                    confirmButtonText: "OK",
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPet();
        }
    }, [id, reset, axiosSecure]);

    // IMAGE UPLOAD
    const handleImageUpload = async (file) => {
        if (!file) return;

        setUploadingImage(true);

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

            const imageUrl = data.data.display_url;

            setValue("image", imageUrl, {
                shouldValidate: true,
            });

            setCurrentImage(imageUrl);
        } catch (error) {
            console.error("Image upload error:", error);

            Swal.fire({
                icon: "error",
                title: "Image Upload Failed",
                text: "Failed to upload the image. Please try again.",
                confirmButtonText: "OK",
            });
        } finally {
            setUploadingImage(false);
        }
    };

    // UPDATE PET
    const onSubmit = async (data) => {
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
            };

            const response = await axiosSecure.patch(
                `/pets/${id}`,
                petData
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Failed to update pet"
                );
            }

            Swal.fire({
                icon: "success",
                title: "Pet Updated Successfully!",
                text: `${data.name} has been updated successfully.`,
                confirmButtonText: "OK",
                confirmButtonColor: "#F7C948",
            });
        } catch (error) {
            console.error("Error updating pet:", error);

            Swal.fire({
                icon: "error",
                title: "Failed to Update Pet",
                text:
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong. Please try again.",
                confirmButtonText: "OK",
            });
        }
    };

    // LOADING
    if (loading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold md:text-3xl">
                    Update Pet
                </h1>

                <p className="mt-1 text-sm text-base-content/60">
                    Update the pet information and keep the details up to date.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 rounded-3xl border border-base-200 bg-white p-5 md:p-8"
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

                    {/* Current Image */}
                    {currentImage && !uploadingImage && (
                        <div className="mt-4">
                            <p className="mb-2 text-sm text-base-content/60">
                                Current Image
                            </p>

                            <img
                                src={currentImage}
                                alt="Current pet"
                                className="h-24 w-24 rounded-lg object-cover"
                            />
                        </div>
                    )}

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
                            className={`input input-bordered w-full ${
                                errors.name ? "input-error" : ""
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
                            className={`input input-bordered w-full ${
                                errors.age ? "input-error" : ""
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
                        className={`input input-bordered w-full ${
                            errors.location ? "input-error" : ""
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
                        className={`input input-bordered w-full ${
                            errors.price ? "input-error" : ""
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

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting || uploadingImage}
                    className="btn w-full rounded-xl border-none bg-[#F7C948] text-gray-900 hover:bg-[#e9b92e]"
                >
                    {isSubmitting ? (
                        <>
                            <FiLoader className="animate-spin" />
                            Updating Pet...
                        </>
                    ) : (
                        <>
                            <FiEdit />
                            Update Pet
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default UpdatePet;
