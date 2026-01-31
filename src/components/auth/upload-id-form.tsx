"use client";

import { Button } from "@/components/ui/button";
import { Upload, Camera, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";

export function UploadIdForm() {
    const router = useRouter();
    const [idImage, setIdImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size must be less than 10MB');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setIdImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNext = async () => {
        if (!idImage) {
            toast.error('Please upload your ID card first');
            return;
        }

        setIsUploading(true);
        try {
            // TODO: Upload ID image to storage
            // await apiBuilder.verification.uploadIdCard(idImage);

            toast.success('ID card uploaded successfully!');
            router.push('/take-photo');
        } catch (error) {
            console.error('Failed to upload ID:', error);
            toast.error('Failed to upload ID card');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRetake = () => {
        setIdImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center flex-1 w-full px-4">
            <div className="w-full max-w-[320px] md:max-w-md lg:max-w-[600px] flex flex-col gap-6 sm:gap-10">
                {/* Header */}
                <div className="flex flex-col items-center gap-4 sm:gap-2 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text">
                        Upload Your ID Card
                    </h1>
                    <p className="text-text-gray text-sm sm:text-base font-normal max-w-md">
                        Please upload a clear photo of your government-issued ID (Driver's License, Passport, or National ID)
                    </p>
                </div>

                {/* ID Preview or Upload Area */}
                <div className="flex flex-col gap-6">
                    {idImage ? (
                        // Preview uploaded ID
                        <div className="relative w-full aspect-[5/3] rounded-2xl overflow-hidden border-2 border-border-gray bg-input-bg">
                            <Image
                                src={idImage}
                                alt="ID Card Preview"
                                fill
                                className="object-contain"
                            />
                        </div>
                    ) : (
                        // Upload area
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-full aspect-[5/3] rounded-2xl border-2 border-dashed border-border-gray bg-input-bg hover:border-primary transition-colors cursor-pointer group"
                        >
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                                <div className="w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                                    <Upload className="w-8 h-8 text-primary" />
                                </div>
                                <div className="text-center">
                                    <p className="text-primary-text font-medium mb-1">
                                        Click to upload ID card
                                    </p>
                                    <p className="text-text-gray text-sm">
                                        PNG, JPG or JPEG (max. 10MB)
                                    </p>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="bg-input-bg rounded-xl p-4 sm:p-6 border border-border-gray">
                        <h3 className="text-primary-text font-semibold mb-3 flex items-center gap-2">
                            <Camera className="w-5 h-5 text-primary" />
                            Tips for a clear photo:
                        </h3>
                        <ul className="space-y-2 text-text-gray text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Ensure all text and photo are clearly visible</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Use good lighting - avoid shadows and glare</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Place ID on a dark, plain background</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Make sure the ID is not expired</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    {idImage && (
                        <Button
                            type="button"
                            onClick={handleRetake}
                            variant="outline"
                            className="w-full sm:flex-1 rounded-[200px] text-white font-semibold text-base"
                            size="default"
                        >
                            Upload Different Photo
                        </Button>
                    )}
                    <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!idImage || isUploading}
                        className="w-full sm:flex-1 rounded-[200px] text-white font-semibold text-base"
                        size="default"
                    >
                        {isUploading ? 'Uploading...' : 'Continue'}
                    </Button>
                </div>

                {/* Privacy Note */}
                <p className="text-text-gray text-xs text-center">
                    🔒 Your information is encrypted and stored securely. We never share your personal data.
                </p>
            </div>
        </div>
    );
}
