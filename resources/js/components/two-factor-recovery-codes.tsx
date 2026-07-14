import {
  LockKeyIcon,
  RefreshIcon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Form } from "@inertiajs/react";
import { useEffect, useRef, useState, type RefObject } from "react";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { regenerateRecoveryCodes } from "@/routes/two-factor";

import AlertError from "./alert-error";

interface TwoFactorRecoveryCodesProps {
  recoveryCodesList: string[];
  fetchRecoveryCodes: () => Promise<void>;
  errors: string[];
}

const loadingSkeletonKeys = Array.from(
  { length: 8 },
  (_, index) => `recovery-skeleton-${index + 1}`
);

const TwoFactorRecoveryCodes = ({
  recoveryCodesList,
  fetchRecoveryCodes,
  errors,
}: TwoFactorRecoveryCodesProps) => {
  const [codesAreVisible, setCodesAreVisible] = useState<boolean>(false);
  const codesSectionRef = useRef<HTMLDivElement | null>(null);
  const canRegenerateCodes = recoveryCodesList.length > 0 && codesAreVisible;

  const toggleCodesVisibility = async () => {
    if (!codesAreVisible && !recoveryCodesList.length) {
      await fetchRecoveryCodes();
    }

    setCodesAreVisible(!codesAreVisible);

    if (!codesAreVisible) {
      setTimeout(() => {
        codesSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 0);
    }
  };

  useEffect(() => {
    if (!recoveryCodesList.length) {
      fetchRecoveryCodes();
    }
  }, [recoveryCodesList.length, fetchRecoveryCodes]);

  const RecoveryCodeIconComponent = codesAreVisible ? ViewOffIcon : ViewIcon;

  return (
    <Card>
      <RecoveryCodesHeader />
      <CardContent>
        <RecoveryCodesActions
          codesAreVisible={codesAreVisible}
          canRegenerateCodes={canRegenerateCodes}
          fetchRecoveryCodes={fetchRecoveryCodes}
          onToggleVisibility={toggleCodesVisibility}
          IconComponent={RecoveryCodeIconComponent}
        />
        <RecoveryCodesPanel
          codesAreVisible={codesAreVisible}
          errors={errors}
          recoveryCodesList={recoveryCodesList}
          codesSectionRef={codesSectionRef}
        />
      </CardContent>
    </Card>
  );
};
export default TwoFactorRecoveryCodes;

const RecoveryCodesHeader = () => (
  <CardHeader>
    <CardTitle className="flex gap-3">
      <Icon iconNode={LockKeyIcon} className="size-4" aria-hidden="true" />
      2FA Recovery Codes
    </CardTitle>
    <CardDescription>
      Recovery codes let you regain access if you lose your 2FA device. Store
      them in a secure password manager.
    </CardDescription>
  </CardHeader>
);

const RecoveryCodesActions = ({
  codesAreVisible,
  canRegenerateCodes,
  fetchRecoveryCodes,
  onToggleVisibility,
  IconComponent,
}: {
  codesAreVisible: boolean;
  canRegenerateCodes: boolean;
  fetchRecoveryCodes: () => Promise<void>;
  onToggleVisibility: () => Promise<void>;
  IconComponent: IconSvgElement;
}) => (
  <div className="flex flex-col gap-3 select-none sm:flex-row sm:items-center sm:justify-between">
    <Button
      type="button"
      onClick={onToggleVisibility}
      className="w-fit"
      aria-expanded={codesAreVisible}
      aria-controls="recovery-codes-section"
    >
      <Icon iconNode={IconComponent} className="size-4" aria-hidden="true" />
      {codesAreVisible ? "Hide" : "View"} Recovery Codes
    </Button>
    {canRegenerateCodes ? (
      <RecoveryCodesRegenerate onSuccess={fetchRecoveryCodes} />
    ) : null}
  </div>
);

const RecoveryCodesRegenerate = ({
  onSuccess,
}: {
  onSuccess: () => Promise<void>;
}) => (
  <Form
    {...regenerateRecoveryCodes.form()}
    options={{ preserveScroll: true }}
    onSuccess={onSuccess}
  >
    {({ processing }) => (
      <Button
        variant="secondary"
        type="submit"
        disabled={processing}
        aria-describedby="regenerate-warning"
      >
        <Icon iconNode={RefreshIcon} className="mr-2" /> Regenerate Codes
      </Button>
    )}
  </Form>
);

const RecoveryCodesPanel = ({
  codesAreVisible,
  errors,
  recoveryCodesList,
  codesSectionRef,
}: {
  codesAreVisible: boolean;
  errors: string[];
  recoveryCodesList: string[];
  codesSectionRef: RefObject<HTMLDivElement | null>;
}) => (
  <div
    id="recovery-codes-section"
    className={`relative overflow-hidden transition-all duration-300 ${codesAreVisible ? "h-auto opacity-100" : "h-0 opacity-0"}`}
    aria-hidden={!codesAreVisible}
  >
    <div className="mt-3 space-y-3">
      {errors.length ? (
        <AlertError errors={errors} />
      ) : (
        <RecoveryCodesList
          codesSectionRef={codesSectionRef}
          recoveryCodesList={recoveryCodesList}
        />
      )}
    </div>
  </div>
);

const RecoveryCodesList = ({
  recoveryCodesList,
  codesSectionRef,
}: {
  recoveryCodesList: string[];
  codesSectionRef: RefObject<HTMLDivElement | null>;
}) => (
  <>
    <div
      ref={codesSectionRef}
      className="grid gap-1 rounded-lg bg-muted p-4 font-mono text-sm"
      role="list"
      aria-label="Recovery codes"
    >
      {recoveryCodesList.length ? (
        <RecoveryCodesItems recoveryCodesList={recoveryCodesList} />
      ) : (
        <RecoveryCodesLoading />
      )}
    </div>
    <RecoveryCodesNotice />
  </>
);

const RecoveryCodesItems = ({
  recoveryCodesList,
}: {
  recoveryCodesList: string[];
}) => (
  <>
    {recoveryCodesList.map((code) => (
      <div key={code} role="listitem" className="select-text">
        {code}
      </div>
    ))}
  </>
);

const RecoveryCodesLoading = () => (
  <div className="space-y-2" aria-label="Loading recovery codes">
    {loadingSkeletonKeys.map((key) => (
      <div
        key={key}
        className="h-4 animate-pulse rounded bg-muted-foreground/20"
        aria-hidden="true"
      />
    ))}
  </div>
);

const RecoveryCodesNotice = () => (
  <div className="text-xs text-muted-foreground select-none">
    <p id="regenerate-warning">
      Each recovery code can be used once to access your account and will be
      removed after use. If you need more, click{" "}
      <span className="font-bold">Regenerate Codes</span> above.
    </p>
  </div>
);
