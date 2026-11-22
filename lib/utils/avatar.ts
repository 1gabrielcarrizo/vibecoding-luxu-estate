/**
 * Upgrades OAuth provider profile avatar URLs to a higher resolution so they
 * look sharp on Retina/HiDPI displays and when viewed enlarged in a lightbox.
 *
 * - Google (`lh3.googleusercontent.com/a/...=s96-c`): replaces size suffix with `=s{size}-c`
 * - GitHub (`avatars.githubusercontent.com/u/...`): sets `?s={size}`
 */
export function getHighResAvatarUrl(
  url: string | null | undefined,
  size: number = 400
): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);

    if (parsed.hostname.endsWith("googleusercontent.com")) {
      // Static template URLs under /aida-public/ do not use =sNN-c modifiers
      if (parsed.pathname.includes("/aida-public/")) {
        return trimmed;
      }

      if (/=s\d+(-c)?$/i.test(parsed.pathname)) {
        parsed.pathname = parsed.pathname.replace(
          /=s\d+(-c)?$/i,
          `=s${size}-c`
        );
        return parsed.toString();
      }

      if (parsed.pathname.startsWith("/a/")) {
        parsed.pathname = `${parsed.pathname}=s${size}-c`;
        return parsed.toString();
      }

      return trimmed;
    }

    if (parsed.hostname === "avatars.githubusercontent.com") {
      parsed.searchParams.set("s", String(size));
      return parsed.toString();
    }

    return trimmed;
  } catch {
    return trimmed;
  }
}
