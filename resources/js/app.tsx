import "../css/app.css";
import { createInertiaApp, type ResolvedComponent } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

import { initializeTheme } from "./hooks/use-appearance";

const appName = import.meta.env.VITE_APP_NAME || "SídloFlow";

const enableDevelopmentMocking = async () => {
  const params = new URLSearchParams(window.location.search);
  const mswEnabled =
    import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW === "true";

  if (!mswEnabled || params.get("msw") !== "1") {
    return;
  }

  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
};

enableDevelopmentMocking().then(() =>
  createInertiaApp({
    progress: {
      color: "#4B5563",
    },
    resolve: async (name) => {
      const page = await resolvePageComponent<{ default: ResolvedComponent }>(
        `./pages/${name}.tsx`,
        import.meta.glob<{ default: ResolvedComponent }>("./pages/**/*.tsx")
      );

      return page.default;
    },
    setup({ el, App, props }) {
      const root = createRoot(el);

      root.render(<App {...props} />);
    },
    title: (title) => (title ? `${title} - ${appName}` : appName),
  })
);

// This will set light / dark mode on load...
initializeTheme();
