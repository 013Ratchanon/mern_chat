export default function AuthPanel({ title, description }) {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center flex-1 p-12 bg-base-200">
      <div className="grid grid-cols-3 gap-3 w-48 mb-10">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-base-300"
            aria-hidden
          />
        ))}
      </div>
      <h2 className="text-2xl font-bold text-base-content mb-2">{title}</h2>
      <p className="text-base-content/70 text-center max-w-xs">{description}</p>
    </div>
  );
}
