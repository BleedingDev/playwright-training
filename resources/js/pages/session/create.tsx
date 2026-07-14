import { Form, Head } from "@inertiajs/react";

import SessionController from "@/actions/App/Http/Controllers/SessionController";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import AuthLayout from "@/layouts/auth-layout";
import { request } from "@/routes/password";

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

const Login = ({ status, canResetPassword }: LoginProps) => (
  <AuthLayout
    title="Prihlásenie do SídloFlow"
    description="Zadajte demo účet a heslo"
  >
    <Head title="Prihlásenie" />

    <Form
      {...SessionController.store.form()}
      resetOnSuccess={["password"]}
      className="flex flex-col gap-6"
    >
      {({ processing, errors }) => (
        <LoginFormContent
          canResetPassword={canResetPassword}
          errors={errors}
          processing={processing}
        />
      )}
    </Form>

    {status && (
      <div className="mb-4 text-center text-sm font-medium text-green-600">
        {status}
      </div>
    )}
  </AuthLayout>
);
export default Login;

const LoginFormContent = ({
  canResetPassword,
  errors,
  processing,
}: {
  canResetPassword: boolean;
  errors: Record<string, string | undefined>;
  processing: boolean;
}) => (
  <>
    <LoginFields
      canResetPassword={canResetPassword}
      errors={errors}
      processing={processing}
    />
    <LoginFooter />
  </>
);

const LoginFields = ({
  canResetPassword,
  errors,
  processing,
}: {
  canResetPassword: boolean;
  errors: Record<string, string | undefined>;
  processing: boolean;
}) => (
  <div className="grid gap-6">
    <EmailField error={errors.email} />
    <PasswordField
      canResetPassword={canResetPassword}
      error={errors.password}
    />
    <RememberField />
    <SubmitButton processing={processing} />
  </div>
);

const EmailField = ({ error }: { error?: string }) => (
  <div className="grid gap-2">
    <Label htmlFor="email">E-mail</Label>
    <Input
      id="email"
      type="email"
      name="email"
      required
      autoFocus
      autoComplete="email"
      placeholder="customer@example.test"
    />
    <InputError message={error} />
  </div>
);

const PasswordField = ({
  canResetPassword,
  error,
}: {
  canResetPassword: boolean;
  error?: string;
}) => (
  <div className="grid gap-2">
    <PasswordLabelRow canResetPassword={canResetPassword} />
    <Input
      id="password"
      type="password"
      name="password"
      required
      autoComplete="current-password"
      placeholder="Heslo"
    />
    <InputError message={error} />
  </div>
);

const PasswordLabelRow = ({
  canResetPassword,
}: {
  canResetPassword: boolean;
}) => (
  <div className="flex items-center">
    <Label htmlFor="password">Heslo</Label>
    {canResetPassword ? (
      <TextLink href={request()} className="ml-auto text-sm">
        Zabudli ste heslo?
      </TextLink>
    ) : null}
  </div>
);

const RememberField = () => (
  <div className="flex items-center space-x-3">
    <Checkbox id="remember" name="remember" />
    <Label htmlFor="remember">Zapamätať prihlásenie</Label>
  </div>
);

const SubmitButton = ({ processing }: { processing: boolean }) => (
  <Button
    type="submit"
    className="mt-4 w-full"
    disabled={processing}
    data-test="login-button"
  >
    {processing ? <Spinner /> : null}
    Prihlásiť sa
  </Button>
);

const LoginFooter = () => (
  <div className="text-center text-sm text-muted-foreground">
    Workshop demo · heslo <strong>password</strong>
  </div>
);
