import { Head, Link, usePage } from "@inertiajs/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";

interface QueueRequest {
  id: number;
  requested_address: { label: string };
  submitted_at: string;
  company: {
    name: string;
    customer: { name: string };
  };
}

const OperatorQueue = ({ requests }: { requests: QueueRequest[] }) => {
  const { flash } = usePage<{ flash?: { success?: string } }>().props;

  return (
    <AppLayout breadcrumbs={[{ href: "/operator/requests", title: "Fronta" }]}>
      <Head title="Požiadavky na schválenie" />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-8">
        <div>
          <p className="text-sm font-medium text-primary">Operátorská zóna</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Požiadavky na schválenie
          </h1>
        </div>

        {flash?.success ? (
          <p
            className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-emerald-900"
            role="status"
          >
            {flash.success}
          </p>
        ) : null}

        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Fronta je prázdna. Všetky požiadavky sú spracované.
            </CardContent>
          </Card>
        ) : (
          <ul className="grid gap-3">
            {requests.map((request) => (
              <li key={request.id}>
                <Card>
                  <CardContent className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{request.company.name}</p>
                        <Badge variant="outline">Čaká na schválenie</Badge>
                      </div>
                      <p>{request.requested_address.label}</p>
                      <p className="text-sm text-muted-foreground">
                        Zákazník: {request.company.customer.name} · 10. júna
                        2026
                      </p>
                    </div>
                    <Button
                      render={
                        <Link href={`/operator/requests/${request.id}`} />
                      }
                      variant="outline"
                    >
                      Otvoriť detail
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </main>
    </AppLayout>
  );
};

export default OperatorQueue;
