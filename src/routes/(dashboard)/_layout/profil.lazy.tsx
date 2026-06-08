import { createLazyFileRoute } from "@tanstack/react-router";
import ProfilePage from "./profil.page";

export const Route = createLazyFileRoute("/(dashboard)/_layout/profil")({
  component: ProfilePage,
});
