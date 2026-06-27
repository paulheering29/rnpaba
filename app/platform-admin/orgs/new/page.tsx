import Link from "next/link";
import { createOrgAction } from "../../actions";

export default function NewOrgPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <Link href="/platform-admin/orgs" className="text-sm text-gray-500 hover:text-gray-900">
          ← Organizations
        </Link>
        <h1 className="text-xl font-semibold text-gray-900 mt-2">New Organization</h1>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <form action={createOrgAction} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Organization Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              required
              placeholder="e.g. RNPABA"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="slug" className="text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              name="slug"
              required
              placeholder="e.g. rnpaba"
              pattern="[a-z0-9-]+"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <p className="text-xs text-gray-400">Lowercase letters, numbers, hyphens only. Used for the subdomain.</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tagline" className="text-sm font-medium text-gray-700">Tagline</label>
            <input
              id="tagline"
              name="tagline"
              placeholder="Short description of the org"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact_email" className="text-sm font-medium text-gray-700">Contact Email</label>
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              placeholder="board@example.org"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tier" className="text-sm font-medium text-gray-700">Tier</label>
            <select
              id="tier"
              name="tier"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
            </select>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Create Organization
            </button>
            <Link
              href="/platform-admin/orgs"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
