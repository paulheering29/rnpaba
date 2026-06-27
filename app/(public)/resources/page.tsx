import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    name: "National & Professional Organizations",
    resources: [
      {
        title: "National Association",
        url: "#",
        desc: "Our parent national organization — standards, licensing, and advocacy.",
        tags: ["Official"],
      },
      {
        title: "Regional Consortium",
        url: "#",
        desc: "Multi-state professional consortium for our region.",
        tags: [],
      },
    ],
  },
  {
    name: "Licensing & Credentialing",
    resources: [
      {
        title: "State Licensing Board",
        url: "#",
        desc: "Official licensing requirements, renewal information, and CEU tracking.",
        tags: ["Official"],
      },
      {
        title: "National Credentialing Body",
        url: "#",
        desc: "Certification programs and credential maintenance requirements.",
        tags: [],
      },
    ],
  },
  {
    name: "Education & Training",
    resources: [
      {
        title: "Continuing Education Portal",
        url: "#",
        desc: "Online CEU courses approved by our licensing board.",
        tags: ["CEUs"],
      },
      {
        title: "University Training Program",
        url: "#",
        desc: "Local university offering graduate programs in the field.",
        tags: [],
      },
      {
        title: "Professional Webinar Library",
        url: "#",
        desc: "Free and low-cost webinars from national presenters.",
        tags: ["CEUs", "Free"],
      },
    ],
  },
  {
    name: "Research & Publications",
    resources: [
      {
        title: "Field Journal",
        url: "#",
        desc: "Peer-reviewed research and practice articles.",
        tags: [],
      },
      {
        title: "Practice Guidelines Clearinghouse",
        url: "#",
        desc: "Evidence-based practice guidelines and toolkits.",
        tags: [],
      },
    ],
  },
  {
    name: "Advocacy & Policy",
    resources: [
      {
        title: "State Legislature Bill Tracker",
        url: "#",
        desc: "Track legislation relevant to our profession in the state legislature.",
        tags: [],
      },
      {
        title: "National Advocacy Center",
        url: "#",
        desc: "Tools and talking points for professional advocacy.",
        tags: [],
      },
    ],
  },
];

const tagColors: Record<string, string> = {
  Official: "bg-green-100 text-green-800",
  CEUs: "bg-blue-100 text-blue-800",
  Free: "bg-amber-100 text-amber-800",
};

export default function ResourcesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 text-(--color-brand-green-dark)">Resources</h1>
        <p className="text-muted-foreground">
          A curated collection of links and tools for RNPABA members and the broader professional community.
        </p>
      </div>

      <div className="space-y-12">
        {categories.map((cat) => (
          <div key={cat.name}>
            <h2 className="text-lg font-semibold text-(--color-brand-green-dark) mb-4 pb-2 border-b border-(--color-border)">
              {cat.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cat.resources.map((res) => (
                <Card key={res.title} className="hover:shadow-md transition-shadow group">
                  <CardContent className="py-5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-sm text-(--color-brand-green-dark) hover:underline flex items-center gap-1"
                      >
                        {res.title}
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {res.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagColors[tag] ?? "bg-gray-100 text-gray-700"}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{res.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 border-t border-(--color-border) pt-8 text-sm text-muted-foreground">
        <p>
          Know a resource that should be listed here? Email{" "}
          <a href="mailto:board@rnpaba.org" className="text-(--color-brand-green-dark) hover:underline">
            board@rnpaba.org
          </a>{" "}
          with your suggestion.
        </p>
      </div>
    </div>
  );
}
