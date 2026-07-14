import { Head, Link, useForm } from "@inertiajs/react";

import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";

interface RequestDetail {
  id: number;
  original_address: { label: string };
  requested_address: { label: string };
  company: { name: string; customer: { name: string } };
}

const OperatorRequestDetail = ({ request }: { request: RequestDetail }) => {
  const form = useForm({ decision: "", rejection_note: "" });

  const decide = (decision: "approved" | "rejected") => {
    form.transform((data) => ({ ...data, decision }));
    form.patch(`/operator/requests/${request.id}`);
  };

  return (
    <AppLayout
      breadcrumbs={[
        { href: "/operator/requests", title: "Fronta" },
        { href: `/operator/requests/${request.id}`, title: "Detail" },
      ]}
    >
      <Head title={`Požiadavka #${request.id}`} />
      <main className="mx-auto grid w-full max-w-4xl gap-6 p-4 md:p-8">
        <div>
          <p className="text-sm font-medium text-primary">
            {request.company.name}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Požiadavka #{request.id}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Zákazník: {request.company.customer.name}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pôvodná adresa</CardTitle>
            </CardHeader>
            <CardContent>{request.original_address.label}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Požadovaná adresa</CardTitle>
            </CardHeader>
            <CardContent>{request.requested_address.label}</CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rozhodnutie</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rejection-note">Dôvod zamietnutia</Label>
              <Textarea
                id="rejection-note"
                onChange={(event) =>
                  form.setData("rejection_note", event.target.value)
                }
                placeholder="Povinné iba pri zamietnutí"
                value={form.data.rejection_note}
              />
              <InputError message={form.errors.rejection_note} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                disabled={form.processing}
                onClick={() => decide("approved")}
                type="button"
              >
                Schváliť požiadavku
              </Button>
              <Button
                disabled={form.processing}
                onClick={() => decide("rejected")}
                type="button"
                variant="destructive"
              >
                Zamietnuť požiadavku
              </Button>
              <Button
                render={<Link href="/operator/requests" />}
                variant="outline"
              >
                Späť na frontu
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
};

export default OperatorRequestDetail;
