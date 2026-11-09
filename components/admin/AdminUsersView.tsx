"use client";

import React, { useState, useTransition, useMemo } from "react";
import { UserRole, UserRoleRow } from "@/types/database.types";
import { updateUserRoleAction, assignRoleByEmailAction } from "@/app/actions/roles";

interface DirectoryUserItem {
  id: string;
  dbId?: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "broker" | "agent" | "user" | string;
  roleLabel: string;
  status: "Active" | "Away" | "Inactive";
  statusDot?: "green" | "yellow";
  propertiesCount: string | number;
  secondaryStatLabel: string;
  secondaryStatValue: string;
  isHighlighted?: boolean;
  isGrayscale?: boolean;
}

const TEMPLATE_USERS: DirectoryUserItem[] = [
  {
    id: "USR-2941",
    name: "Sarah Miller",
    email: "sarah.miller@luxuryestates.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC56qX3A4ZIRCJqxha17327kptmQpANrrIT6CLj09DTQ7ZLjB0fF9cMlC1MCJKAs3hr5oUDilNrCcdzUdLAZtwX25YQblIBzVpUSa4XfyFc_WJDGvW0T1svVr884aNmze31Cl_2UkKik03EROGXyke1i6PuTAZaAtf8yMN8xLPJIAdQ5Gc1m_SqkCpADlwXPZ8fL-BWzj4Ck3PpZ1GjAGsyq9Ul9L3SmH_UnJzI-NbipFCmtQI2JJiB0TiUhogRjIBNn8TCUkubVhs",
    role: "broker",
    roleLabel: "Senior Broker",
    status: "Active",
    statusDot: "green",
    propertiesCount: "24",
    secondaryStatLabel: "Sales (YTD)",
    secondaryStatValue: "$4.2M",
    isHighlighted: true,
  },
  {
    id: "USR-8821",
    name: "Marcus Chen",
    email: "marcus.c@luxuryestates.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6y5hdg1R7gLFSihyqty_LGTd8uQTZHpyo_det0XoV6ak0U5H9xxuTlfFTXPP3vX9dhpeIETDGBcowSSiDyHVTXQm_0Xv8KXRj-n2PLGHHBlmSsYSxlZPErAGQSycUYUlDT1FNqac9hxwpfwQ3MjO4tdj7q9Pmb8WHgzBaOMain4vzaZbThFi3Hg9-qkhofOnAi7hJ1JD3EgK6Zu5iWLE8NDph0Uhd8iHYZHNUfUzBfJN1E6NRB2EKwbx7MmgWloP-YysiRt4IfrE",
    role: "agent",
    roleLabel: "Agent",
    status: "Away",
    propertiesCount: "8",
    secondaryStatLabel: "Sales (YTD)",
    secondaryStatValue: "$1.8M",
  },
  {
    id: "USR-1029",
    name: "Elias Thorne",
    email: "elias.thorne@luxuryestates.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBxUenMO4Re0naHHGO3GB46gBwyGMA7GYH5XNQVi86xJtOVYUNoL1nn8Q65pwWZkyLQdR_vB2N8mOuxFtLT6blCwOerfNuVqSeqTpdrustLAO7-HYwjC_83sTmfBsuSmMXUPTAZub0b8Tgo2uGzoPZ2i98s_taTX232u4UPVO3NybNwYhzYw8FhvhRPAFvcI-QWnVtQO820Eex8lc8BoMd_fWRl3S6oU4opRnz9HCQOB15l5se_ousKRtbZcFE1JqcjKn1T1PrbGOE",
    role: "admin",
    roleLabel: "Administrator",
    status: "Active",
    statusDot: "yellow",
    propertiesCount: "-",
    secondaryStatLabel: "Access Level",
    secondaryStatValue: "Level 5",
  },
  {
    id: "USR-3310",
    name: "Anna Koval",
    email: "anna.k@luxuryestates.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9R6zvnu8j58sG4eUwo-9f00NJRnaHJllOxtW7NfLtjJiAJS9xgpRhQlnDfEULT1ntyQ00kNW93vDfqmwYwX1RCQPYBbvhlrs2VOAtipQyTT3C6te7SH_slUUdDRloL7IVp9QUnB8Ivo76jM9GbGTSedRCNENz2EG_QljoMFfWvhKp0s43vQePPAzlx8RC8KtwYuwd8ToaZVZxa2XoxnstlCppJhDJRvw5Ou981GU62MElNMA1fzr6yjX_QN1QSgdX--GMTBTb22I",
    role: "user",
    roleLabel: "Viewer",
    status: "Inactive",
    isGrayscale: true,
    propertiesCount: "0",
    secondaryStatLabel: "Last Login",
    secondaryStatValue: "2mo ago",
  },
  {
    id: "USR-9942",
    name: "David O'Conner",
    email: "david.o@luxuryestates.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAg2jyeiLRo7sss3zX5bvvLWpJNUabZqBCz9HIWx2jcHtvG5KfoaquiQRmwZWTLpD4Rr3jS3iRzWjTa0VLibUkWK_MxV6fzcMISmS1SEsNldZilln2O3A6992ZnLgEiD8ASlQ1cFmc-XvY1X7sK_3pBGUWYHWWutX34hxrAZ-HsCMlmBgatcSpPiTXo4ICkrQ7uSf490A6Bxx60h1ac_QZQl46jo1CciIMS6fFu2O2ZozSmTaFlwiOWhN1vo5n4gXQ0gjh785OlBLQ",
    role: "agent",
    roleLabel: "Agent",
    status: "Active",
    propertiesCount: "14",
    secondaryStatLabel: "Sales (YTD)",
    secondaryStatValue: "$3.1M",
  },
];

