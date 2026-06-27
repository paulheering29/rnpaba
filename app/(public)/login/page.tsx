import Link from "next/link";
import { TreePine, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-(--color-muted)">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 rounded-full bg-(--color-brand-green-dark) items-center justify-center mb-3">
            <TreePine className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-(--color-brand-green-dark)">RNPABA</h1>
          <p className="text-sm text-muted-foreground mt-1">Member Login</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <form className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-(--color-input) bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-(--color-ring) focus:border-transparent"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <a href="#" className="text-xs text-(--color-brand-green-dark) hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-md border border-(--color-input) bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-(--color-ring) focus:border-transparent"
                  autoComplete="current-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-(--color-brand-green-dark) hover:bg-(--color-brand-green) text-white"
              >
                <Lock className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Not a member yet?{" "}
          <Link href="/membership" className="text-(--color-brand-green-dark) font-medium hover:underline">
            Join RNPABA
          </Link>
        </div>

        {/* Member benefits callout */}
        <div className="mt-8 bg-(--color-accent) rounded-lg p-4 text-sm">
          <p className="font-semibold text-(--color-brand-green-dark) mb-2">Member benefits include:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Online course library</li>
            <li>• Conference session recordings</li>
            <li>• Member-only resources & tools</li>
            <li>• Discounted event registration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
