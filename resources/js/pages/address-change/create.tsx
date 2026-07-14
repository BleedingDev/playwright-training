import { Head, Link, useForm } from "@inertiajs/react";
import { useCallback, useEffect, useRef, useState } from "react";

import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";

interface Address {
  id: string;
  label: string;
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
}

interface Company {
  name: string;
  address: Address;
}

type SearchState =
  | "idle"
  | "loading"
  | "results"
  | "empty"
  | "error"
  | "timeout";

const AddressChange = ({ company }: { company: Company }) => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Address[]>([]);
  const [state, setState] = useState<SearchState>("idle");
  const [attempt, setAttempt] = useState(0);
  const abortController = useRef<AbortController | null>(null);
  const form = useForm<{ address: Address | null }>({ address: null });

  const search = useCallback(async (searchQuery: string) => {
    abortController.current?.abort();
    const controller = new AbortController();
    abortController.current = controller;
    let timedOut = false;
    setState("loading");
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 4000);

    try {
      const searchParams = new URLSearchParams({ query: searchQuery });
      const mockScenario = new URLSearchParams(window.location.search).get(
        "mock"
      );

      if (mockScenario) {
        searchParams.set("mock", mockScenario);
      }

      const response = await fetch(`/api/addresses?${searchParams}`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Address search failed");
      }

      const data = (await response.json()) as { items: Address[] };
      setItems(data.items);
      setState(data.items.length > 0 ? "results" : "empty");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        if (timedOut) {
          setState("timeout");
        }
      } else {
        setState("error");
      }
    } finally {
      window.clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    if (query.trim().length < 3) {
      abortController.current?.abort();
      setItems([]);
      setState("idle");
      return;
    }

    const timer = window.setTimeout(() => {
      search(query);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [attempt, query, search]);

  const selectAddress = (address: Address) => {
    form.setData("address", address);
    setQuery(address.label);
    setState("idle");
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.post("/address-change");
  };

  return (
    <AppLayout
      breadcrumbs={[
        { href: "/dashboard", title: "Prehľad" },
        { href: "/address-change", title: "Zmena sídla" },
      ]}
    >
      <Head title="Zmena sídla" />
      <main className="mx-auto w-full max-w-3xl p-4 md:p-8">
        <div className="mb-6">
          <p className="text-sm font-medium text-primary">{company.name}</p>
          <h1 className="text-3xl font-semibold tracking-tight">Zmena sídla</h1>
          <p className="mt-2 text-muted-foreground">
            Vyhľadajte novú registračnú adresu v registri RÚIAN.
          </p>
        </div>

        <form className="grid gap-6" onSubmit={submit}>
          <Card>
            <CardHeader>
              <CardTitle>Nová adresa</CardTitle>
              <CardDescription>
                Aktuálne sídlo: {company.address.label}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Label htmlFor="address-search">Adresa sídla</Label>
              <Input
                aria-autocomplete="list"
                aria-controls="address-results"
                aria-expanded={state === "results"}
                autoComplete="off"
                id="address-search"
                onChange={(event) => {
                  setQuery(event.target.value);
                  form.setData("address", null);
                }}
                placeholder="Začnite písať ulicu alebo mesto"
                role="combobox"
                value={query}
              />

              {query.trim().length < 3 ? (
                <p className="text-sm text-muted-foreground">
                  Zadajte aspoň tri znaky.
                </p>
              ) : null}

              {state === "loading" ? (
                <p className="text-sm text-muted-foreground" role="status">
                  Vyhľadávam adresy…
                </p>
              ) : null}

              {state === "results" ? (
                <ul
                  aria-label="Návrhy adries"
                  className="overflow-hidden rounded-lg border bg-background"
                  id="address-results"
                  role="listbox"
                >
                  {items.map((address) => (
                    <li key={address.id} role="presentation">
                      <button
                        aria-selected={form.data.address?.id === address.id}
                        className="w-full border-b px-4 py-3 text-left last:border-0 hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                        onClick={() => selectAddress(address)}
                        role="option"
                        type="button"
                      >
                        {address.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              {state === "empty" ? (
                <p className="rounded-lg border p-4" role="status">
                  Pre zadaný výraz sme nenašli žiadnu adresu.
                </p>
              ) : null}

              {state === "error" || state === "timeout" ? (
                <div
                  className="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4"
                  role="alert"
                >
                  <p>
                    {state === "timeout"
                      ? "Vyhľadávanie trvá príliš dlho. Skúste to znova."
                      : "Vyhľadávanie adries je dočasne nedostupné. Skúste to znova."}
                  </p>
                  <Button
                    onClick={() => setAttempt((current) => current + 1)}
                    type="button"
                    variant="outline"
                  >
                    Skúsiť znova
                  </Button>
                </div>
              ) : null}
              <InputError message={form.errors.address} />
            </CardContent>
          </Card>

          {form.data.address ? (
            <Card aria-labelledby="address-summary-title">
              <CardHeader>
                <CardTitle id="address-summary-title">Rekapitulácia</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-1">
                <p className="font-medium">{form.data.address.label}</p>
                <p className="text-sm text-muted-foreground">
                  Po odoslaní bude požiadavka čakať na schválenie operátorom.
                </p>
              </CardContent>
            </Card>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button
              disabled={!form.data.address || form.processing}
              type="submit"
            >
              Odoslať požiadavku
            </Button>
            <Button render={<Link href="/dashboard" />} variant="outline">
              Zrušiť
            </Button>
          </div>
        </form>
      </main>
    </AppLayout>
  );
};

export default AddressChange;
