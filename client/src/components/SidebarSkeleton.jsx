export default function SidebarSkeleton() {
  return (
    <div className="w-72 p-4 space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-base-300"></div>
          <div className="flex-1 h-4 bg-base-300 rounded"></div>
        </div>
      ))}
    </div>
  );
}
