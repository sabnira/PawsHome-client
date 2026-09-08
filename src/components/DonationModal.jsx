import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";



const DonationModal = ({ donationPet, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();

    const [amount, setAmount] = useState("");
    const [processing, setProcessing] = useState(false);

    const {
        _id,
        petName,
        maximumDonation,
        donatedAmount = 0,
    } = donationPet;

    const remainingAmount = Math.max(
        maximumDonation - donatedAmount,
        0
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const donationAmount = Number(amount);

        // // Validation
        // if (!donationAmount || donationAmount <= 0) {
        //     Swal.fire({
        //         icon: "warning",
        //         title: "Invalid Amount",
        //         text: "Please enter a valid donation amount.",
        //     });
        //     return;
        // }

        // if (donationAmount > remainingAmount) {
        //     Swal.fire({
        //         icon: "warning",
        //         title: "Amount Too High",
        //         text: `You can donate up to $${remainingAmount}.`,
        //     });
        //     return;
        // }

        setProcessing(true);

        try {
            // 1. Ask backend to create PaymentIntent
            const { data } = await axiosSecure.post(
                "/create-payment-intent",
                {
                    amount: donationAmount,
                }
            );

            // 2. Get CardElement
            const card = elements.getElement(CardElement);

            if (!card) {
                throw new Error("Card information is required.");
            }

            // 3. Confirm payment with Stripe
            const result = await stripe.confirmCardPayment(
                data.clientSecret,
                {
                    payment_method: {
                        card,
                    },
                }
            );

            if (result.error) {
                throw new Error(result.error.message);
            }

            if (result.paymentIntent.status === "succeeded") {

                // 4. Save donation in database
                const donationData = {
                    campaignId: _id,
                    petName,
                    amount: donationAmount,
                    transactionId: result.paymentIntent.id,
                    donatedAt: new Date(),
                };

                const donationResult = await axiosSecure.post(
                    "/donations",
                    donationData
                );

                if (donationResult.data.insertedId) {
                    Swal.fire({
                        icon: "success",
                        title: "Donation Successful!",
                        text: `Thank you for donating $${donationAmount}.`,
                    });

                    onClose();
                }
            }

        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text:
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong.",
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

            <div className="bg-base-100 w-full max-w-lg rounded-3xl shadow-2xl p-6 md:p-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">

                    <div>
                        <h2 className="text-2xl font-bold">
                            Donate to {petName}
                        </h2>

                        <p className="text-sm text-base-content/50 mt-1">
                            Every contribution makes a difference ❤️
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost"
                    >
                        ✕
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    {/* Donation Amount */}
                    <div className="form-control mb-5">

                        <label className="label">
                            <span className="label-text font-semibold">
                                Donation Amount
                            </span>
                        </label>

                        <div className="relative">

                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold">
                                $
                            </span>

                            <input
                                type="number"
                                min="1"
                                max={remainingAmount}
                                step="0.01"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(e.target.value)
                                }
                                placeholder="Enter amount"
                                className="input input-bordered w-full pl-8 rounded-xl"
                                required
                            />

                        </div>

                        <p className="text-xs text-base-content/50 mt-2">
                            Remaining amount: ${remainingAmount}
                        </p>

                    </div>

                    {/* Stripe Card */}
                    <div className="form-control">

                        <label className="label">
                            <span className="label-text font-semibold">
                                Card Information
                            </span>
                        </label>

                        <div className="border border-base-300 rounded-xl p-4 bg-base-100">

                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: "16px",
                                            color: "#32325d",
                                            "::placeholder": {
                                                color: "#aab7c4",
                                            },
                                        },
                                        invalid: {
                                            color: "#fa755a",
                                        },
                                    },
                                }}
                            />

                        </div>

                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!stripe || processing}
                        className="btn btn-warning w-full mt-7 rounded-xl h-14 font-bold"
                    >
                        {processing
                            ? "Processing Payment..."
                            : `Donate $${amount || "0"}`}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default DonationModal;