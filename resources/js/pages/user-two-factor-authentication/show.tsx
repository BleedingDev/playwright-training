import { Shield01Icon, Shield02Icon } from "@hugeicons/core-free-icons";
import { Form, Head } from "@inertiajs/react";
import { useState } from "react";

import HeadingSmall from "@/components/heading-small";
import { Icon } from "@/components/icon";
import TwoFactorRecoveryCodes from "@/components/two-factor-recovery-codes";
import TwoFactorSetupModal from "@/components/two-factor-setup-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTwoFactorAuth } from "@/hooks/use-two-factor-auth";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/settings/layout";
import { disable, enable, show } from "@/routes/two-factor";
import type { BreadcrumbItem } from "@/types";

interface TwoFactorProps {
  twoFactorEnabled?: boolean;
}

interface TwoFactorContentProps {
  clearSetupData: () => void;
  closeSetupModal: () => void;
  errors: string[];
  fetchRecoveryCodes: () => Promise<void>;
  fetchSetupData: () => Promise<void>;
  hasSetupData: boolean;
  manualSetupKey: string | null;
  openSetupModal: () => void;
  qrCodeSvg: string | null;
  recoveryCodesList: string[];
  showSetupModal: boolean;
  twoFactorEnabled: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    href: show.url(),
    title: "Two-Factor Authentication",
  },
];

const TwoFactor = ({ twoFactorEnabled = false }: TwoFactorProps) => {
  const {
    qrCodeSvg,
    hasSetupData,
    manualSetupKey,
    clearSetupData,
    fetchSetupData,
    recoveryCodesList,
    fetchRecoveryCodes,
    errors,
  } = useTwoFactorAuth();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const openSetupModal = () => {
    setShowSetupModal(true);
  };
  const closeSetupModal = () => {
    setShowSetupModal(false);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Two-Factor Authentication" />
      <TwoFactorContent
        twoFactorEnabled={twoFactorEnabled}
        qrCodeSvg={qrCodeSvg}
        hasSetupData={hasSetupData}
        manualSetupKey={manualSetupKey}
        clearSetupData={clearSetupData}
        fetchSetupData={fetchSetupData}
        recoveryCodesList={recoveryCodesList}
        fetchRecoveryCodes={fetchRecoveryCodes}
        errors={errors}
        showSetupModal={showSetupModal}
        openSetupModal={openSetupModal}
        closeSetupModal={closeSetupModal}
      />
    </AppLayout>
  );
};
export default TwoFactor;

const TwoFactorContent = ({
  twoFactorEnabled,
  qrCodeSvg,
  hasSetupData,
  manualSetupKey,
  clearSetupData,
  fetchSetupData,
  recoveryCodesList,
  fetchRecoveryCodes,
  errors,
  showSetupModal,
  openSetupModal,
  closeSetupModal,
}: TwoFactorContentProps) => (
  <SettingsLayout>
    <TwoFactorPanel
      twoFactorEnabled={twoFactorEnabled}
      hasSetupData={hasSetupData}
      recoveryCodesList={recoveryCodesList}
      fetchRecoveryCodes={fetchRecoveryCodes}
      errors={errors}
      openSetupModal={openSetupModal}
    />
    <TwoFactorSetupModal
      isOpen={showSetupModal}
      onClose={closeSetupModal}
      twoFactorEnabled={twoFactorEnabled}
      qrCodeSvg={qrCodeSvg}
      manualSetupKey={manualSetupKey}
      clearSetupData={clearSetupData}
      fetchSetupData={fetchSetupData}
      errors={errors}
    />
  </SettingsLayout>
);

const TwoFactorPanel = ({
  twoFactorEnabled,
  hasSetupData,
  recoveryCodesList,
  fetchRecoveryCodes,
  errors,
  openSetupModal,
}: Pick<
  TwoFactorContentProps,
  | "twoFactorEnabled"
  | "hasSetupData"
  | "recoveryCodesList"
  | "fetchRecoveryCodes"
  | "errors"
  | "openSetupModal"
>) => (
  <div className="space-y-6">
    <HeadingSmall
      title="Two-Factor Authentication"
      description="Manage your two-factor authentication settings"
    />
    <TwoFactorStatusSection
      twoFactorEnabled={twoFactorEnabled}
      hasSetupData={hasSetupData}
      recoveryCodesList={recoveryCodesList}
      fetchRecoveryCodes={fetchRecoveryCodes}
      errors={errors}
      openSetupModal={openSetupModal}
    />
  </div>
);

