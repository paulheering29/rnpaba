"use client";

export default function CalendarError({ error }: { error: Error }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
      <p className="text-sm text-gray-500">{error.message}</p>
    </div>
  );
}
