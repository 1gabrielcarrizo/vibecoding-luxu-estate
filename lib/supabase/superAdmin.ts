export const SUPER_ADMIN_EMAIL = (
  process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || "gabriel_glee_97@hotmail.com"
)
  .trim()
  .toLowerCase();

/**
 * Checks whether the given email belongs to the protected Super Admin account.
 */
export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL;
}
