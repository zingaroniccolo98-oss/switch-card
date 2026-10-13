import Image from "next/image";

const supabaseHost = "aiarktzfrvvtafoqtbkz.supabase.co";

export function CardFace({
  name,
  number,
  imageUrl,
  className = "h-28 w-20",
}: {
  name: string;
  number: string;
  imageUrl: string | null;
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-[#1d4ed8] to-[#0b1220] shadow-md ring-2 ring-[#f5c16c] ${className}`}
    >
      {imageUrl ? (
        imageUrl.includes(supabaseHost) ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          // Catalog hosts are not known ahead of time, so this image stays unoptimized.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        )
      ) : (
        <div className="flex h-full flex-col justify-between p-2 text-white">
          <span className="text-[10px] font-bold tracking-wide">{number}</span>
          <span className="line-clamp-3 text-[11px] font-semibold leading-tight">
            {name}
          </span>
        </div>
      )}
    </div>
  );
}
