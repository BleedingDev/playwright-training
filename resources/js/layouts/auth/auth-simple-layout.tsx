import { Link } from "@inertiajs/react";
import type { PropsWithChildren } from "react";

import AppLogoIcon from "@/components/app-logo-icon";
import { home } from "@/routes";

interface AuthLayoutProps {
  name?: string;
  title?: string;
  description?: string;
}

const AuthSimpleLayout = ({
  children,
  title,
  description,
}: PropsWithChildren<AuthLayoutProps>) => (
  <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
    <LayoutWidth>
      <LayoutStack>
        <AuthHeader title={title} description={description} />
        {children}
      </LayoutStack>
    </LayoutWidth>
  </div>
);
export default AuthSimpleLayout;

const LayoutWidth = ({ children }: PropsWithChildren) => (
  <div className="w-full max-w-sm">{children}</div>
);

const LayoutStack = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col gap-8">{children}</div>
);

const AuthHeader = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => (
  <div className="flex flex-col items-center gap-4">
    <LogoLink title={title} />
    <HeaderText title={title} description={description} />
  </div>
);

const LogoLink = ({ title }: { title?: string }) => (
  <Link href={home()} className="flex flex-col items-center gap-2 font-medium">
    <LogoMark />
    <span className="sr-only">{title}</span>
  </Link>
);

const LogoMark = () => (
  <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
    <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
  </div>
);

const HeaderText = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => (
  <div className="space-y-2 text-center">
    <h1 className="text-xl font-medium">{title}</h1>
    <p className="text-center text-sm text-muted-foreground">{description}</p>
  </div>
);
