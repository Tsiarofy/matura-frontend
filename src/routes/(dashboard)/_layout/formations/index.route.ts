import { createFileRoute } from "@tanstack/react-router";
import FormationsPage from "./index.page";
import { filtresSchema } from "@matura/shared";

// Cette déclaration contient la validation `validateSearch`.
export const Route = createFileRoute("/(dashboard)/_layout/formations/")({
  validateSearch: filtresSchema,
  component: FormationsPage,
});

export default Route;
