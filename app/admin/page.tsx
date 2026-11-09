import { redirect } from "next/navigation";
import { connection } from "next/server";

export default async function AdminRootPage() {
  await connection();
  redirect("/admin/properties");
}