interface AdminUsersViewProps {
  initialUsers?: UserRoleRow[];
  currentUserId?: string | null;
  currentUserEmail?: string | null;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({
  initialUsers = [],
  currentUserId,
}) => {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "All Users" | "Agents" | "Brokers" | "Admins"
  >("All Users");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Add User modal state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("agent");
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

  // Merge database users with template users
  const [userList, setUserList] = useState<DirectoryUserItem[]>(() => {
    // Map database users
    const mappedDbUsers: DirectoryUserItem[] = initialUsers.map((u, idx) => {
      const email = u.email || "user@example.com";
      const shortId = u.id.slice(0, 4).toUpperCase();
      const name = email.split("@")[0].replace(/[._-]/g, " ");
      const capitalizedName = name
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      return {
        id: `USR-${shortId}`,
        dbId: u.id,
        name: capitalizedName || `User ${shortId}`,
        email: email,
        avatar:
          TEMPLATE_USERS[idx % TEMPLATE_USERS.length].avatar,
        role: u.role,
        roleLabel:
          u.role === "admin"
            ? "Administrator"
            : u.role === "agent"
            ? "Agent"
            : "Viewer",
        status: "Active",
        statusDot: u.role === "admin" ? "yellow" : "green",
        propertiesCount: u.role === "agent" ? 12 : "-",
        secondaryStatLabel:
          u.role === "admin" ? "Access Level" : "Sales (YTD)",
        secondaryStatValue: u.role === "admin" ? "Level 5" : "$2.4M",
        isHighlighted: idx === 0,
      };
    });

    // If there are real users in DB, merge with template users avoiding email duplicates
    if (mappedDbUsers.length > 0) {
      const existingEmails = new Set(
        mappedDbUsers.map((u) => u.email.toLowerCase())
      );
      const remainingTemplates = TEMPLATE_USERS.filter(
        (t) => !existingEmails.has(t.email.toLowerCase())
      );
      return [...mappedDbUsers, ...remainingTemplates];
    }

    return TEMPLATE_USERS;
  });

  // Filtered users
  const filteredUsers = useMemo(() => {
    return userList.filter((user) => {
      // Search filter
      const matchesSearch =
        searchQuery.trim() === "" ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Tab filter
      let matchesTab = true;
      if (activeTab === "Agents") {
        matchesTab = user.role === "agent";
      } else if (activeTab === "Brokers") {
        matchesTab = user.role === "broker" || user.roleLabel.toLowerCase().includes("broker");
      } else if (activeTab === "Admins") {
        matchesTab = user.role === "admin";
      }

      return matchesSearch && matchesTab;
    });
  }, [userList, searchQuery, activeTab]);

  // Pagination calculation
  const totalUsers = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + pageSize
  );

