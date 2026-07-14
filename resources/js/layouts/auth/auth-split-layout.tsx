import { Link, usePage } from "@inertiajs/react";
import type { PropsWithChildren } from "react";

import AppLogoIcon from "@/components/app-logo-icon";
import { home } from "@/routes";
import type { SharedData } from "@/types";

interface AuthLayoutProps {
  title?: string;
  description?: string;
}

const AuthSplitLayout = ({
  children,
  title,
  description,
}: PropsWithChildren<AuthLayoutProps>) => {
  const { name, quote } = usePage<SharedData>().props;

  return (
    <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
      <SplitLeftPanel name={name} quote={quote} />
      <SplitRightPanel title={title} description={description}>
        {children}
      </SplitRightPanel>
    </div>
  );
};
export default AuthSplitLayout;

const SplitLeftPanel = ({
  name,
  quote,
}: {
  name: string;
  quote?: SharedData["quote"];
}) => (
  <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
    <LeftPanelOverlay />
    <LeftPanelBrand name={name} />
    <LeftPanelQuote quote={quote} />
  </div>
);

const LeftPanelOverlay = () => <div className="absolute inset-0 bg-zinc-900" />;

const LeftPanelBrand = ({ name }: { name: string }) => (
  <Link
    href={home()}
    className="relative z-20 flex items-center text-lg font-medium"
  >
    <AppLogoIcon className="mr-2 size-8 fill-current text-white" />
    {name}
  </Link>
);

const LeftPanelQuote = ({ quote }: { quote?: SharedData["quote"] }) =>
  quote ? (
    <div className="relative z-20 mt-auto">
      <QuoteBlock quote={quote} />
    </div>
  ) : null;

const QuoteBlock = ({ quote }: { quote: SharedData["quote"] }) => (
  <blockquote className="space-y-2">
    <p className="text-lg">&ldquo;{quote.message}&rdquo;</p>
    <footer className="text-sm text-neutral-300">{quote.author}</footer>
  </blockquote>
);

const SplitRightPanel = ({
  children,
  title,
  description,
}: PropsWithChildren<AuthLayoutProps>) => (
  <div className="w-full lg:p-8">
    <RightPanelContent title={title} description={description}>
      {children}
    </RightPanelContent>
  </div>
);

const RightPanelContent = ({
  children,
  title,
  description,
}: PropsWithChildren<AuthLayoutProps>) => (
  <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
    <MobileLogo />
    <HeaderText title={title} description={description} />
    {children}
  </div>
);

const MobileLogo = () => (
  <Link
    href={home()}
    className="relative z-20 flex items-center justify-center lg:hidden"
  >
    <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
  </Link>
);

const HeaderText = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => (
  <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
    <h1 className="text-xl font-medium">{title}</h1>
    <p className="text-sm text-balance text-muted-foreground">{description}</p>
  </div>
);
