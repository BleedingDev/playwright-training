import type { ComponentPropsWithoutRef } from "react";

import { Icon } from "@/components/icon";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/types";

export const NavFooter = ({
  items,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
  items: NavItem[];
}) => (
  <SidebarGroup
    {...props}
    className={`group-data-[collapsible=icon]:p-0 ${className || ""}`}
  >
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map((item) => (
          <NavFooterItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);

const NavFooterItem = ({ item }: { item: NavItem }) => (
  <SidebarMenuItem>
    <SidebarMenuButton
      className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
      render={(renderProps) => (
        <a
          href={getNavHref(item)}
          target="_blank"
          rel="noopener noreferrer"
          {...renderProps}
        >
          {renderProps.children}
        </a>
      )}
    >
      <NavFooterLabel item={item} />
    </SidebarMenuButton>
  </SidebarMenuItem>
);

const NavFooterLabel = ({ item }: { item: NavItem }) => (
  <span className="flex items-center gap-2">
    {item.icon ? <Icon iconNode={item.icon} className="h-5 w-5" /> : null}
    <span>{item.title}</span>
  </span>
);

const getNavHref = (item: NavItem) =>
  typeof item.href === "string" ? item.href : item.href.url;
