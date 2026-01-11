import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-primary-bg py-6 md:py-[60px] px-4 md:px-[80px] flex flex-col ">
      <Link href="/" className="inline-flex items-center">
        <Image
          src="/images/logo.svg"
          alt="Rosey"
          width={150}
          height={40}
          className="h-auto"
          priority
        />
      </Link>
      {children}
    </div>
  );
}
