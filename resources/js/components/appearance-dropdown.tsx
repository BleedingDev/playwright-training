import {
  ComputerIcon,
  Moon01Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type { HTMLAttributes } from "react";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppearance } from "@/hooks/use-appearance";

const AppearanceToggleDropdown = ({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const { appearance, updateAppearance } = useAppearance();

  const options = [
    { icon: Sun01Icon, label: "Light", value: "light" },
    { icon: Moon01Icon, label: "Dark", value: "dark" },
    { icon: ComputerIcon, label: "System", value: "system" },
  ] as const;

  const currentIcon = getAppearanceIcon(appearance);

  return (
    <div className={className} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-md"
            />
          }
        >
          {currentIcon}
          <span className="sr-only">Toggle theme</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {options.map((option) => (
            <AppearanceOption
              key={option.value}
              icon={option.icon}
              label={option.label}
              value={option.value}
              onSelect={updateAppearance}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default AppearanceToggleDropdown;

const AppearanceOption = ({
  icon,
  label,
  value,
  onSelect,
}: {
  icon: IconSvgElement;
  label: string;
  value: "light" | "dark" | "system";
  onSelect: (value: "light" | "dark" | "system") => void;
}) => (
  <DropdownMenuItem onClick={() => onSelect(value)}>
    <AppearanceOptionLabel icon={icon} label={label} />
  </DropdownMenuItem>
);

const AppearanceOptionLabel = ({
  icon,
  label,
}: {
  icon: IconSvgElement;
  label: string;
}) => (
  <span className="flex items-center gap-2">
    <Icon iconNode={icon} className="h-5 w-5" />
    <span>{label}</span>
  </span>
);

const getAppearanceIcon = (appearance: "light" | "dark" | "system") => {
  switch (appearance) {
    case "dark": {
      return <Icon iconNode={Moon01Icon} className="h-5 w-5" />;
    }
    case "light": {
      return <Icon iconNode={Sun01Icon} className="h-5 w-5" />;
    }
    default: {
      return <Icon iconNode={ComputerIcon} className="h-5 w-5" />;
    }
  }
};
