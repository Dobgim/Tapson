import {
  BatteryCharging,
  Bike,
  Car,
  Flag,
  Flame,
  Grid3x3,
  Mountain,
  Sailboat,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Bike,
  Mountain,
  Car,
  Waves,
  Sailboat,
  Flag,
  Zap,
  Flame,
  BatteryCharging,
  Grid3x3,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Grid3x3;
  return <Icon className={className} aria-hidden="true" />;
}
