import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
      <div className="panel max-w-lg p-8 sm:p-10">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-[#20cfff]/30 bg-[#20cfff]/10 text-[#20cfff]">
          <Compass size={26} />
        </div>
        <span className="eyebrow">404 · Route Not Found</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
          Page not found.
        </h1>
        <p className="mt-3 text-sm leading-7 text-[#9aa8b8]">
          The page or case study you are looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="button-primary text-xs">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <Link href="/projects" className="button-secondary text-xs">
            Explore Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