const TwoFactorStatusSection = ({
  twoFactorEnabled,
  hasSetupData,
  recoveryCodesList,
  fetchRecoveryCodes,
  errors,
  openSetupModal,
}: Pick<
  TwoFactorContentProps,
  | "twoFactorEnabled"
  | "hasSetupData"
  | "recoveryCodesList"
  | "fetchRecoveryCodes"
  | "errors"
  | "openSetupModal"
>) =>
  twoFactorEnabled ? (
    <EnabledSection
      recoveryCodesList={recoveryCodesList}
      fetchRecoveryCodes={fetchRecoveryCodes}
      errors={errors}
    />
  ) : (
    <DisabledSection
      hasSetupData={hasSetupData}
      openSetupModal={openSetupModal}
    />
  );

const EnabledSection = ({
  recoveryCodesList,
  fetchRecoveryCodes,
  errors,
}: Pick<
  TwoFactorContentProps,
  "recoveryCodesList" | "fetchRecoveryCodes" | "errors"
>) => (
  <div className="flex flex-col items-start justify-start space-y-4">
    <EnabledBadge />
    <EnabledDescription />
    <TwoFactorRecoveryCodes
      recoveryCodesList={recoveryCodesList}
      fetchRecoveryCodes={fetchRecoveryCodes}
      errors={errors}
    />
    <DisableForm />
  </div>
);

const EnabledBadge = () => <Badge variant="default">Enabled</Badge>;

const EnabledDescription = () => (
  <p className="text-muted-foreground">
    With two-factor authentication enabled, you will be prompted for a secure,
    random pin during login, which you can retrieve from the TOTP-supported
    application on your phone.
  </p>
);

const DisableForm = () => (
  <Form {...disable.form()}>
    {({ processing }) => <DisableButton processing={processing} />}
  </Form>
);

const DisableButton = ({ processing }: { processing: boolean }) => (
  <Button variant="destructive" type="submit" disabled={processing}>
    <DisableButtonContent />
  </Button>
);

const DisableButtonContent = () => (
  <span className="inline-flex items-center gap-2">
    <Icon iconNode={Shield02Icon} />
    <span>Disable 2FA</span>
  </span>
);

const DisabledSection = ({
  hasSetupData,
  openSetupModal,
}: Pick<TwoFactorContentProps, "hasSetupData" | "openSetupModal">) => (
  <div className="flex flex-col items-start justify-start space-y-4">
    <DisabledBadge />
    <DisabledDescription />
    <SetupAction hasSetupData={hasSetupData} openSetupModal={openSetupModal} />
  </div>
);

const DisabledBadge = () => <Badge variant="destructive">Disabled</Badge>;

const DisabledDescription = () => (
  <p className="text-muted-foreground">
    When you enable two-factor authentication, you will be prompted for a secure
    pin during login. This pin can be retrieved from a TOTP-supported
    application on your phone.
  </p>
);

const SetupAction = ({
  hasSetupData,
  openSetupModal,
}: Pick<TwoFactorContentProps, "hasSetupData" | "openSetupModal">) =>
  hasSetupData ? (
    <ContinueSetupButton onClick={openSetupModal} />
  ) : (
    <EnableForm onSuccess={openSetupModal} />
  );

const ContinueSetupButton = ({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick}>
    <ContinueSetupButtonContent />
  </Button>
);

const ContinueSetupButtonContent = () => (
  <span className="inline-flex items-center gap-2">
    <Icon iconNode={Shield01Icon} />
    <span>Continue Setup</span>
  </span>
);

const EnableForm = ({ onSuccess }: { onSuccess: () => void }) => (
  <Form {...enable.form()} onSuccess={onSuccess}>
    {({ processing }) => <EnableButton processing={processing} />}
  </Form>
);

const EnableButton = ({ processing }: { processing: boolean }) => (
  <Button type="submit" disabled={processing}>
    <EnableButtonContent />
  </Button>
);

const EnableButtonContent = () => (
  <span className="inline-flex items-center gap-2">
    <Icon iconNode={Shield01Icon} />
    <span>Enable 2FA</span>
  </span>
);
