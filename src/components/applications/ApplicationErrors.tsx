export function ApplicationNotFoundError() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-text-color/80">Applications Not Found</h1>
      <p className="text-sm md:text-md text-text-color">Please Add Some Applications.</p>
    </div>
  );
}

export function ApplicationLoadingError({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-text-color/80">Error Loading Applications</h1>
      <p className="text-sm md:text-md text-text-color">{error.message}</p>
    </div>
  );
}