interface BaseMediaInputProps {
  size: number;
  url: string | undefined;
  isUploading?: boolean;
  spinner: React.ReactNode | undefined;
  onRemove?: () => void;
}

export function BaseMediaInput({
  size,
  url,
  isUploading = false,
  spinner = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[42px] h-[42px] animate-[spin_1s_linear_infinite]"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  onRemove,
}: BaseMediaInputProps) {
  const isVideo = url ? /\.(mp4|mov|webm|ogg)$/i.test(url) : false;

  return (
    <div
      className="relative aspect-square overflow-hidden rounded-input bg-flat hover:bg-flat-hover"
      style={{ width: size }}
    >
      <button
        className="absolute right-sm top-sm text-flat bg-value hover:bg-value-hover opacity-60 rounded-full cursor-pointer"
        onClick={onRemove}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[32px] h-[32px]"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      </button>
      {isUploading && (
        <div className="absolute inset-[0] flex justify-center items-center text-value bg-flat/50">
          {spinner}
        </div>
      )}
      {isVideo ? (
        <video
          src={url}
          className="w-full h-full object-cover object-center"
          muted
          playsInline
        />
      ) : (
        <img
          className="w-full h-full object-cover object-center"
          src={url}
          alt=""
        />
      )}
    </div>
  );
}
