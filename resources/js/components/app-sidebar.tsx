import { LayoutGridIcon } from "@hugeicons/core-free-icons";
import { Link, usePage } from "@inertiajs/react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { dashboard } from "@/routes";
import type { NavItem, SharedData } from "@/types";

import AppLogo from "./app-logo";

const navItemsByRole: Record<string, NavItem[]> = {
  admin: [{ href: "/admin", icon: LayoutGridIcon, title: "Administrácia" }],
  customer: [
    { href: dashboard(), icon: LayoutGridIcon, title: "Prehľad firmy" },
  ],
  operator: [
    {
      href: "/operator/requests",
      icon: LayoutGridIcon,
      title: "Požiadavky",
    },
  ],
};

export const AppSidebar = () => (
  <Sidebar collapsible="icon" variant="inset">
    <AppSidebarHeader />
    <AppSidebarMain />
    <AppSidebarFooter />
  </Sidebar>
);

const AppSidebarHeader = () => (
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarLogoLink />
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
);

const SidebarLogoLink = () => (
  <SidebarMenuButton size="lg" render={<Link href={dashboard()} prefetch />}>
    <AppLogo />
  </SidebarMenuButton>
);

const AppSidebarMain = () => {
  const { auth } = usePage<SharedData>().props;
  const items = navItemsByRole[auth.user.role] ?? navItemsByRole.customer;

  return (
    <SidebarContent>
      <NavMain items={items} />
    </SidebarContent>
  );
};

const AppSidebarFooter = () => (
  <SidebarFooter>
    <NavUser />
  </SidebarFooter>
);
