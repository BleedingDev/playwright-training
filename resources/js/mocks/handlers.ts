import { http, HttpResponse } from "msw";

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
  http.get("*/api/addresses", () => HttpResponse.json({ items: addresses })),
];
