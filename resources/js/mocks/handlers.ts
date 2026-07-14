import { delay, http, HttpResponse } from "msw";

const addresses = [
  {
    city: "Praha 1",
    houseNumber: "837/11",
    id: "msw-217310",
    label: "Václavské náměstí 837/11, 110 00 Praha 1",
    postalCode: "110 00",
    street: "Václavské náměstí",
  },
];

export const handlers = [
  http.get("*/api/addresses", async ({ request }) => {
    const scenario = new URL(request.url).searchParams.get("mock") ?? "success";

    if (scenario === "error") {
      return HttpResponse.json(
        { message: "RÚIAN provider is unavailable." },
        { status: 500 }
      );
    }

    if (scenario === "empty") {
      return HttpResponse.json({ items: [] });
    }

    if (scenario === "delayed") {
      await delay(900);
    }

    if (scenario === "timeout") {
      await delay("infinite");
    }

    return HttpResponse.json({ items: addresses });
  }),
];
