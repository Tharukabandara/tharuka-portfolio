import { BlurText } from "@/components/animations/blur-text";

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">
        <span className="status-dot" />
        {eyebrow}
      </span>
      <h1 className="mt-4 text-4xl font-bold tracking-[-.05em] sm:text-5xl">
        <BlurText text={title} />
      </h1>
      <p className="mt-4 text-sm leading-7">{description}</p>
    </div>
  );
}
