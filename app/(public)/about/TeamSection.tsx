"use client";

import { useState } from "react";
import { X, Mail, Phone } from "lucide-react";
import type { TeamMember } from "@/lib/types";

function Avatar({ member, size }: { member: TeamMember; size: "md" | "lg" }) {
  const cls = size === "lg"
    ? "h-28 w-28 text-3xl"
    : "h-20 w-20 text-2xl";
  if (member.avatar_url) {
    return (
      <img
        src={member.avatar_url}
        alt={member.name}
        className={`${cls} rounded-full object-cover ring-4 ring-white shadow-md`}
      />
    );
  }
  return (
    <div className={`${cls} rounded-full bg-(--color-accent) flex items-center justify-center ring-4 ring-white shadow-md`}>
      <span className="font-bold text-(--color-brand-green-dark)">{member.name.charAt(0)}</span>
    </div>
  );
}

export function TeamSection({ members, label }: { members: TeamMember[]; label: string }) {
  const [selected, setSelected] = useState<TeamMember | null>(null);

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-10 text-(--color-brand-green-dark)">{label}</h2>
        {members.length === 0 ? (
          <p className="text-muted-foreground">No team members listed yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {members.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelected(member)}
                className="group bg-white rounded-2xl border border-(--color-border) p-6 text-center hover:shadow-lg hover:border-transparent hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col items-center"
              >
                <div className="mb-4">
                  <Avatar member={member} size="md" />
                </div>
                <div className="font-semibold text-gray-900 leading-snug">{member.name}</div>
                {member.title && (
                  <div className="text-xs text-(--color-brand-green-dark) font-medium mt-1">{member.title}</div>
                )}
                {member.bio && (
                  <div className="text-xs text-gray-400 mt-2 group-hover:text-(--color-brand-green-dark) transition-colors">
                    View bio →
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Backdrop */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setSelected(null)}
        />
      )}

      {/* Bio sheet */}
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-[22rem] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out overflow-hidden"
        style={{ transform: selected ? "translateX(0)" : "translateX(100%)" }}
      >
        {selected && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
              <span className="font-semibold text-gray-900 truncate">{selected.name}</span>
              <button
                onClick={() => setSelected(null)}
                className="ml-2 p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-5 py-6 space-y-5">
              {/* Avatar + name */}
              <div className="flex flex-col items-center text-center gap-3">
                <Avatar member={selected} size="lg" />
                <div>
                  <div className="font-bold text-gray-900 text-lg leading-tight">{selected.name}</div>
                  {selected.title && (
                    <div className="text-sm text-(--color-brand-green-dark) font-medium mt-0.5">{selected.title}</div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {selected.bio && (
                <p className="text-sm text-gray-600 leading-relaxed">{selected.bio}</p>
              )}

              {/* Contact info */}
              {(selected.email || selected.phone || selected.linkedin_url) && (
                <div className="space-y-2 pt-2 border-t">
                  {selected.email && (
                    <a
                      href={`mailto:${selected.email}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-(--color-brand-green-dark) transition-colors"
                    >
                      <Mail className="h-4 w-4 shrink-0" />
                      {selected.email}
                    </a>
                  )}
                  {selected.phone && (
                    <a
                      href={`tel:${selected.phone}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-(--color-brand-green-dark) transition-colors"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      {selected.phone}
                    </a>
                  )}
                  {selected.linkedin_url && (
                    <a
                      href={selected.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-(--color-brand-green-dark) transition-colors"
                    >
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
