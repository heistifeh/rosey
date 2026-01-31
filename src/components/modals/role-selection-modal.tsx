"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface RoleSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectRole: (role: 'escort' | 'client') => void;
}

export function RoleSelectionModal({ isOpen, onClose, onSelectRole }: RoleSelectionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4 bg-primary-bg rounded-2xl p-6 md:p-8 shadow-2xl border border-border-gray">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-gray hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Content */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h2 className="text-2xl font-semibold text-primary-text">
                            Continue with Google
                        </h2>
                        <p className="text-text-gray text-sm">
                            Please select how you'd like to join Rosey
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Escort Option */}
                        <button
                            onClick={() => onSelectRole('escort')}
                            className="group relative w-full p-5 rounded-xl border-2 border-border-gray hover:border-primary bg-input-bg hover:bg-input-bg/80 transition-all duration-200"
                        >
                            <div className="flex flex-col gap-2 text-left">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-primary-text group-hover:text-primary transition-colors">
                                        I'm an Escort
                                    </h3>
                                    <div className="h-5 w-5 rounded-full border-2 border-border-gray group-hover:border-primary transition-colors" />
                                </div>
                                <p className="text-sm text-text-gray">
                                    Create a profile, manage bookings, and connect with clients
                                </p>
                            </div>
                        </button>

                        {/* Client Option */}
                        <button
                            onClick={() => onSelectRole('client')}
                            className="group relative w-full p-5 rounded-xl border-2 border-border-gray hover:border-primary bg-input-bg hover:bg-input-bg/80 transition-all duration-200"
                        >
                            <div className="flex flex-col gap-2 text-left">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-primary-text group-hover:text-primary transition-colors">
                                        I'm a Client
                                    </h3>
                                    <div className="h-5 w-5 rounded-full border-2 border-border-gray group-hover:border-primary transition-colors" />
                                </div>
                                <p className="text-sm text-text-gray">
                                    Browse profiles and book companionship services
                                </p>
                            </div>
                        </button>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full rounded-[200px]"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
