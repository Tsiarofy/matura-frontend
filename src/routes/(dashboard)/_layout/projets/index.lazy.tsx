import { createLazyFileRoute } from "@tanstack/react-router";
import ProjetsIndexPage from "./index.page";

export const Route = createLazyFileRoute("/(dashboard)/_layout/projets/")({
  component: ProjetsIndexPage,
});
