import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Coins,
  FileUp,
  Gauge,
  Landmark,
  ListChecks,
  Settings,
  ShieldCheck,
  Trophy,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/dashboard", icon: Gauge, label: "Dashboard" },
  { href: "/bankroll", icon: Landmark, label: "Bankroll" },
  { href: "/tournaments", icon: Trophy, label: "Tournaments" },
  { href: "/sessions", icon: CalendarDays, label: "Sessions" },
  { href: "/series", icon: ClipboardList, label: "Series" },
  { href: "/satellites", icon: WalletCards, label: "Satellites" },
  { href: "/planner", icon: ListChecks, label: "Planner" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/rules", icon: ShieldCheck, label: "Rules" },
  { href: "/import", icon: FileUp, label: "Import" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-background/90 p-4 lg:block">
        <Link className="mb-6 flex items-center gap-3 px-2" href="/dashboard">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Coins className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold">MTT Bankroll</span>
            <span className="block text-xs text-muted-foreground">Tournament risk desk</span>
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
        </div>
      </header>
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
