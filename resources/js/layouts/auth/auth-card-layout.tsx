import { Link } from "@inertiajs/react";
import type { PropsWithChildren } from "react";

import AppLogoIcon from "@/components/app-logo-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { home } from "@/routes";

interface AuthCardLayoutProps {
  name?: string;
  title?: string;
  description?: string;
}

const AuthCardLayout = ({
  children,
  title,
  description,
}: PropsWithChildren<AuthCardLayoutProps>) => (
  <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    <CardLayoutStack>
      <BrandLink />
      <CardShell title={title} description={description}>
        {children}
      </CardShell>
    </CardLayoutStack>
  </div>
);
export default AuthCardLayout;

const CardLayoutStack = ({ children }: PropsWithChildren) => (
  <div className="flex w-full max-w-md flex-col gap-6">{children}</div>
);

const BrandLink = () => (
  <Link
    href={home()}
    className="flex items-center gap-2 self-center font-medium"
  >
    <LogoMark />
  </Link>
);

const LogoMark = () => (
  <div className="flex h-9 w-9 items-center justify-center">
    <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
  </div>
);

const CardShell = ({
  children,
  title,
  description,
}: PropsWithChildren<AuthCardLayoutProps>) => (
  <Card className="rounded-xl">
    <CardHeaderContent title={title} description={description} />
    <CardBody>{children}</CardBody>
  </Card>
);

const CardHeaderContent = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => (
  <CardHeader className="px-10 pt-8 pb-0 text-center">
    <CardTitle className="text-xl">{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
);

const CardBody = ({ children }: PropsWithChildren) => (
  <CardContent className="px-10 py-8">{children}</CardContent>
);
