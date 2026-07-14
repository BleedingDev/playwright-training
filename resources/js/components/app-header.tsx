import {
  BookOpen01Icon,
  Folder01Icon,
  LayoutGridIcon,
  Menu01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Link, usePage } from "@inertiajs/react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icon } from "@/components/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserMenuContent } from "@/components/user-menu-content";
import { useInitials } from "@/hooks/use-initials";
import { cn } from "@/lib/utils";
import { dashboard } from "@/routes";
import type { BreadcrumbItem, NavItem, SharedData } from "@/types";

import AppLogo from "./app-logo";
import AppLogoIcon from "./app-logo-icon";

const mainNavItems: NavItem[] = [
  {
    href: dashboard(),
    icon: LayoutGridIcon,
    title: "Dashboard",
  },
];

const rightNavItems: NavItem[] = [
  {
    href: "https://github.com/laravel/react-starter-kit",
    icon: Folder01Icon,
    title: "Repository",
  },
  {
    href: "https://laravel.com/docs/starter-kits#react",
    icon: BookOpen01Icon,
    title: "Documentation",
  },
];

const activeItemStyles =
  "text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100";

const getNavItemHref = (item: NavItem) =>
  typeof item.href === "string" ? item.href : item.href.url;

const getNavItemKey = (item: NavItem) =>
  `${item.title}-${getNavItemHref(item)}`;

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

export const AppHeader = ({ breadcrumbs = [] }: AppHeaderProps) => {
  const page = usePage<SharedData>();
  const { auth } = page.props;
  const getInitials = useInitials();
  return (
    <>
      <div className="border-b border-sidebar-border/80">
        <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
          <MobileNav />
          <AppLogoLink />
          <DesktopNav activeUrl={page.url} />
          <HeaderActions auth={auth} getInitials={getInitials} />
        </div>
      </div>
      <BreadcrumbRow breadcrumbs={breadcrumbs} />
    </>
  );
};

const AppLogoLink = () => (
  <Link href={dashboard()} prefetch className="flex items-center space-x-2">
    <AppLogo />
  </Link>
);

const MobileNav = () => (
  <div className="lg:hidden">
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 h-[34px] w-[34px]"
          />
        }
      >
        <Icon iconNode={Menu01Icon} className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetHeader className="flex justify-start text-left">
          <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
        </SheetHeader>
        <MobileNavContent />
      </SheetContent>
    </Sheet>
  </div>
);

const MobileNavContent = () => (
  <div className="flex h-full flex-1 flex-col space-y-4 p-4">
    <MobileNavSection items={mainNavItems} />
    <MobileNavSection items={rightNavItems} isExternal />
  </div>
);

const MobileNavSection = ({
  items,
  isExternal = false,
}: {
  items: NavItem[];
  isExternal?: boolean;
}) => (
  <div className="flex h-full flex-col space-y-4 text-sm">
    {items.map((item) => (
      <NavItemLink
        key={getNavItemKey(item)}
        item={item}
        className="flex items-center space-x-2 font-medium"
        isExternal={isExternal}
      />
    ))}
  </div>
);

const NavItemLink = ({
  item,
  className,
  isExternal,
}: {
  item: NavItem;
  className?: string;
  isExternal?: boolean;
}) => {
  const content = (
    <>
      {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
      <span>{item.title}</span>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={getNavItemHref(item)}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  );
};

const DesktopNav = ({ activeUrl }: { activeUrl: string }) => (
  <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
    <DesktopNavigationMenu activeUrl={activeUrl} />
  </div>
);

const DesktopNavigationMenu = ({ activeUrl }: { activeUrl: string }) => (
  <NavigationMenu className="flex h-full items-stretch">
    <DesktopNavigationList activeUrl={activeUrl} />
  </NavigationMenu>
);

const DesktopNavigationList = ({ activeUrl }: { activeUrl: string }) => (
  <NavigationMenuList className="flex h-full items-stretch space-x-2">
    {mainNavItems.map((item) => (
      <DesktopNavigationItem
        key={getNavItemKey(item)}
        item={item}
        isActive={activeUrl === getNavItemHref(item)}
      />
    ))}
  </NavigationMenuList>
);

const DesktopNavigationItem = ({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) => (
  <NavigationMenuItem className="relative flex h-full items-center">
    <DesktopNavigationLink item={item} isActive={isActive} />
    {isActive ? <ActiveIndicator /> : null}
  </NavigationMenuItem>
);

const DesktopNavigationLink = ({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) => (
  <Link
    href={item.href}
    className={cn(
      navigationMenuTriggerStyle(),
      isActive && activeItemStyles,
      "h-9 cursor-pointer px-3"
    )}
  >
    {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
    {item.title}
  </Link>
);

const ActiveIndicator = () => (
  <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white" />
);

const HeaderActions = ({
  auth,
  getInitials,
}: {
  auth: SharedData["auth"];
  getInitials: (name: string) => string;
}) => (
  <div className="ml-auto flex items-center space-x-2">
    <div className="relative flex items-center space-x-1">
      <SearchButton />
      <RightNavLinks />
    </div>
    <UserMenu auth={auth} getInitials={getInitials} />
  </div>
);

const SearchButton = () => (
  <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer">
    <Icon
      iconNode={Search01Icon}
      className="!size-5 opacity-80 group-hover:opacity-100"
    />
  </Button>
);

const RightNavLinks = () => (
  <div className="hidden lg:flex">
    {rightNavItems.map((item) => (
      <RightNavTooltipLink key={getNavItemKey(item)} item={item} />
    ))}
  </div>
);

const RightNavTooltipLink = ({ item }: { item: NavItem }) => (
  <TooltipProvider delay={0}>
    <Tooltip>
      <TooltipTrigger>
        <RightNavIconLink item={item} />
      </TooltipTrigger>
      <TooltipContent>
        <p>{item.title}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const RightNavIconLink = ({ item }: { item: NavItem }) => (
  <a
    href={getNavItemHref(item)}
    target="_blank"
    rel="noopener noreferrer"
    className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
  >
    <span className="sr-only">{item.title}</span>
    {item.icon && (
      <Icon
        iconNode={item.icon}
        className="size-5 opacity-80 group-hover:opacity-100"
      />
    )}
  </a>
);

const UserMenu = ({
  auth,
  getInitials,
}: {
  auth: SharedData["auth"];
  getInitials: (name: string) => string;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      render={<Button variant="ghost" className="size-10 rounded-full p-1" />}
    >
      <Avatar className="size-8 overflow-hidden rounded-full">
        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
          {getInitials(auth.user.name)}
        </AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="end">
      <UserMenuContent user={auth.user} />
    </DropdownMenuContent>
  </DropdownMenu>
);

const BreadcrumbRow = ({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) =>
  breadcrumbs.length > 1 ? (
    <div className="flex w-full border-b border-sidebar-border/70">
      <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
    </div>
  ) : null;