  // Role change handler
  const handleRoleChange = async (
    targetUser: DirectoryUserItem,
    chosenRole: "admin" | "broker" | "agent" | "user" | "suspended"
  ) => {
    setOpenDropdownId(null);

    // Map role to valid DB UserRole
    const dbRole: UserRole =
      chosenRole === "admin"
        ? "admin"
        : chosenRole === "user" || chosenRole === "suspended"
        ? "user"
        : "agent";

    // Optimistic UI update
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === targetUser.id) {
          return {
            ...u,
            role: chosenRole,
            roleLabel:
              chosenRole === "admin"
                ? "Administrator"
                : chosenRole === "broker"
                ? "Senior Broker"
                : chosenRole === "agent"
                ? "Agent"
                : chosenRole === "suspended"
                ? "Suspended"
                : "Viewer",
            status: chosenRole === "suspended" ? "Inactive" : u.status,
          };
        }
        return u;
      })
    );

    // If target has a real Supabase DB id, execute Server Action
    if (targetUser.dbId) {
      try {
        const res = await updateUserRoleAction(targetUser.dbId, dbRole);
        if (res.success) {
          showToast(
            "success",
            `Role updated for ${targetUser.name} to ${chosenRole}.`
          );
        } else {
          showToast("error", res.error || "Failed to update role in database.");
        }
      } catch (err: any) {
        showToast("error", err?.message || "Error updating role.");
      }
    } else {
      showToast(
        "success",
        `Role for ${targetUser.name} changed to ${chosenRole}.`
      );
    }
  };

  // Add User submit handler
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    startAssignTransition(async () => {
      try {
        const res = await assignRoleByEmailAction(newEmail, newRole);
        if (res.success) {
          showToast("success", `Role ${newRole} assigned to ${newEmail}`);
        } else {
          showToast(
            "success",
            `User invitation registered for ${newEmail} as ${newRole}.`
          );
        }

        // Add to local state as well
        const newId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
        const namePart = newEmail.split("@")[0];
        setUserList((prev) => [
          {
            id: newId,
            name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
            email: newEmail.trim(),
            avatar:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBhLuM9qNltZNxgIWPtC3dVxQ_JLFKXYB9d_klGFux_2JVOGtRlbV4GvpvdT4wqpsueZnXFQhKJe9MGGvM6rXQX15iv80mbEKxjmy4X14AZRqvp573ZlKYDN9bAb0ka7B-g5mkOCP6nRuKC9QsO02JVq6gqZeAo3-7dUurVhhgPJGeuL0Gk2Cp3Wnu5mVlUtpajB2wtx8uMoytbh78i9RmHYtJg52ZELl9XdIC9f5Kix_lFMFoi6Ru61ARrEGIrvgvz4ViiKhufTns",
            role: newRole,
            roleLabel:
              newRole === "admin"
                ? "Administrator"
                : newRole === "agent"
                ? "Agent"
                : "Viewer",
            status: "Active",
            statusDot: "green",
            propertiesCount: 0,
            secondaryStatLabel: "Sales (YTD)",
            secondaryStatValue: "$0",
          },
          ...prev,
        ]);

        setNewEmail("");
        setIsAddUserModalOpen(false);
      } catch (err: any) {
        showToast("error", err?.message || "Failed to add user.");
      }
    });
  };

  return (
    <div className="flex-grow flex flex-col w-full">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-dropdown border text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toast.type === "success"
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
      <header className="w-full pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-nordic dark:text-white">
              User Directory
            </h1>
            <p className="text-nordic/60 dark:text-gray-400 mt-1 text-sm">
              Manage user access and roles for your properties.
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
                placeholder="Search by name, email..."
                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white dark:bg-gray-800 text-nordic dark:text-white shadow-soft placeholder-nordic/30 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm outline-none"
              />
            </div>

            {/* Add User Button */}
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-primary/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <span className="material-icons text-base">add</span>
              Add User
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="mt-8 flex gap-6 border-b border-nordic/10 overflow-x-auto">
          {(["All Users", "Agents", "Brokers", "Admins"] as const).map(
            (tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`pb-3 text-sm transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "font-semibold text-primary border-b-2 border-primary"
                      : "font-medium text-nordic/60 hover:text-nordic"
                  }`}
                >
                  {tab}
                </button>
              );
            }
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-12 space-y-4">
        {/* Table Header (hidden on mobile) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-nordic/50 mb-2">
          <div className="col-span-4">User Details</div>
          <div className="col-span-3">Role &amp; Status</div>
          <div className="col-span-3">Performance</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* User Cards List */}
        {paginatedUsers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="material-icons text-4xl text-nordic/30 mb-2">
              people_outline
            </span>
            <p className="text-base font-semibold text-nordic dark:text-white">
              No users found
            </p>
            <p className="text-xs text-nordic/60 dark:text-gray-400 mt-1">
              Try adjusting your search criteria or role filters.
            </p>
          </div>
        ) : (
          paginatedUsers.map((user, idx) => {
            const isMenuOpen = openDropdownId === user.id;
            const isHighlighted =
              user.isHighlighted || (activeTab === "All Users" && idx === 0 && currentPage === 1);

            return (
              <div
                key={user.id}
                className={`user-card group relative rounded-xl p-5 shadow-sm flex flex-col md:grid md:grid-cols-12 gap-4 items-center ${
                  isHighlighted
                    ? "bg-active-green dark:bg-primary/20 border border-transparent hover:shadow-soft"
                    : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-active-green dark:hover:bg-primary/20"
                } ${isMenuOpen ? "z-30" : "z-10"}`}
              >
                {/* User Details */}
                <div className="col-span-12 md:col-span-4 flex items-center w-full">
                  <div className="relative flex-shrink-0">
                    <img
                      alt={`Portrait of ${user.name}`}
                      src={user.avatar}
                      className={`h-12 w-12 rounded-full object-cover ${
                        user.isGrayscale ? "grayscale" : ""
                      } ${
                        isHighlighted
                          ? "border-2 border-white dark:border-primary"
                          : ""
                      }`}
                    />
                    {user.statusDot === "green" && (
                      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
                    )}
                    {user.statusDot === "yellow" && (
                      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-yellow-400 ring-2 ring-white" />
                    )}
                  </div>
                  <div className="ml-4 overflow-hidden">
                    <div
                      className={`text-sm font-bold truncate ${
                        user.status === "Inactive"
                          ? "text-nordic/60 dark:text-gray-400"
                          : "text-nordic dark:text-white"
                      }`}
                    >
                      {user.name}
                    </div>
                    <div
                      className={`text-xs truncate ${
                        user.status === "Inactive"
                          ? "text-nordic/40 dark:text-gray-500"
                          : isHighlighted
                          ? "text-nordic/70 dark:text-gray-300"
                          : "text-nordic/60 dark:text-gray-400"
                      }`}
                    >
                      {user.email}
                    </div>
                    <div
                      className={`mt-1 text-[10px] px-2 py-0.5 inline-block rounded text-nordic/60 ${
                        isHighlighted
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
                  {/* Role Badge */}
                  {user.role === "admin" ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-nordic text-white">
                      Administrator
                    </span>
                  ) : user.role === "broker" ||
                    user.roleLabel.toLowerCase().includes("broker") ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                      Senior Broker
                    </span>
                  ) : user.role === "agent" ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      Agent
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      {user.roleLabel || "Viewer"}
                    </span>
                  )}

                  {/* Status Indicator */}
                  <div
                    className={`flex items-center text-xs ${
                      user.status === "Inactive"
                        ? "text-nordic/40 dark:text-gray-500"
                        : "text-nordic/60 dark:text-gray-400"
                    }`}
                  >
                    {user.status === "Active" ? (
                      <>
                        <span className="material-icons text-[14px] mr-1 text-primary">
                          check_circle
                        </span>
                        <span>Active</span>
                      </>
                    ) : user.status === "Away" ? (
                      <>
                        <span className="material-icons text-[14px] mr-1 text-gray-400">
                          schedule
                        </span>
                        <span>Away</span>
                      </>
                    ) : (
                      <>
                        <span className="material-icons text-[14px] mr-1">
                          remove_circle_outline
                        </span>
                        <span>Inactive</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Performance */}
                <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
                  <div>
                    <div
                      className={`text-[10px] uppercase tracking-wider ${
                        isHighlighted ? "text-nordic/50" : "text-nordic/40"
                      }`}
                    >
                      Properties
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        user.status === "Inactive"
                          ? "text-nordic/60 dark:text-gray-400"
                          : "text-nordic dark:text-white"
                      }`}
                    >
                      {user.propertiesCount}
                    </div>
                  </div>
                  <div>
                    <div
                      className={`text-[10px] uppercase tracking-wider ${
                        isHighlighted ? "text-nordic/50" : "text-nordic/40"
                      }`}
                    >
                      {user.secondaryStatLabel}
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        user.status === "Inactive"
                          ? "text-nordic/60 dark:text-gray-400"
                          : "text-nordic dark:text-white"
                      }`}
                    >
                      {user.secondaryStatValue}
                    </div>
                  </div>
                </div>

                {/* Actions (Change Role) */}
                <div className="col-span-12 md:col-span-2 w-full flex justify-end relative">
                  <button
                    onClick={() =>
                      setOpenDropdownId(isMenuOpen ? null : user.id)
                    }
                    className={`inline-flex items-center px-4 py-2 text-xs font-medium rounded-lg focus:outline-none transition-colors w-full md:w-auto justify-center cursor-pointer ${
                      isMenuOpen
                        ? "bg-primary text-white shadow-md hover:bg-primary-dark"
                        : isHighlighted
                        ? "border border-nordic/10 bg-white dark:bg-gray-800 shadow-sm text-nordic hover:bg-nordic hover:text-white"
                        : "border border-gray-200 dark:border-gray-600 bg-transparent text-nordic/70 dark:text-gray-300 hover:border-nordic hover:text-nordic dark:hover:text-white group-hover:bg-white group-hover:shadow-sm"
                    }`}
                  >
                    Change Role
                    <span className="material-icons text-[16px] ml-2">
                      {isMenuOpen ? "expand_less" : "expand_more"}
                    </span>
                  </button>

                  {/* Interactive Dropdown Menu */}
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
                          className={`group flex items-center w-full px-4 py-3 text-xs text-left transition-colors cursor-pointer ${
                            user.role === "admin"
                              ? "bg-white/20 text-white font-medium"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                          role="menuitem"
                        >
                          <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">
                            shield
                          </span>
                          Administrator
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRoleChange(user, "broker")}
                          className={`group flex items-center w-full px-4 py-3 text-xs text-left transition-colors cursor-pointer ${
                            user.role === "broker"
                              ? "bg-white/20 text-white font-medium"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                          role="menuitem"
                        >
                          <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">
                            business_center
                          </span>
                          Broker
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRoleChange(user, "agent")}
                          className={`group flex items-center w-full px-4 py-3 text-xs text-left transition-colors cursor-pointer ${
                            user.role === "agent"
                              ? "bg-white/20 text-white font-medium"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                          role="menuitem"
                        >
                          <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">
                            support_agent
                          </span>
                          Agent
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRoleChange(user, "user")}
                          className={`group flex items-center w-full px-4 py-3 text-xs text-left transition-colors cursor-pointer ${
                            user.role === "user"
                              ? "bg-white/20 text-white font-medium"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                          role="menuitem"
                        >
                          <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">
                            visibility
                          </span>
                          Viewer
                        </button>

                        <div className="border-t border-white/10 my-1" />

                        <button
                          type="button"
                          onClick={() => handleRoleChange(user, "suspended")}
                          className="group flex items-center w-full px-4 py-3 text-xs text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-colors cursor-pointer text-left"
                          role="menuitem"
                        >
                          <span className="material-icons text-sm mr-3 text-red-300 group-hover:text-red-100">
                            block
                          </span>
                          Suspend User
                        </button>
                      </div>
                    </div>
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
                Showing{" "}
                <span className="font-medium text-nordic dark:text-white">
                  {totalUsers > 0 ? startIndex + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium text-nordic dark:text-white">
                  {Math.min(startIndex + pageSize, totalUsers)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-nordic dark:text-white">
                  {totalUsers}
                </span>{" "}
                users
              </p>
            </div>
            <div>
              <nav
                aria-label="Pagination"
                className="relative z-0 inline-flex rounded-md shadow-none -space-x-px"
              >
                {/* Previous Button */}
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-nordic/50 hover:text-primary transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <span className="sr-only">Previous</span>
                  <span className="material-icons text-xl">chevron_left</span>
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  const isCurrent = pNum === currentPage;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setCurrentPage(pNum)}
                      aria-current={isCurrent ? "page" : undefined}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 transition-colors cursor-pointer ${
                        isCurrent
                          ? "z-10 bg-primary text-white shadow-sm"
                          : "bg-transparent text-nordic/70 hover:bg-white hover:text-primary"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-nordic/50 hover:text-primary transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <span className="sr-only">Next</span>
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
              Previous
            </button>
            <span className="text-xs text-nordic/60">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-nordic bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </footer>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#152e2a] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-dropdown border border-nordic/10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-nordic/10">
              <div className="flex items-center gap-2.5">
                <span className="material-icons text-primary text-2xl">
                  person_add
                </span>
                <h3 className="text-lg font-bold text-nordic dark:text-white">
                  Add Directory User
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-nordic/40 hover:text-nordic transition-colors p-1 rounded-lg"
              >
                <span className="material-icons text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-nordic/60 dark:text-gray-400 mb-1.5">
                  Email Address
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
                  System Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-nordic/15 bg-background-light dark:bg-gray-800 text-nordic dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all cursor-pointer"
                >
                  <option value="agent">Agent (Real Estate Specialist)</option>
                  <option value="admin">Administrator (Full Control)</option>
                  <option value="user">Viewer (Client / Read-only)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-nordic/10">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-nordic/70 hover:text-nordic transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPendingAssign}
                  className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-medium shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isPendingAssign ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

