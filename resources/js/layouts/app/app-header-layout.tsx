import type { PropsWithChildren } from "react";

import { AppContent } from "@/components/app-content";
import { AppHeader } from "@/components/app-header";
import { AppShell } from "@/components/app-shell";
import type { BreadcrumbItem } from "@/types";

const AppHeaderLayout = ({
  children,
  breadcrumbs,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) => (
  <AppShell>
    <AppHeader breadcrumbs={breadcrumbs} />
    <AppContent>{children}</AppContent>
  </AppShell>
);
export default AppHeaderLayout;
