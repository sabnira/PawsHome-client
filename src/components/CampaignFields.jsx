// Shared form fields for creating and editing a donation campaign.
// Used with react-hook-form: pass `register` and `errors` from useForm.

const CATEGORIES = ["Dog", "Cat", "Bird", "Rabbit", "Other"];

const REASONS = [
    "Medical Treatment",
    "Surgery",
    "Vaccination",
    "Food & Care",
    "Shelter & Rehabilitation",
    "Other",
];

const inputClass = "input input-bordered w-full rounded-xl";
const selectClass = "select select-bordered w-full rounded-xl";
const textareaClass = "textarea textarea-bordered w-full rounded-xl";

const Field = ({ id, label, error, hint, children }) => (
    <div className="min-w-0">
        <label htmlFor={id} className="mb-2 block text-sm font-semibold">
            {label}
        </label>
        {children}
        {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
);

const CampaignFields = ({
    register,
    errors,
    imageUrl = "",
    minGoal = 1,
    currentCategory,
    currentReason,
}) => {
    // Keep a saved value selectable even if it isn't in the default lists
    const categories =
        currentCategory && !CATEGORIES.includes(currentCategory)
            ? [...CATEGORIES, currentCategory]
            : CATEGORIES;
    const reasons =
        currentReason && !REASONS.includes(currentReason)
            ? [...REASONS, currentReason]
            : REASONS;

    const showPreview = /^https?:\/\/.+/i.test(imageUrl.trim());

    return (
        <div className="space-y-4 sm:space-y-5">
            {/* Name + category */}
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                <Field id="cf-petName" label="Pet name" error={errors.petName}>
                    <input
                        id="cf-petName"
                        type="text"
                        placeholder="e.g. Buddy"
                        className={inputClass}
                        {...register("petName", {
                            required: "Pet name is required",
                            minLength: {
                                value: 2,
                                message: "Pet name must be at least 2 characters",
                            },
                        })}
                    />
                </Field>

                <Field id="cf-category" label="Category" error={errors.category}>
                    <select
                        id="cf-category"
                        className={selectClass}
                        {...register("category", { required: "Select a category" })}
                    >
                        <option value="" disabled>
                            Select category
                        </option>
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>

            {/* Image + preview */}
            <Field
                id="cf-image"
                label="Pet image URL"
                error={errors.image}
                hint="Use a direct image link (ending in .jpg, .png or .webp)."
            >
                <input
                    id="cf-image"
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

                {showPreview && (
                    <img
                        key={imageUrl}
                        src={imageUrl.trim()}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                        className="mt-3 h-32 w-full rounded-2xl object-cover sm:w-56"
                    />
                )}
            </Field>

            {/* Age + location */}
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                <Field id="cf-age" label="Age" error={errors.age}>
                    <input
                        id="cf-age"
                        type="text"
                        placeholder="e.g. 2 years"
                        className={inputClass}
                        {...register("age", { required: "Age is required" })}
                    />
                </Field>

                <Field id="cf-location" label="Location" error={errors.location}>
                    <input
                        id="cf-location"
                        type="text"
                        placeholder="e.g. Chattogram"
                        className={inputClass}
                        {...register("location", { required: "Location is required" })}
                    />
                </Field>
            </div>

            {/* Reason + goal */}
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                <Field id="cf-reason" label="Reason for donation" error={errors.reason}>
                    <select
                        id="cf-reason"
                        className={selectClass}
                        {...register("reason", { required: "Select a reason" })}
                    >
                        <option value="" disabled>
                            Select reason
                        </option>
                        {reasons.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field
                    id="cf-maximumDonation"
                    label="Donation goal ($)"
                    error={errors.maximumDonation}
                >
                    <input
                        id="cf-maximumDonation"
                        type="number"
                        step="any"
                        placeholder="e.g. 1200"
                        className={inputClass}
                        {...register("maximumDonation", {
                            required: "Donation goal is required",
                            min: {
                                value: minGoal,
                                message: `Goal can't be below $${minGoal}`,
                            },
                        })}
                    />
                </Field>
            </div>

            {/* Description */}
            <Field id="cf-description" label="Description" error={errors.description}>
                <textarea
                    id="cf-description"
                    rows={5}
                    placeholder="Tell donors what happened, what the pet needs and how the money will be used"
                    className={textareaClass}
                    {...register("description", {
                        required: "Description is required",
                        minLength: {
                            value: 30,
                            message: "Please write at least 30 characters",
                        },
                    })}
                />
            </Field>
        </div>
    );
};

export default CampaignFields;