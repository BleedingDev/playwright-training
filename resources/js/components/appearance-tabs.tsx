import {
  ComputerIcon,
  Moon01Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type { HTMLAttributes } from "react";

import { Icon } from "@/components/icon";
import { useAppearance, type Appearance } from "@/hooks/use-appearance";
import { cn } from "@/lib/utils";

const AppearanceToggleTab = ({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const { appearance, updateAppearance } = useAppearance();

  const tabs: { value: Appearance; icon: IconSvgElement; label: string }[] = [
    { icon: Sun01Icon, label: "Light", value: "light" },
    { icon: Moon01Icon, label: "Dark", value: "dark" },
    { icon: ComputerIcon, label: "System", value: "system" },
  ];

  return (
    <div
      className={cn(
        "inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800",
        className
      )}
      {...props}
    >
      {tabs.map(({ value, icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => updateAppearance(value)}
          className={cn(
            "flex items-center rounded-md px-3.5 py-1.5 transition-colors",
            appearance === value
              ? "bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100"
              : "text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60"
          )}
        >
          <Icon iconNode={icon} className="-ml-1 h-4 w-4" />
          <span className="ml-1.5 text-sm">{label}</span>
        </button>
      ))}
    </div>
  );
};
export default AppearanceToggleTab;
