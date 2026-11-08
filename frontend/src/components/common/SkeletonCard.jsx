export default function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3">
      <div className="skeleton h-32 w-full" />
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="flex items-center justify-between pt-2">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-3 w-12" />
      </div>
    </div>
  );
}
