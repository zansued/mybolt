import { useLoaderData, Outlet, Scripts, ScrollRestoration, Meta, Links } from "@remix-run/react";
import { redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie") || "";
  const isLogged = cookieHeader.includes("is_allowed=true");

  // Allow access to login page
  if (url.pathname === "/login") return null;

  // If not logged in, go to login page
  if (!isLogged) {
    return redirect("/login");
  }

  return null;
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
