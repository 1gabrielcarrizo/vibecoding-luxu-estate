"use client";

import React, { useState, useTransition, useMemo, useEffect, useCallback } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { UserRole, UserRoleRow } from "@/types/database.types";
import {
  updateUserRoleAction,
  assignRoleByEmailAction,
} from "@/app/actions/roles";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useRealtimeTableSync } from "@/lib/supabase/useRealtimeSync";
import { isSuperAdminEmail } from "@/lib/supabase/superAdmin";
import { getHighResAvatarUrl } from "@/lib/utils/avatar";
import { AvatarLightboxModal } from "@/components/common/AvatarLightboxModal";

type FunctionalRole = "admin" | "user";

function normalizeFunctionalRole(role?: string | null): FunctionalRole {
  return role === "admin" ? "admin" : "user";
}

interface DirectoryUserItem {
  id: string;
  dbId?: string;
  name: string;
  email: string;
  avatar: string | null;
  role: FunctionalRole;
  status: "Active" | "Away" | "Inactive";
  statusDot?: "green" | "yellow";
  propertiesCount: string | number;
  secondaryStatKey: "salesYtd" | "accessLevel" | "lastLogin";
  secondaryStatValue: string;
  isHighlighted?: boolean;
  isGrayscale?: boolean;
}

