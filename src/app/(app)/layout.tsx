import Link from "next/link";
import {
  Coins,
  Gauge,
  Settings,
  Trophy,
  PlusCircle,
} from "lucide-react";
import { logout } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { isSingleUserMode } from "@/lib/supabase/env";

const nav = [
  { href: "/dashboard", icon: Gauge, label: "Stats" },
  { href: "/tournaments/new", icon: PlusCircle, label: "Log tournament" },
  { href: "/tournaments", icon: Trophy, label: "Tournaments" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const singleUserMode = isSingleUserMode();

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-background/90 p-4 lg:block">
        <Link className="mb-6 flex items-center gap-3 px-2" href="/dashboard">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Coins className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold">MTT Bankroll</span>
            <span className="block text-xs text-muted-foreground">Buy-ins and profit</span>
          </span>
        </Link>
        <nav className="space-y-1">
          {nav.map((item) => (
            <Button key={item.href} asChild className="w-full justify-start" variant="ghost">
              <Link href={item.href}>
                <item.icon />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
        {!singleUserMode ? (
          <form action={logout} className="absolute bottom-4 left-4 right-4">
            <Button className="w-full justify-start" type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        ) : null}
      </aside>
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex gap-2 overflow-x-auto">
          {nav.map((item) => (
            <Button key={item.href} asChild size="sm" variant="ghost">
              <Link href={item.href}>
                <item.icon />
                <span className="sr-only sm:not-sr-only">{item.label}</span>
              </Link>
            </Button>
          ))}
          {!singleUserMode ? (
            <Button asChild size="sm" variant="outline">
              <Link href="/login">Account</Link>
            </Button>
          ) : null}
        </div>
      </header>
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
