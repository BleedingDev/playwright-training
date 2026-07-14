import { Transition } from "@headlessui/react";
import { Form, Head, Link, usePage } from "@inertiajs/react";

import UserProfileController from "@/actions/App/Http/Controllers/UserProfileController";
import DeleteUser from "@/components/delete-user";
import HeadingSmall from "@/components/heading-small";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/settings/layout";
import userProfile from "@/routes/user-profile";
import { send } from "@/routes/verification";
import type { BreadcrumbItem, SharedData } from "@/types";

interface EditProps {
  status?: string;
}

interface ProfileSettingsProps {
  auth: SharedData["auth"];
  status?: string;
}

interface ProfileFormRenderProps {
  errors: Record<string, string | undefined>;
  processing: boolean;
  recentlySuccessful: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    href: userProfile.edit().url,
    title: "Profile settings",
  },
];

const Edit = ({ status }: EditProps) => {
  const { auth } = usePage<SharedData>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile settings" />
      <ProfileSettings auth={auth} status={status} />
    </AppLayout>
  );
};
export default Edit;

const ProfileSettings = ({ auth, status }: ProfileSettingsProps) => (
  <SettingsLayout>
    <ProfileDetails auth={auth} status={status} />
    <DeleteUser />
  </SettingsLayout>
);

const ProfileDetails = ({ auth, status }: ProfileSettingsProps) => (
  <div className="space-y-6">
    <HeadingSmall
      title="Profile information"
      description="Update your name and email address"
    />
    <ProfileForm auth={auth} status={status} />
  </div>
);

const ProfileForm = ({ auth, status }: ProfileSettingsProps) => (
  <Form
    {...UserProfileController.update.form()}
    options={{
      preserveScroll: true,
    }}
    className="space-y-6"
  >
    {({ processing, recentlySuccessful, errors }) => (
      <ProfileFormFields
        auth={auth}
        status={status}
        errors={errors}
        processing={processing}
        recentlySuccessful={recentlySuccessful}
      />
    )}
  </Form>
);

const ProfileFormFields = ({
  auth,
  status,
  errors,
  processing,
  recentlySuccessful,
}: ProfileSettingsProps & ProfileFormRenderProps) => (
  <>
    <NameField name={auth.user.name} error={errors.name} />
    <EmailField email={auth.user.email} error={errors.email} />
    <VerificationNotice
      status={status}
      isVerified={auth.user.email_verified_at !== null}
    />
    <FormActions
      processing={processing}
      recentlySuccessful={recentlySuccessful}
    />
  </>
);

const NameField = ({ name, error }: { name: string; error?: string }) => (
  <div className="grid gap-2">
    <Label htmlFor="name">Name</Label>
    <Input
      id="name"
      className="mt-1 block w-full"
      defaultValue={name}
      name="name"
      required
      autoComplete="name"
      placeholder="Full name"
    />
    <InputError className="mt-2" message={error} />
  </div>
);

const EmailField = ({ email, error }: { email: string; error?: string }) => (
  <div className="grid gap-2">
    <Label htmlFor="email">Email address</Label>
    <Input
      id="email"
      type="email"
      className="mt-1 block w-full"
      defaultValue={email}
      name="email"
      required
      autoComplete="username"
      placeholder="Email address"
    />
    <InputError className="mt-2" message={error} />
  </div>
);

const VerificationNotice = ({
  status,
  isVerified,
}: {
  status?: string;
  isVerified: boolean;
}) =>
  isVerified ? null : (
    <div>
      <VerificationPrompt />
      <VerificationStatus status={status} />
    </div>
  );

const VerificationPrompt = () => (
  <p className="-mt-4 text-sm text-muted-foreground">
    Your email address is unverified.{" "}
    <Link
      href={send()}
      as="button"
      className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
    >
      Click here to resend the verification email.
    </Link>
  </p>
);

const VerificationStatus = ({ status }: { status?: string }) =>
  status === "verification-link-sent" ? (
    <div className="mt-2 text-sm font-medium text-green-600">
      A new verification link has been sent to your email address.
    </div>
  ) : null;

const FormActions = ({
  processing,
  recentlySuccessful,
}: {
  processing: boolean;
  recentlySuccessful: boolean;
}) => (
  <div className="flex items-center gap-4">
    <SaveButton processing={processing} />
    <SaveTransition recentlySuccessful={recentlySuccessful} />
  </div>
);

const SaveButton = ({ processing }: { processing: boolean }) => (
  <Button disabled={processing} data-test="update-profile-button">
    Save
  </Button>
);

const SaveTransition = ({
  recentlySuccessful,
}: {
  recentlySuccessful: boolean;
}) => (
  <Transition
    show={recentlySuccessful}
    enter="transition ease-in-out"
    enterFrom="opacity-0"
    leave="transition ease-in-out"
    leaveTo="opacity-0"
  >
    <SaveConfirmation />
  </Transition>
);

const SaveConfirmation = () => (
  <p className="text-sm text-neutral-600">Saved</p>
);
