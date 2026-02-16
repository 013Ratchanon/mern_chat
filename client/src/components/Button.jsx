export default function Button({ children, type = "button", className = "", ...props }) {
  return (
    <button
      type={type}
      className={`w-full py-3 rounded-lg btn btn-primary font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
