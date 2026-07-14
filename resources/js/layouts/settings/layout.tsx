import { Link } from "@inertiajs/react";
import type { PropsWithChildren } from "react";

import Heading from "@/components/heading";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { edit as editAppearance } from "@/routes/appearance";
import { edit as editPassword } from "@/routes/password";
import { show } from "@/routes/two-factor";
import { edit } from "@/routes/user-profile";
import type { NavItem } from "@/types";

const sidebarNavItems: NavItem[] = [
  {
    href: edit(),
    icon: null,
    title: "Profile",
  },
  {
    href: editPassword(),
    icon: null,
    title: "Password",
  },
  {
    href: show(),
    icon: null,
    title: "Two-Factor Auth",
  },
  {
    href: editAppearance(),
    icon: null,
    title: "Appearance",
  },
];

const SettingsLayout = ({ children }: PropsWithChildren) => {
  if (typeof window === "undefined") {
    return null;
  }

  const currentPath = window.location.pathname;

  return (
    <div className="px-4 py-6">
      <Heading
        title="Settings"
        description="Manage your profile and account settings"
      />
      <SettingsLayoutBody currentPath={currentPath}>
        {children}
      </SettingsLayoutBody>
    </div>
  );
};
export default SettingsLayout;

const SettingsLayoutBody = ({
  children,
  currentPath,
}: PropsWithChildren<{ currentPath: string }>) => (
  <div className="flex flex-col lg:flex-row lg:space-x-12">
    <SettingsSidebar currentPath={currentPath} />
    <SettingsDivider />
    <SettingsContent>{children}</SettingsContent>
  </div>
);

const SettingsSidebar = ({ currentPath }: { currentPath: string }) => (
  <aside className="w-full max-w-xl lg:w-48">
    <SettingsNav currentPath={currentPath} />
  </aside>
);

const SettingsNav = ({ currentPath }: { currentPath: string }) => (
  <nav className="flex flex-col space-y-1 space-x-0">
    {sidebarNavItems.map((item) => (
      <SettingsNavItem
        key={getNavItemKey(item)}
        item={item}
        currentPath={currentPath}
      />
    ))}
  </nav>
);

const SettingsNavItem = ({
  item,
  currentPath,
}: {
  item: NavItem;
  currentPath: string;
}) => {
  const hrefValue = getNavHref(item);

  return (
    <Button
      size="sm"
      variant="ghost"
      className={cn("w-full justify-start", {
        "bg-muted": currentPath === hrefValue,
      })}
      render={<Link href={item.href} />}
    >
      <SettingsNavLabel item={item} />
    </Button>
  );
};

const SettingsNavLabel = ({ item }: { item: NavItem }) => (
  <span className="flex items-center gap-2">
    {item.icon ? <Icon iconNode={item.icon} className="h-4 w-4" /> : null}
    {item.title}
  </span>
);

const SettingsDivider = () => <Separator className="my-6 lg:hidden" />;

const SettingsContent = ({ children }: PropsWithChildren) => (
  <div className="flex-1 md:max-w-2xl">
    <section className="max-w-xl space-y-12">{children}</section>
  </div>
);

const getNavHref = (item: NavItem) =>
  typeof item.href === "string" ? item.href : item.href.url;

const getNavItemKey = (item: NavItem) => `${item.title}-${getNavHref(item)}`;
