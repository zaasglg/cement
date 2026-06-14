import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/procurements")({
  component: () => <Outlet />,
});
