"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { errorMessageHandler } from "@/utils/error-handler";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    profileName: string;
    onSubmit?: (review: { rating: number; title: string; comment: string }) => Promise<void>;
}

export function ReviewModal({ isOpen, onClose, profileName, onSubmit }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (!title.trim()) {
            toast.error("Please provide a title");
            return;
        }
        if (!comment.trim()) {
            toast.error("Please write a review");
            return;
        }

        setIsSubmitting(true);

        try {
            if (onSubmit) {
                await onSubmit({ rating, title, comment });
            }
            toast.success("Review submitted!");
            setRating(0);
            setTitle("");
            setComment("");
            onClose();
        } catch (error) {
            errorMessageHandler(error as any);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-center text-black">
                        Review {profileName}
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm text-gray-500">
                        Share your experience with others.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                        <p className="font-medium text-gray-700">Rate your experience</p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-8 w-8 ${star <= rating
                                            ? "fill-primary text-primary"
                                            : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="title"
                            className="text-sm font-medium text-gray-700"
                        >
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Amazing experience!"
                            className="text-black w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="comment"
                            className="text-sm font-medium text-gray-700"
                        >
                            Your Review
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us about your experience..."
                            className="text-black min-h-[100px] w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <DialogFooter className="sm:justify-center">
                    <div className="flex w-full gap-3">
                        <Button variant="outline" onClick={onClose} className="w-full rounded-full" disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="w-full bg-primary text-white hover:bg-primary/90 rounded-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
