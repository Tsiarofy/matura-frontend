import { createLazyFileRoute } from "@tanstack/react-router";
import DashboardPage from "./dashboard.page";

export const Route = createLazyFileRoute("/(dashboard)/_layout/dashboard")({
  component: DashboardPage,
});