function getUserInitials(name: string, email: string): string {
  const source = name.trim() || email.split("@")[0] || "U";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function formatFallbackName(email: string, shortId: string): string {
  const localPart = email.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  if (!localPart) return `User ${shortId}`;
  return localPart
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const TEMPLATE_USERS: DirectoryUserItem[] = [
  {
    id: "USR-2941",
    name: "Sarah Miller",
    email: "sarah.miller@luxuryestates.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC56qX3A4ZIRCJqxha17327kptmQpANrrIT6CLj09DTQ7ZLjB0fF9cMlC1MCJKAs3hr5oUDilNrCcdzUdLAZtwX25YQblIBzVpUSa4XfyFc_WJDGvW0T1svVr884aNmze31Cl_2UkKik03EROGXyke1i6PuTAZaAtf8yMN8xLPJIAdQ5Gc1m_SqkCpADlwXPZ8fL-BWzj4Ck3PpZ1GjAGsyq9Ul9L3SmH_UnJzI-NbipFCmtQI2JJiB0TiUhogRjIBNn8TCUkubVhs",
    role: "user",
    status: "Active",
    statusDot: "green",
    propertiesCount: "-",
    secondaryStatKey: "accessLevel",
    secondaryStatValue: "Standard",
    isHighlighted: true,
  },
  {
    id: "USR-8821",
    name: "Marcus Chen",
    email: "marcus.c@luxuryestates.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6y5hdg1R7gLFSihyqty_LGTd8uQTZHpyo_det0XoV6ak0U5H9xxuTlfFTXPP3vX9dhpeIETDGBcowSSiDyHVTXQm_0Xv8KXRj-n2PLGHHBlmSsYSxlZPErAGQSycUYUlDT1FNqac9hxwpfwQ3MjO4tdj7q9Pmb8WHgzBaOMain4vzaZbThFi3Hg9-qkhofOnAi7hJ1JD3EgK6Zu5iWLE8NDph0Uhd8iHYZHNUfUzBfJN1E6NRB2EKwbx7MmgWloP-YysiRt4IfrE",
    role: "user",
    status: "Away",
    propertiesCount: "-",
    secondaryStatKey: "accessLevel",
    secondaryStatValue: "Standard",
  },
  {
    id: "USR-1029",
    name: "Elias Thorne",
    email: "elias.thorne@luxuryestates.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBxUenMO4Re0naHHGO3GB46gBwyGMA7GYH5XNQVi86xJtOVYUNoL1nn8Q65pwWZkyLQdR_vB2N8mOuxFtLT6blCwOerfNuVqSeqTpdrustLAO7-HYwjC_83sTmfBsuSmMXUPTAZub0b8Tgo2uGzoPZ2i98s_taTX232u4UPVO3NybNwYhzYw8FhvhRPAFvcI-QWnVtQO820Eex8lc8BoMd_fWRl3S6oU4opRnz9HCQOB15l5se_ousKRtbZcFE1JqcjKn1T1PrbGOE",
    role: "admin",
    status: "Active",
    statusDot: "yellow",
    propertiesCount: "-",
    secondaryStatKey: "accessLevel",
    secondaryStatValue: "Level 5",
  },
  {
    id: "USR-3310",
    name: "Anna Koval",
    email: "anna.k@luxuryestates.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9R6zvnu8j58sG4eUwo-9f00NJRnaHJllOxtW7NfLtjJiAJS9xgpRhQlnDfEULT1ntyQ00kNW93vDfqmwYwX1RCQPYBbvhlrs2VOAtipQyTT3C6te7SH_slUUdDRloL7IVp9QUnB8Ivo76jM9GbGTSedRCNENz2EG_QljoMFfWvhKp0s43vQePPAzlx8RC8KtwYuwd8ToaZVZxa2XoxnstlCppJhDJRvw5Ou981GU62MElNMA1fzr6yjX_QN1QSgdX--GMTBTb22I",
    role: "user",
    status: "Inactive",
    isGrayscale: true,
    propertiesCount: "0",
    secondaryStatKey: "lastLogin",
    secondaryStatValue: "2mo",
  },
  {
    id: "USR-9942",
    name: "David O'Conner",
    email: "david.o@luxuryestates.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAg2jyeiLRo7sss3zX5bvvLWpJNUabZqBCz9HIWx2jcHtvG5KfoaquiQRmwZWTLpD4Rr3jS3iRzWjTa0VLibUkWK_MxV6fzcMISmS1SEsNldZilln2O3A6992ZnLgEiD8ASlQ1cFmc-XvY1X7sK_3pBGUWYHWWutX34hxrAZ-HsCMlmBgatcSpPiTXo4ICkrQ7uSf490A6Bxx60h1ac_QZQl46jo1CciIMS6fFu2O2ZozSmTaFlwiOWhN1vo5n4gXQ0gjh785OlBLQ",
    role: "user",
    status: "Active",
    propertiesCount: "-",
    secondaryStatKey: "accessLevel",
    secondaryStatValue: "Standard",
  },
];

interface AdminUsersViewProps {
  initialUsers?: UserRoleRow[];
  currentUserId?: string | null;
  currentUserEmail?: string | null;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({
  initialUsers = [],
  currentUserId = null,
  currentUserEmail = null,
}) => {
  const { t } = useTranslation();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All Users" | "Admins" | "Users">(
    "All Users"
  );
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewAvatar, setPreviewAvatar] = useState<{
    src: string;
    name: string;
    subtitle: string;
  } | null>(null);
  const pageSize = 5;

  // Add User modal state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<FunctionalRole>("user");
  const [isPendingAssign, startAssignTransition] = useTransition();

  // Notification Toast
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // Close role dropdown on outside click or Escape
  useEffect(() => {
    if (!openDropdownId) return;
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-role-dropdown]")) {
        setOpenDropdownId(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdownId(null);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openDropdownId]);

  // Close Add User modal on Escape
  useEffect(() => {
    if (!isAddUserModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsAddUserModalOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isAddUserModalOpen]);

  const [userOverrides, setUserOverrides] = useState<
    Record<string, Partial<DirectoryUserItem>>
  >({});
  const [addedUsers, setAddedUsers] = useState<DirectoryUserItem[]>([]);
  const [deletedUserIds, setDeletedUserIds] = useState<Set<string>>(
    () => new Set()
  );
  const [brokenAvatarIds, setBrokenAvatarIds] = useState<Set<string>>(
    () => new Set()
  );

  // In-place client-side Realtime sync across admin sessions (zero page reload)
  const handleRealtimeUserRolesChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
      if (payload.eventType === "DELETE") {
        const oldId = (payload.old as { id?: string } | undefined)?.id;
        if (oldId) {
          setDeletedUserIds((prev) => new Set(prev).add(oldId));
        }
        return;
      }

      const row = payload.new as Partial<UserRoleRow> | undefined;
      if (!row?.id) return;

      const roleVal = normalizeFunctionalRole(row.role);
      const cleanName = row.full_name?.trim() || undefined;
      const cleanAvatar = row.avatar_url?.trim() || null;
      const isSuper = isSuperAdminEmail(row.email);

      if (payload.eventType === "UPDATE") {
        setUserOverrides((prev) => ({
          ...prev,
          [row.id!]: {
            ...prev[row.id!],
            ...(cleanName ? { name: cleanName } : {}),
            ...(row.avatar_url !== undefined ? { avatar: cleanAvatar } : {}),
            ...(row.email ? { email: row.email } : {}),
            role: roleVal,
            statusDot: roleVal === "admin" ? "yellow" : "green",
            propertiesCount: "-",
            secondaryStatKey: "accessLevel",
            secondaryStatValue: isSuper
              ? "Super"
              : roleVal === "admin"
                ? "Level 5"
                : "Standard",
          },
        }));
      } else if (payload.eventType === "INSERT") {
        const email = row.email || "user@example.com";
        const shortId = row.id.slice(0, 4).toUpperCase();

        const newItem: DirectoryUserItem = {
          id: `USR-${shortId}`,
          dbId: row.id,
          name: cleanName || formatFallbackName(email, shortId),
          email,
          avatar: cleanAvatar,
          role: roleVal,
          status: "Active",
          statusDot: roleVal === "admin" ? "yellow" : "green",
          propertiesCount: "-",
          secondaryStatKey: "accessLevel",
          secondaryStatValue: isSuper
            ? "Super"
            : roleVal === "admin"
              ? "Level 5"
              : "Standard",
        };
        setAddedUsers((prev) => [
          newItem,
          ...prev.filter((u) => u.dbId !== row.id && u.email !== email),
        ]);
      }
    },
    []
  );

  useRealtimeTableSync({
    table: "user_roles",
    onEvent: handleRealtimeUserRolesChange,
  });

  // Merge database users with template users + optimistic local overrides
  const userList = useMemo<DirectoryUserItem[]>(() => {
    const mappedDbUsers: DirectoryUserItem[] = initialUsers.map((u, idx) => {
      const email = u.email || "user@example.com";
      const shortId = u.id.slice(0, 4).toUpperCase();
      const realFullName = u.full_name?.trim();
      const realAvatar = u.avatar_url?.trim() || null;
      const roleVal = normalizeFunctionalRole(u.role);
      const isSuper = isSuperAdminEmail(email);

      return {
        id: `USR-${shortId}`,
        dbId: u.id,
        name: realFullName || formatFallbackName(email, shortId),
        email,
        avatar: realAvatar,
        role: isSuper ? "admin" : roleVal,
        status: "Active",
        statusDot: roleVal === "admin" || isSuper ? "yellow" : "green",
        propertiesCount: "-",
        secondaryStatKey: "accessLevel",
        secondaryStatValue: isSuper
          ? "Super"
          : roleVal === "admin"
            ? "Level 5"
            : "Standard",
        isHighlighted: idx === 0,
      };
    });

    const baseList =
      mappedDbUsers.length > 0
        ? [
          ...mappedDbUsers,
          ...TEMPLATE_USERS.filter(
            (tmpl) =>
              !mappedDbUsers.some(
                (u) => u.email.toLowerCase() === tmpl.email.toLowerCase()
              )
          ),
        ]
        : TEMPLATE_USERS;

    const existingEmails = new Set(baseList.map((u) => u.email.toLowerCase()));
    const merged = [
      ...addedUsers.filter((u) => !existingEmails.has(u.email.toLowerCase())),
      ...baseList,
    ];

    return merged
      .filter((u) => !u.dbId || !deletedUserIds.has(u.dbId))
      .map((u) => {
        const key = u.dbId || u.id;
        return userOverrides[key] ? { ...u, ...userOverrides[key] } : u;
      });
  }, [initialUsers, addedUsers, userOverrides, deletedUserIds]);

  const getRoleDisplayLabel = (role: string): string => {
    if (role === "admin") return t("admin.users.roles.admin");
    return t("admin.users.roles.user");
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return userList.filter((user) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesTab = true;
      if (activeTab === "Admins") {
        matchesTab = user.role === "admin";
      } else if (activeTab === "Users") {
        matchesTab = user.role !== "admin";
      }

      return matchesSearch && matchesTab;
    });
  }, [userList, searchQuery, activeTab]);

  // Pagination calculation
  const totalUsers = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  // Role change handler with Super Admin + self-change protection and rollback on error
  const handleRoleChange = async (
    targetUser: DirectoryUserItem,
    chosenRole: FunctionalRole
  ) => {
    setOpenDropdownId(null);

    if (isSuperAdminEmail(targetUser.email)) {
      showToast("error", t("admin.users.superAdminLockedHint"));
      return;
    }

    const isSelf = Boolean(
      (currentUserId && targetUser.dbId === currentUserId) ||
        (currentUserEmail &&
          targetUser.email.toLowerCase() === currentUserEmail.toLowerCase())
    );
    if (isSelf) {
      showToast("error", t("admin.users.ownRoleLockedHint"));
      return;
    }

    const dbRole: UserRole = chosenRole === "admin" ? "admin" : "user";
    const overrideKey = targetUser.dbId || targetUser.id;
    const previousOverride = userOverrides[overrideKey];

    setUserOverrides((prev) => ({
      ...prev,
      [overrideKey]: {
        ...prev[overrideKey],
        role: chosenRole,
        statusDot: chosenRole === "admin" ? "yellow" : "green",
        secondaryStatKey: "accessLevel",
        secondaryStatValue: chosenRole === "admin" ? "Level 5" : "Standard",
      },
    }));

    const revertOptimistic = () => {
      setUserOverrides((prev) => {
        const next = { ...prev };
        if (previousOverride) {
          next[overrideKey] = previousOverride;
        } else {
          delete next[overrideKey];
        }
        return next;
      });
    };

    const localizedRole = getRoleDisplayLabel(chosenRole);

    if (targetUser.dbId) {
      try {
        const res = await updateUserRoleAction(targetUser.dbId, dbRole);
        if (res.success) {
          showToast(
            "success",
            t("admin.users.toastRoleUpdated", {
              name: targetUser.name,
              role: localizedRole,
            })
          );
        } else {
          revertOptimistic();
          showToast("error", res.error || t("admin.users.toastRoleError"));
        }
      } catch (err: unknown) {
        revertOptimistic();
        showToast(
          "error",
          err instanceof Error ? err.message : t("admin.users.toastRoleError")
        );
      }
    } else {
      showToast(
        "success",
        t("admin.users.toastRoleUpdated", {
          name: targetUser.name,
          role: localizedRole,
        })
      );
    }
  };

  // Add User submit handler
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedEmail = newEmail.trim().toLowerCase();
    if (!cleanedEmail) return;

    if (isSuperAdminEmail(cleanedEmail)) {
      showToast("error", t("admin.users.superAdminLockedHint"));
      return;
    }

    if (currentUserEmail && cleanedEmail === currentUserEmail.toLowerCase()) {
      showToast("error", t("admin.users.ownRoleLockedHint"));
      return;
    }

    startAssignTransition(async () => {
      try {
        const localizedRole = getRoleDisplayLabel(newRole);
        const res = await assignRoleByEmailAction(cleanedEmail, newRole);
        if (res.success) {
          showToast(
            "success",
            t("admin.users.toastUserAssigned", {
              role: localizedRole,
              email: cleanedEmail,
            })
          );
        } else {
          showToast(
            "success",
            t("admin.users.toastUserInvited", {
              email: cleanedEmail,
              role: localizedRole,
            })
          );
        }

        const newId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
        setAddedUsers((prev) => [
          {
            id: newId,
            name: formatFallbackName(cleanedEmail, newId),
            email: cleanedEmail,
            avatar: null,
            role: newRole,
            status: "Active",
            statusDot: newRole === "admin" ? "yellow" : "green",
            propertiesCount: "-",
            secondaryStatKey: "accessLevel",
            secondaryStatValue: newRole === "admin" ? "Level 5" : "Standard",
          },
          ...prev,
        ]);

        setNewEmail("");
        setIsAddUserModalOpen(false);
      } catch (err: unknown) {
        showToast(
          "error",
          err instanceof Error ? err.message : t("admin.users.toastAddError")
        );
      }
    });
  };

  return (
    <div className="flex-grow flex flex-col w-full">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-dropdown border text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 ${toast.type === "success"
              ? "bg-white text-emerald-800 border-emerald-200 dark:bg-[#152e2a] dark:text-emerald-300 dark:border-emerald-800"
              : "bg-white text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800"
            }`}
        >
          <span className="material-icons text-lg">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header Section */}
      <header className="w-full pt-6 sm:pt-8 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-nordic dark:text-white">
              {t("admin.users.title")}
            </h1>
            <p className="text-nordic/60 dark:text-gray-400 mt-0.5 sm:mt-1 text-xs sm:text-sm">
              {t("admin.users.subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-nordic/40 group-focus-within:text-primary text-xl">
                  search
                </span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={t("admin.users.searchPlaceholder")}
                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white dark:bg-gray-800 text-nordic dark:text-white shadow-soft placeholder-nordic/30 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm outline-none"
              />
            </div>

            {/* Add User Button */}
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-primary/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <span className="material-icons text-base">add</span>
              {t("admin.users.addUser")}
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="mt-6 sm:mt-8 flex gap-4 sm:gap-6 border-b border-nordic/10 overflow-x-auto scrollbar-hide">
          {(["All Users", "Admins", "Users"] as const).map(
            (tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  type="button"
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`pb-3 text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap ${isActive
                      ? "font-semibold text-primary border-b-2 border-primary"
                      : "font-medium text-nordic/60 hover:text-nordic"
                    }`}
                >
                  {t(`admin.users.tabs.${tab}`)}
                </button>
              );
            }
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-12 space-y-3 sm:space-y-4">
        {/* Table Header (hidden on mobile) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-nordic/50 mb-2">
          <div className="col-span-4">{t("admin.users.colDetails")}</div>
          <div className="col-span-3">{t("admin.users.colRoleStatus")}</div>
          <div className="col-span-3">{t("admin.users.colPerformance")}</div>
          <div className="col-span-2 text-right">
            {t("admin.users.colActions")}
          </div>
        </div>

        {/* User Cards List */}
        {paginatedUsers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 sm:p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="material-icons text-3xl sm:text-4xl text-nordic/30 mb-2">
              people_outline
            </span>
            <p className="text-sm sm:text-base font-semibold text-nordic dark:text-white">
              {t("admin.users.noUsers")}
            </p>
            <p className="text-xs text-nordic/60 dark:text-gray-400 mt-1">
              {t("admin.users.noUsersSub")}
            </p>
          </div>
        ) : (
          paginatedUsers.map((user, idx) => {
            const isMenuOpen = openDropdownId === user.id;
            const isSuperAdmin = isSuperAdminEmail(user.email);
            const isCurrentUser = Boolean(
              (currentUserId && user.dbId === currentUserId) ||
                (currentUserEmail &&
                  user.email.toLowerCase() === currentUserEmail.toLowerCase())
            );
            const isHighlighted =
              user.isHighlighted ||
              (activeTab === "All Users" && idx === 0 && currentPage === 1);

            const highResThumb = getHighResAvatarUrl(user.avatar, 200);

            const secondaryValue =
              user.secondaryStatValue === "Super"
                ? t("admin.users.stats.superAccess")
                : user.secondaryStatValue === "Level 5"
                  ? t("admin.users.stats.level5")
                  : user.secondaryStatValue === "Standard"
                    ? t("admin.users.stats.standardAccess")
                    : user.secondaryStatValue;

            return (
              <div
                key={user.id}
                className={`user-card group relative rounded-xl p-4 sm:p-5 shadow-sm flex flex-col md:grid md:grid-cols-12 gap-3 sm:gap-4 items-stretch md:items-center ${isHighlighted
                    ? "bg-active-green dark:bg-primary/20 border border-transparent hover:shadow-soft"
                    : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-active-green dark:hover:bg-primary/20"
                  } ${isMenuOpen ? "z-30" : "z-10"}`}
              >
                {/* User Details */}
                <div className="col-span-12 md:col-span-4 flex items-center w-full">
                  <div className="relative flex-shrink-0">
                    {highResThumb && !brokenAvatarIds.has(user.id) ? (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewAvatar({
                            src: user.avatar!,
                            name: user.name,
                            subtitle: user.email,
                          })
                        }
                        title={t("profile.viewPhoto")}
                        aria-label={`${t("profile.viewPhoto")}: ${user.name}`}
                        className={`group/thumb relative h-12 w-12 rounded-full overflow-hidden cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isHighlighted
                            ? "border-2 border-white dark:border-primary"
                            : "border border-nordic/10"
                          }`}
                      >
                        <img
                          alt={user.name}
                          src={highResThumb}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setBrokenAvatarIds((prev) =>
                              new Set(prev).add(user.id)
                            )
                          }
                          className={`h-full w-full object-cover transition-transform duration-200 group-hover/thumb:scale-110 ${user.isGrayscale ? "grayscale" : ""
                            }`}
                        />
                        <span className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors flex items-center justify-center">
                          <span className="material-icons text-white text-sm opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                            zoom_in
                          </span>
                        </span>
                      </button>
                    ) : (
                      <div
                        aria-label={user.name}
                        className={`h-12 w-12 rounded-full bg-mosque/15 text-mosque font-bold text-sm flex items-center justify-center border ${isHighlighted
                            ? "border-white dark:border-primary"
                            : "border-mosque/20"
                          }`}
                      >
                        {getUserInitials(user.name, user.email)}
                      </div>
                    )}
                    {user.statusDot === "green" && (
                      <span className="pointer-events-none absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
                    )}
                    {user.statusDot === "yellow" && (
                      <span className="pointer-events-none absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-yellow-400 ring-2 ring-white" />
                    )}
                  </div>
                  <div className="ml-4 overflow-hidden">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-sm font-bold truncate ${user.status === "Inactive"
                            ? "text-nordic/60 dark:text-gray-400"
                            : "text-nordic dark:text-white"
                          }`}
                      >
                        {user.name}
                      </span>
                      {isCurrentUser && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/15 text-primary dark:bg-primary/30 dark:text-emerald-200">
                          {t("admin.users.youBadge")}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-xs truncate ${user.status === "Inactive"
                          ? "text-nordic/40 dark:text-gray-500"
                          : isHighlighted
                            ? "text-nordic/70 dark:text-gray-300"
                            : "text-nordic/60 dark:text-gray-400"
                        }`}
                    >
                      {user.email}
                    </div>
                    <div
                      className={`mt-1 text-[10px] px-2 py-0.5 inline-block rounded text-nordic/60 ${isHighlighted
                          ? "bg-white/50"
                          : "bg-gray-50 dark:bg-white/10 group-hover:bg-white/50 transition-colors"
                        }`}
                    >
                      ID: #{user.id}
                    </div>
                  </div>
                </div>

                {/* Role & Status */}
                <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
                  {isSuperAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-nordic text-hint-green border border-mosque/30 shadow-xs">
                      <span className="material-icons text-[14px]">
                        workspace_premium
                      </span>
                      {t("admin.users.roles.superAdmin")}
                    </span>
                  ) : user.role === "admin" ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-nordic text-white">
                      {t("admin.users.roles.admin")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {t("admin.users.roles.user")}
                    </span>
                  )}

                  {/* Status Indicator */}
                  <div
                    className={`flex items-center text-xs ${user.status === "Inactive"
                        ? "text-nordic/40 dark:text-gray-500"
                        : "text-nordic/60 dark:text-gray-400"
                      }`}
                  >
                    {user.status === "Active" ? (
                      <>
                        <span className="material-icons text-[14px] mr-1 text-primary">
                          check_circle
                        </span>
                        <span>{t("admin.users.status.Active")}</span>
                      </>
                    ) : user.status === "Away" ? (
                      <>
                        <span className="material-icons text-[14px] mr-1 text-gray-400">
                          schedule
                        </span>
                        <span>{t("admin.users.status.Away")}</span>
                      </>
                    ) : (
                      <>
                        <span className="material-icons text-[14px] mr-1">
                          remove_circle_outline
                        </span>
                        <span>{t("admin.users.status.Inactive")}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Performance */}
                <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
                  <div>
                    <div
                      className={`text-[10px] uppercase tracking-wider ${isHighlighted ? "text-nordic/50" : "text-nordic/40"
                        }`}
                    >
                      {t("admin.users.stats.properties")}
                    </div>
                    <div
                      className={`text-sm font-semibold ${user.status === "Inactive"
                          ? "text-nordic/60 dark:text-gray-400"
                          : "text-nordic dark:text-white"
                        }`}
                    >
                      {user.propertiesCount}
                    </div>
                  </div>
                  <div>
                    <div
                      className={`text-[10px] uppercase tracking-wider ${isHighlighted ? "text-nordic/50" : "text-nordic/40"
                        }`}
                    >
                      {t(`admin.users.stats.${user.secondaryStatKey}`)}
                    </div>
                    <div
                      className={`text-sm font-semibold ${user.status === "Inactive"
                          ? "text-nordic/60 dark:text-gray-400"
                          : "text-nordic dark:text-white"
                        }`}
                    >
                      {secondaryValue}
                    </div>
                  </div>
                </div>

                {/* Actions (Change Role) */}
                <div
                  data-role-dropdown
                  className="col-span-12 md:col-span-2 w-full flex justify-end relative"
                >
                  {isSuperAdmin || isCurrentUser ? (
                    <button
                      type="button"
                      disabled
                      title={
                        isSuperAdmin
                          ? t("admin.users.superAdminLockedHint")
                          : t("admin.users.ownRoleLockedHint")
                      }
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-nordic/15 bg-nordic/5 dark:bg-white/5 text-nordic/50 dark:text-gray-400 cursor-not-allowed w-full md:w-auto"
                    >
                      <span className="material-icons text-[15px]">lock</span>
                      <span>
                        {isSuperAdmin
                          ? t("admin.users.protectedRole")
                          : t("admin.users.yourAccount")}
                      </span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdownId(isMenuOpen ? null : user.id)
                        }
                        className={`inline-flex items-center px-4 py-2 text-xs font-medium rounded-lg focus:outline-none transition-colors w-full md:w-auto justify-center cursor-pointer ${isMenuOpen
                            ? "bg-primary text-white shadow-md hover:bg-primary-dark"
                            : isHighlighted
                              ? "border border-nordic/10 bg-white dark:bg-gray-800 shadow-sm text-nordic hover:bg-nordic hover:text-white"
                              : "border border-gray-200 dark:border-gray-600 bg-transparent text-nordic/70 dark:text-gray-300 hover:border-nordic hover:text-nordic dark:hover:text-white group-hover:bg-white group-hover:shadow-sm"
                          }`}
                      >
                        {t("admin.users.changeRole")}
                        <span className="material-icons text-[16px] ml-2">
                          {isMenuOpen ? "expand_less" : "expand_more"}
                        </span>
                      </button>

                      {isMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-dropdown bg-primary ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50 origin-top-right animate-in fade-in slide-in-from-top-1 duration-150">
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                          >
                            <button
                              type="button"
                              onClick={() => handleRoleChange(user, "admin")}
                              className={`group flex items-center w-full px-4 py-3 text-xs text-left transition-colors cursor-pointer ${user.role === "admin"
                                  ? "bg-white/20 text-white font-medium"
                                  : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`}
                              role="menuitem"
                            >
                              <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">
                                shield
                              </span>
                              {t("admin.users.roles.admin")}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRoleChange(user, "user")}
                              className={`group flex items-center w-full px-4 py-3 text-xs text-left transition-colors cursor-pointer ${user.role === "user"
                                  ? "bg-white/20 text-white font-medium"
                                  : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`}
                              role="menuitem"
                            >
                              <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">
                                person
                              </span>
                              {t("admin.users.roles.user")}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Footer & Pagination */}
      <footer className="mt-auto border-t border-nordic/5 bg-background-light dark:bg-background-dark py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-nordic/60 dark:text-gray-400">
                {t("admin.users.showing")}{" "}
                <span className="font-medium text-nordic dark:text-white">
                  {totalUsers > 0 ? startIndex + 1 : 0}
                </span>{" "}
                {t("admin.users.to")}{" "}
                <span className="font-medium text-nordic dark:text-white">
                  {Math.min(startIndex + pageSize, totalUsers)}
                </span>{" "}
                {t("admin.users.of")}{" "}
                <span className="font-medium text-nordic dark:text-white">
                  {totalUsers}
                </span>{" "}
                {t("admin.users.usersCount")}
              </p>
            </div>
            <div>
              <nav
                aria-label="Pagination"
                className="relative z-0 inline-flex rounded-md shadow-none -space-x-px"
              >
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-nordic/50 hover:text-primary transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <span className="sr-only">{t("admin.users.previous")}</span>
                  <span className="material-icons text-xl">chevron_left</span>
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  const isCurrent = pNum === currentPage;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setCurrentPage(pNum)}
                      aria-current={isCurrent ? "page" : undefined}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 transition-colors cursor-pointer ${isCurrent
                          ? "z-10 bg-primary text-white shadow-sm"
                          : "bg-transparent text-nordic/70 hover:bg-white hover:text-primary"
                        }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-nordic/50 hover:text-primary transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <span className="sr-only">{t("admin.users.next")}</span>
                  <span className="material-icons text-xl">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Mobile Pagination */}
          <div className="flex items-center justify-between w-full sm:hidden">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-nordic bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
            >
              {t("admin.users.previous")}
            </button>
            <span className="text-xs text-nordic/60">
              {t("admin.users.pageOf", {
                current: currentPage,
                total: totalPages,
              })}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-nordic bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
            >
              {t("admin.users.next")}
            </button>
          </div>
        </div>
      </footer>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            className="fixed inset-0"
            onClick={() => setIsAddUserModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 bg-white dark:bg-[#152e2a] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-dropdown border border-nordic/10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-nordic/10">
              <div className="flex items-center gap-2.5">
                <span className="material-icons text-primary text-2xl">
                  person_add
                </span>
                <h3 className="text-lg font-bold text-nordic dark:text-white">
                  {t("admin.users.modalTitle")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                aria-label={t("modals.close")}
                className="text-nordic/40 hover:text-nordic transition-colors p-1 rounded-lg cursor-pointer"
              >
                <span className="material-icons text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/60 dark:text-gray-400 mb-1.5">
                  {t("admin.users.emailLabel")}
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="agent@luxuryestates.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-nordic/15 bg-background-light dark:bg-gray-800 text-nordic dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/60 dark:text-gray-400 mb-1.5">
                  {t("admin.users.systemRoleLabel")}
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as FunctionalRole)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-nordic/15 bg-background-light dark:bg-gray-800 text-nordic dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all cursor-pointer"
                >
                  <option value="user">{t("admin.users.roleUserDesc")}</option>
                  <option value="admin">{t("admin.users.roleAdminDesc")}</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-nordic/10">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-nordic/70 hover:text-nordic transition-colors cursor-pointer"
                >
                  {t("admin.users.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isPendingAssign}
                  className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-medium shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isPendingAssign
                    ? t("admin.users.adding")
                    : t("admin.users.addUser")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* High-Res Avatar Lightbox Modal */}
      <AvatarLightboxModal
        isOpen={Boolean(previewAvatar)}
        onClose={() => setPreviewAvatar(null)}
        imageUrl={previewAvatar?.src || null}
        name={previewAvatar?.name || ""}
        subtitle={previewAvatar?.subtitle || null}
      />
    </div>
  );
};
