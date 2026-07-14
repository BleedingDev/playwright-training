import { createInertiaApp, type ResolvedComponent } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import ReactDOMServer from "react-dom/server";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

const resolvePage = async (name: string) => {
  const page = await resolvePageComponent<{ default: ResolvedComponent }>(
    `./pages/${name}.tsx`,
    import.meta.glob<{ default: ResolvedComponent }>("./pages/**/*.tsx")
  );

  return page.default;
};

const server = createServer((page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: resolvePage,
    setup: ({ App, props }) => <App {...props} />,
    title: (title) => (title ? `${title} - ${appName}` : appName),
  })
);

export default server;
