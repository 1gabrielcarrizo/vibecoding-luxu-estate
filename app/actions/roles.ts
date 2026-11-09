"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { UserRole, UserRoleRow } from "@/types/database.types";
import { revalidatePath } from "next/cache";
import { connection } from "next/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Validates if the currently signed-in user is an administrator.
 */
export async function verifyIsAdmin(): Promise<{
  isAdmin: boolean;
  userId: string | null;
  userEmail: string | null;
}> {
  try {
    await connection();
  } catch {
    // Graceful fallback if connection() is called outside request scope
  }
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { isAdmin: false, userId: null, userEmail: null };
  }

  const userEmail = (user.email || "").toLowerCase();

  // Check env-configured fallback admin
  if (ADMIN_EMAILS.length > 0 && ADMIN_EMAILS.includes(userEmail)) {
    return { isAdmin: true, userId: user.id, userEmail };
  }

  // Check secure app_metadata (never trust client-writable user_metadata for authorization)
  if (user.app_metadata?.role === "admin") {
    return { isAdmin: true, userId: user.id, userEmail };
  }

  // Check user_roles database table
  try {
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (roleRow && roleRow.role === "admin") {
      return { isAdmin: true, userId: user.id, userEmail };
    }
  } catch (err) {
    console.error("Error verifying admin role:", err);
  }

  return { isAdmin: false, userId: user.id, userEmail };
}

/**
 * Retrieves all users from the user_roles table.
 * Restricted to administrators.
 */
export async function getAdminUsersAction(): Promise<{
  success: boolean;
  users: UserRoleRow[];
  error?: string;
}> {
  try {
    const { isAdmin } = await verifyIsAdmin();
    if (!isAdmin) {
      return { success: false, users: [], error: "No autorizado." };
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error querying user_roles table:", error.message);
      return { success: false, users: [], error: error.message };
    }

    return { success: true, users: (data as UserRoleRow[]) || [] };
  } catch (err: any) {
    console.error("Unexpected error fetching user roles:", err);
    return {
      success: false,
      users: [],
      error: err?.message || "Failed to fetch users",
    };
  }
}

/**
 * Updates a user's role in the database.
 */
export async function updateUserRoleAction(
  targetUserId: string,
  newRole: UserRole
): Promise<{ success: boolean; error?: string }> {
  try {
    const { isAdmin, userId } = await verifyIsAdmin();

    // Prevent changing role if not admin
    if (!isAdmin) {
      return {
        success: false,
        error: "Permiso denegado: debes ser administrador para cambiar roles.",
      };
    }

    const supabase = await createServerSupabaseClient();

    // If changing own role away from admin, check if other admins exist
    if (userId === targetUserId && newRole !== "admin") {
      const { data: otherAdmins } = await supabase
        .from("user_roles")
        .select("id")
        .eq("role", "admin")
        .neq("id", targetUserId);

      if (!otherAdmins || otherAdmins.length === 0) {
        return {
          success: false,
          error:
            "No puedes remover tu propio rol de administrador porque eres el único administrador en el sistema.",
        };
      }
    }

    const { error } = await supabase
      .from("user_roles")
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetUserId);

    if (error) {
      console.error("Error updating user role:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Unexpected error in updateUserRoleAction:", err);
    return {
      success: false,
      error: err?.message || "Error al actualizar el rol",
    };
  }
}

/**
 * Assigns or pre-creates a user role for a given email
 */
export async function assignRoleByEmailAction(
  email: string,
  role: UserRole
): Promise<{ success: boolean; error?: string }> {
  try {
    const { isAdmin } = await verifyIsAdmin();
    if (!isAdmin) {
      return { success: false, error: "Permiso denegado." };
    }

    const supabase = await createServerSupabaseClient();
    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists in user_roles
    const { data: existing } = await supabase
      .from("user_roles")
      .select("id")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existing) {
      return await updateUserRoleAction(existing.id, role);
    }

    return {
      success: false,
      error:
        "No se encontró un usuario registrado con ese correo. El usuario debe iniciar sesión al menos una vez en la aplicación.",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Error al asignar el rol.",
    };
  }
}

