import { Outlet, Scripts, ScrollRestoration, Meta, Links } from "@remix-run/react";
import { redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie") || "";
  
  // Check if the user has the "is_allowed" cookie
  const isLogged = cookieHeader.includes("is_allowed=true");

  // Don't redirect if they are already on the login page
  if (url.pathname === "/login") return null;

  // If they aren't logged in, send them to the login page
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
