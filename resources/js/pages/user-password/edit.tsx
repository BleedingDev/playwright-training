import { Transition } from "@headlessui/react";
import { Form, Head } from "@inertiajs/react";
import { useRef, type RefObject } from "react";

import UserPasswordController from "@/actions/App/Http/Controllers/UserPasswordController";
import HeadingSmall from "@/components/heading-small";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/settings/layout";
import { edit } from "@/routes/password";
import type { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
  {
    href: edit().url,
    title: "Password settings",
  },
];

interface PasswordFieldProps {
  autoComplete: string;
  error?: string;
  id: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  label: string;
  name: string;
  placeholder: string;
}

const PasswordField = ({
  autoComplete,
  error,
  id,
  inputRef,
  label,
  name,
  placeholder,
}: PasswordFieldProps) => (
  <div className="grid gap-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      ref={inputRef}
      name={name}
      type="password"
      className="mt-1 block w-full"
      autoComplete={autoComplete}
      placeholder={placeholder}
    />
    <InputError message={error} />
  </div>
);

interface PasswordActionsProps {
  processing: boolean;
  recentlySuccessful: boolean;
}

const PasswordActions = ({
  processing,
  recentlySuccessful,
}: PasswordActionsProps) => (
  <div className="flex items-center gap-4">
    <Button
      type="submit"
      disabled={processing}
      data-test="update-password-button"
    >
      Save password
    </Button>

    <Transition
      show={recentlySuccessful}
      enter="transition ease-in-out"
      enterFrom="opacity-0"
      leave="transition ease-in-out"
      leaveTo="opacity-0"
    >
      <p className="text-sm text-neutral-600">Saved</p>
    </Transition>
  </div>
);

interface PasswordErrors {
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

interface PasswordFormFieldsProps {
  currentPasswordInput: RefObject<HTMLInputElement | null>;
  errors: PasswordErrors;
  passwordInput: RefObject<HTMLInputElement | null>;
  processing: boolean;
  recentlySuccessful: boolean;
}

const PasswordFormFields = ({
  currentPasswordInput,
  errors,
  passwordInput,
  processing,
  recentlySuccessful,
}: PasswordFormFieldsProps) => (
  <>
    <PasswordField
      id="current_password"
      inputRef={currentPasswordInput}
      name="current_password"
      label="Current password"
      autoComplete="current-password"
      placeholder="Current password"
      error={errors.current_password}
    />
    <PasswordField
      id="password"
      inputRef={passwordInput}
      name="password"
      label="New password"
      autoComplete="new-password"
      placeholder="New password"
      error={errors.password}
    />
    <PasswordField
      id="password_confirmation"
      name="password_confirmation"
      label="Confirm password"
      autoComplete="new-password"
      placeholder="Confirm password"
      error={errors.password_confirmation}
    />
    <PasswordActions
      processing={processing}
      recentlySuccessful={recentlySuccessful}
    />
  </>
);

const Password = () => {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Password settings" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Update password"
            description="Ensure your account is using a long, random password to stay secure"
          />

          <Form
            {...UserPasswordController.update.form()}
            options={{
              preserveScroll: true,
            }}
            resetOnError={[
              "password",
              "password_confirmation",
              "current_password",
            ]}
            resetOnSuccess
            onError={(errors) => {
              if (errors.password) {
                passwordInput.current?.focus();
              }

              if (errors.current_password) {
                currentPasswordInput.current?.focus();
              }
            }}
            className="space-y-6"
          >
            {({ errors, processing, recentlySuccessful }) => (
              <PasswordFormFields
                currentPasswordInput={currentPasswordInput}
                errors={errors}
                passwordInput={passwordInput}
                processing={processing}
                recentlySuccessful={recentlySuccessful}
              />
            )}
          </Form>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
};
export default Password;
