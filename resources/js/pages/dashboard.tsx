import { Head, Link, usePage } from "@inertiajs/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";

interface Address {
  label: string;
}

interface Company {
  name: string;
  registration_number: string;
  address: Address;
}

interface AddressRequest {
  id: number;
  requested_address: Address;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  rejection_note: string | null;
}

const statusLabels = {
  approved: "Schválená",
  pending: "Čaká na schválenie",
  rejected: "Zamietnutá",
};

const Dashboard = ({
  company,
  requests,
}: {
  company: Company;
  requests: AddressRequest[];
}) => {
  const { flash } = usePage<{ flash?: { success?: string } }>().props;
  const visibleRequests = requests.filter(
    (request) => request.status !== "pending"
  );

  return (
    <AppLayout breadcrumbs={[{ href: "/dashboard", title: "Prehľad" }]}>
      <Head title="Prehľad firmy" />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary">SídloFlow</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Prehľad firmy
            </h1>
          </div>
          <Button render={<Link href="/address-change" />}>Zmena sídla</Button>
        </div>

        {flash?.success ? (
          <div
            className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-emerald-900"
            role="status"
          >
            {flash.success}
          </div>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>{company.name}</CardTitle>
            <CardDescription>IČO {company.registration_number}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Aktuálne sídlo</p>
            <p className="mt-1 text-lg font-medium">{company.address.label}</p>
          </CardContent>
        </Card>

        <section aria-labelledby="request-history">
          <h2 className="mb-3 text-xl font-semibold" id="request-history">
            Predchádzajúce požiadavky
          </h2>
          {visibleRequests.length === 0 ? (
            <p className="rounded-lg border p-6 text-muted-foreground">
              Zatiaľ ste neposlali žiadnu požiadavku.
            </p>
          ) : (
            <ul className="grid gap-3">
              {visibleRequests.map((request) => (
                <li key={request.id}>
                  <Card>
                    <CardContent className="flex flex-col justify-between gap-3 py-5 sm:flex-row sm:items-center">
                      <div>
                        <p className="font-medium">
                          {request.requested_address.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Odoslané 10. júna 2026
                        </p>
                        {request.rejection_note ? (
                          <p className="mt-2 text-sm">
                            Dôvod: {request.rejection_note}
                          </p>
                        ) : null}
                      </div>
                      <Badge variant="outline">
                        {statusLabels[request.status]}
                      </Badge>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </AppLayout>
  );
};

export default Dashboard;
