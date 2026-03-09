export default function Avatar({ name, src, className = "w-10 h-10" }) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  return (
    <div
      className={`${className} rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
}
