import { Head } from "@inertiajs/react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "customer" | "operator" | "admin";
}

interface AdminRequest {
  id: number;
  status: string;
  company: { name: string };
  requested_address: { label: string };
}

const AdminOverview = ({
  users,
  requests,
}: {
  users: AdminUser[];
  requests: AdminRequest[];
}) => (
  <AppLayout breadcrumbs={[{ href: "/admin", title: "Administrácia" }]}>
    <Head title="Administrácia" />
    <main className="mx-auto grid w-full max-w-5xl gap-6 p-4 md:p-8">
      <div>
        <p className="text-sm font-medium text-primary">Admin zóna</p>
        <h1 className="text-3xl font-semibold tracking-tight">Administrácia</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Používatelia a roly</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {users.map((user) => (
              <li
                className="flex flex-wrap items-center justify-between gap-3 py-3"
                key={user.id}
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Badge variant="outline">{user.role}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Všetky požiadavky ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-muted-foreground">Žiadne požiadavky.</p>
          ) : (
            <ul className="divide-y">
              {requests.map((request) => (
                <li className="py-3" key={request.id}>
                  <p className="font-medium">{request.company.name}</p>
                  <p className="text-sm">{request.requested_address.label}</p>
                  <Badge className="mt-2" variant="outline">
                    {request.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  </AppLayout>
);

export default AdminOverview;
