import { Check, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Student",
    price: "$30",
    period: "per year",
    description: "For enrolled students pursuing a degree in the field.",
    highlight: false,
    benefits: [
      "Access to monthly newsletter",
      "Member rate on conference registration",
      "Access to online job board",
      "Voting rights at annual meeting",
      "Networking events",
    ],
  },
  {
    name: "Associate",
    price: "$75",
    period: "per year",
    description: "For professionals who are new to the field or in an adjacent role.",
    highlight: false,
    benefits: [
      "Everything in Student, plus:",
      "Access to member-only online resources",
      "Discounted workshop registration",
      "Access to conference recordings (members only)",
      "Mentorship program eligibility",
    ],
  },
  {
    name: "Professional",
    price: "$125",
    period: "per year",
    description: "For fully licensed or certified practitioners in the field.",
    highlight: true,
    benefits: [
      "Everything in Associate, plus:",
      "Access to online course library",
      "Full voting rights",
      "Committee participation",
      "Listing in the member directory",
      "Reduced rate on all events",
    ],
  },
  {
    name: "Organizational",
    price: "$300",
    period: "per year",
    description: "For agencies, schools, and organizations. Includes up to 5 member seats.",
    highlight: false,
    benefits: [
      "5 Professional memberships included",
      "Organization listing on website",
      "Preferred exhibitor pricing at conference",
      "Co-branding opportunities",
      "Priority newsletter placement",
    ],
  },
];

const faqs = [
  {
    q: "When does my membership renew?",
    a: "Memberships are annual and renew on January 1 each year. New members joining after October 1 are credited through the following December.",
  },
  {
    q: "Can I upgrade my membership type?",
    a: "Yes. Contact the membership committee to upgrade at any time. You will be billed the prorated difference.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept credit cards and checks made payable to RNPABA.",
  },
  {
    q: "Is there a group or agency discount?",
    a: "Yes — the Organizational tier covers up to 5 members at a significant discount. Contact us for agencies with larger teams.",
  },
];

export default function MembershipPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-(--color-muted) border-b border-(--color-border) py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-(--color-brand-green-dark)">Membership</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join RNPABA and connect with a network of professionals committed to advancing the field in our region.
          </p>
        </div>
      </section>

      {/* Membership tiers */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative flex flex-col ${tier.highlight ? "border-(--color-brand-green-dark) shadow-lg ring-1 ring-(--color-brand-green-dark)" : ""}`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-(--color-brand-green-dark) text-white border-0 px-3">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <div className="mt-1">
                  <span className="text-3xl font-bold text-(--color-brand-green-dark)">{tier.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">{tier.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-2 flex-1 mb-6">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-(--color-brand-green-dark) mt-0.5 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={cn(
                    "w-full",
                    tier.highlight
                      ? cn(buttonVariants(), "bg-(--color-brand-green-dark) hover:bg-(--color-brand-green) text-white")
                      : buttonVariants({ variant: "outline" })
                  )}
                >
                  Join as {tier.name}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits overview */}
      <section className="bg-(--color-muted) border-t border-(--color-border) py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-(--color-brand-green-dark)">Why Join RNPABA?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { title: "Professional Network", desc: "Connect with colleagues across the region at events, workshops, and the annual conference." },
              { title: "Continuing Education", desc: "Access courses, recordings, and workshops designed to keep you current in the field." },
              { title: "Advocacy & Community", desc: "Have a voice in regional policy discussions and professional standards through your chapter." },
            ].map(({ title, desc }) => (
              <div key={title}>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8 text-(--color-brand-green-dark)">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map(({ q, a }) => (
            <div key={q} className="border-b border-(--color-border) pb-6 last:border-0">
              <h3 className="font-semibold mb-2">{q}</h3>
              <p className="text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground mb-3">Still have questions?</p>
          <button className={cn(buttonVariants({ variant: "outline" }), "border-(--color-brand-green-dark) text-(--color-brand-green-dark) hover:bg-(--color-accent)")}>
            Contact the Membership Committee <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </section>
    </div>
  );
}
