"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/property";
import { UserRole, UserRoleRow } from "@/types/database.types";
import { updateUserRoleAction, assignRoleByEmailAction } from "@/app/actions/roles";
import { setPropertyFeaturedAction } from "@/app/actions/properties";

interface AdminDashboardProps {
  initialProperties: Property[];
  initialUsers: UserRoleRow[];
  currentUserId: string | null;
  currentUserEmail: string | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialProperties,
  initialUsers,
  currentUserId,
  currentUserEmail,
}) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<"properties" | "roles" | "sql">(
    "properties"
  );

  // Properties state & filters
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [propSearch, setPropSearch] = useState("");
  const [propCategory, setPropCategory] = useState<string>("All");
  const [propType, setPropType] = useState<string>("All");
  const [propFeatured, setPropFeatured] = useState<string>("All");
  const [togglingPropertyId, setTogglingPropertyId] = useState<string | null>(
    null
  );

  // Users & roles state & filters
  const [users, setUsers] = useState<UserRoleRow[]>(initialUsers);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("All");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Assign role by email form state
  const [assignEmail, setAssignEmail] = useState("");
  const [assignRole, setAssignRole] = useState<UserRole>("agent");
  const [assignMessage, setAssignMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPendingAssign, startAssignTransition] = useTransition();

  // Notification toast
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // Toggle property featured status
  const handleToggleFeatured = async (
    propertyId: string,
    currentStatus: boolean
  ) => {
    setTogglingPropertyId(propertyId);
    const newStatus = !currentStatus;

    // Optimistic UI update
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, isFeatured: newStatus } : p
      )
    );

    try {
      await setPropertyFeaturedAction(propertyId, newStatus);
      showToast(
        "success",
        `Propiedad ${newStatus ? "marcada como destacada" : "removida de destacadas"}`
      );
    } catch {
      // Revert optimistic update
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, isFeatured: currentStatus } : p
        )
      );
      showToast("error", "Error al cambiar el estado de destacada.");
    } finally {
      setTogglingPropertyId(null);
    }
  };

  // Change user role
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingUserId(userId);
    try {
      const result = await updateUserRoleAction(userId, newRole);
      if (result.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        showToast("success", `Rol actualizado exitosamente a "${newRole}".`);
      } else {
        showToast("error", result.error || "No se pudo actualizar el rol.");
      }
    } catch (err: any) {
      showToast("error", err?.message || "Error al actualizar rol.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Handle assign by email
  const handleAssignByEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignEmail.trim()) return;

    setAssignMessage(null);
    startAssignTransition(async () => {
      const res = await assignRoleByEmailAction(assignEmail, assignRole);
      if (res.success) {
        setAssignMessage({
          type: "success",
          text: `Rol asignado correctamente a ${assignEmail}.`,
        });
        setUsers((prev) =>
          prev.map((u) =>
            u.email?.toLowerCase() === assignEmail.trim().toLowerCase()
              ? { ...u, role: assignRole }
              : u
          )
        );
        setAssignEmail("");
      } else {
        setAssignMessage({
          type: "error",
          text: res.error || "Error al asignar rol.",
        });
      }
    });
  };

  // Properties Filtering
  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      propSearch.trim() === "" ||
      p.title.toLowerCase().includes(propSearch.toLowerCase()) ||
      p.location.toLowerCase().includes(propSearch.toLowerCase());

    const matchesCategory =
      propCategory === "All" ||
      p.category.toLowerCase() === propCategory.toLowerCase();

    const matchesType =
      propType === "All" ||
      (propType === "sale" && p.type === "sale") ||
      (propType === "rent" && p.type === "rent");

    const matchesFeatured =
      propFeatured === "All" ||
      (propFeatured === "featured" && p.isFeatured) ||
      (propFeatured === "standard" && !p.isFeatured);

    return matchesSearch && matchesCategory && matchesType && matchesFeatured;
  });

  // Users Filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      userSearch.trim() === "" ||
      (u.email || "").toLowerCase().includes(userSearch.toLowerCase()) ||
      u.id.toLowerCase().includes(userSearch.toLowerCase());

    const matchesRole =
      userRoleFilter === "All" || u.role === userRoleFilter;

    return matchesSearch && matchesRole;
  });

  // Properties Stats
  const totalPropertiesCount = properties.length;
  const forSaleCount = properties.filter((p) => p.type === "sale").length;
  const forRentCount = properties.filter((p) => p.type === "rent").length;
  const featuredCount = properties.filter((p) => p.isFeatured).length;
  const avgPrice =
    totalPropertiesCount > 0
      ? Math.round(
          properties.reduce((acc, curr) => acc + (curr.price || 0), 0) /
            totalPropertiesCount
        )
      : 0;

  // Users Stats
  const totalUsersCount = users.length;
  const adminUsersCount = users.filter((u) => u.role === "admin").length;
  const agentUsersCount = users.filter((u) => u.role === "agent").length;
  const regularUsersCount = users.filter((u) => u.role === "user").length;

  // Copy SQL script helper
  const [copiedSql, setCopiedSql] = useState(false);
  const sqlScript = `-- 1. Tabla de roles vinculada a auth.users
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'agent', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Función auxiliar para verificar si es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE id = auth.uid() AND role = 'admin');
$$;

-- 4. Políticas de Seguridad RLS
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all user roles" ON public.user_roles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update user roles" ON public.user_roles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can insert user roles" ON public.user_roles FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() = id);

-- 5. Trigger automático al registrarse un nuevo usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Asignar rol inicial de admin a tu cuenta (reemplaza con tu correo):
-- UPDATE public.user_roles SET role = 'admin' WHERE email = 'tu_correo@ejemplo.com';`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toast.type === "success"
              ? "bg-white text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800"
              : "bg-white text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800"
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-mosque/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mosque/10 text-mosque text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-mosque animate-ping" />
            Panel de Control Central
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-nordic tracking-tight">
            Dashboard Administrativo
          </h1>
          <p className="text-sm text-nordic/60 mt-1 max-w-xl">
            Monitorea el inventario de propiedades exclusivas y gestiona los roles de acceso (RBAC) de los usuarios autenticados.
          </p>
        </div>

        {/* Current Admin Identity */}
        <div className="bg-[#EEF6F6] rounded-xl p-4 border border-mosque/15 flex items-center gap-3 self-start md:self-auto">
          <div className="w-10 h-10 rounded-full bg-mosque text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {currentUserEmail?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-nordic truncate max-w-[160px]">
                {currentUserEmail || "Administrador"}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-mosque text-white">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-nordic/60">Sesión autenticada</p>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-mosque/15 gap-2 sm:gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("properties")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "properties"
              ? "border-mosque text-mosque bg-mosque/5 rounded-t-lg"
              : "border-transparent text-nordic/60 hover:text-nordic hover:border-nordic/30"
          }`}
        >
          <span className="material-symbols-outlined text-lg">apartment</span>
          <span>Propiedades Actuales</span>
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-mosque/10 text-mosque font-bold">
            {totalPropertiesCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("roles")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "roles"
              ? "border-mosque text-mosque bg-mosque/5 rounded-t-lg"
              : "border-transparent text-nordic/60 hover:text-nordic hover:border-nordic/30"
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            manage_accounts
          </span>
          <span>Gestión de Roles de Usuarios</span>
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-mosque/10 text-mosque font-bold">
            {totalUsersCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("sql")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "sql"
              ? "border-mosque text-mosque bg-mosque/5 rounded-t-lg"
              : "border-transparent text-nordic/60 hover:text-nordic hover:border-nordic/30"
          }`}
        >
          <span className="material-symbols-outlined text-lg">terminal</span>
          <span>Esquema SQL & Migración</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: GESTIÓN DE PROPIEDADES                                  */}
      {/* ============================================================== */}
      {activeTab === "properties" && (
        <div className="space-y-6">
          {/* Properties Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-mosque/10 shadow-xs">
              <span className="text-xs font-medium text-nordic/60">Total</span>
              <p className="text-2xl font-bold text-nordic mt-1">
                {totalPropertiesCount}
              </p>
              <span className="text-[11px] text-mosque font-medium">
                Inmuebles listados
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-mosque/10 shadow-xs">
              <span className="text-xs font-medium text-nordic/60">En Venta</span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">
                {forSaleCount}
              </p>
              <span className="text-[11px] text-nordic/50">Disponibles</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-mosque/10 shadow-xs">
              <span className="text-xs font-medium text-nordic/60">En Renta</span>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {forRentCount}
              </p>
              <span className="text-[11px] text-nordic/50">Mensuales</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-mosque/10 shadow-xs">
              <span className="text-xs font-medium text-nordic/60">Destacadas</span>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {featuredCount}
              </p>
              <span className="text-[11px] text-amber-600 font-medium">
                En Home Hero
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-mosque/10 shadow-xs col-span-2 sm:col-span-1">
              <span className="text-xs font-medium text-nordic/60">
                Precio Promedio
              </span>
              <p className="text-2xl font-bold text-nordic mt-1 truncate">
                ${(avgPrice / 1000).toLocaleString("en-US", { maximumFractionDigits: 0 })}k
              </p>
              <span className="text-[11px] text-nordic/50">USD Global</span>
            </div>
          </div>

          {/* Properties Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-mosque/10 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-nordic/40 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar por título o ubicación..."
                value={propSearch}
                onChange={(e) => setPropSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#F4F9F9] border border-mosque/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-mosque/30"
              />
              {propSearch && (
                <button
                  onClick={() => setPropSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-nordic/40 hover:text-nordic text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Type Filter */}
              <select
                value={propType}
                onChange={(e) => setPropType(e.target.value)}
                className="text-xs sm:text-sm bg-[#F4F9F9] border border-mosque/15 rounded-lg px-3 py-2 text-nordic focus:outline-none focus:ring-2 focus:ring-mosque/30 cursor-pointer"
              >
                <option value="All">Tipo: Todos</option>
                <option value="sale">En Venta</option>
                <option value="rent">En Renta</option>
              </select>

              {/* Category Filter */}
              <select
                value={propCategory}
                onChange={(e) => setPropCategory(e.target.value)}
                className="text-xs sm:text-sm bg-[#F4F9F9] border border-mosque/15 rounded-lg px-3 py-2 text-nordic focus:outline-none focus:ring-2 focus:ring-mosque/30 cursor-pointer"
              >
                <option value="All">Categoría: Todas</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
              </select>

              {/* Featured Filter */}
              <select
                value={propFeatured}
                onChange={(e) => setPropFeatured(e.target.value)}
                className="text-xs sm:text-sm bg-[#F4F9F9] border border-mosque/15 rounded-lg px-3 py-2 text-nordic focus:outline-none focus:ring-2 focus:ring-mosque/30 cursor-pointer"
              >
                <option value="All">Destacadas: Todas</option>
                <option value="featured">Solo Destacadas</option>
                <option value="standard">No Destacadas</option>
              </select>
            </div>
          </div>

          {/* Properties Table */}
          <div className="bg-white rounded-xl border border-mosque/10 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-mosque/10 bg-[#EEF6F6]/60 text-xs font-semibold text-nordic/70 uppercase tracking-wider">
                    <th className="py-3 px-4">Propiedad</th>
                    <th className="py-3 px-4">Precio</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Espacios</th>
                    <th className="py-3 px-4 text-center">Destacada</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mosque/10 text-sm">
                  {filteredProperties.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-nordic/50">
                        <span className="material-symbols-outlined text-3xl mb-2">
                          search_off
                        </span>
                        <p>No se encontraron propiedades con los filtros seleccionados.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProperties.map((property) => {
                      const mainImage =
                        property.imageUrl ||
                        property.images?.[0] ||
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400";

                      const isToggling = togglingPropertyId === property.id;

                      return (
                        <tr
                          key={property.id}
                          className="hover:bg-mosque/5 transition-colors group"
                        >
                          {/* Property Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-nordic/5 flex-shrink-0 border border-mosque/10">
                                <Image
                                  src={mainImage}
                                  alt={property.title}
                                  fill
                                  sizes="56px"
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="min-w-0 max-w-xs">
                                <Link
                                  href={`/propiedades/${property.slug}`}
                                  className="font-semibold text-nordic hover:text-mosque truncate block transition-colors"
                                  title={property.title}
                                >
                                  {property.title}
                                </Link>
                                <p className="text-xs text-nordic/50 truncate flex items-center gap-1 mt-0.5">
                                  <span className="material-symbols-outlined text-xs">
                                    location_on
                                  </span>
                                  <span>{property.location}</span>
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4 font-semibold text-nordic whitespace-nowrap">
                            {property.formattedPrice || `$${property.price.toLocaleString()}`}
                            {property.priceSuffix && (
                              <span className="text-xs text-nordic/50 font-normal">
                                {property.priceSuffix}
                              </span>
                            )}
                          </td>

                          {/* Category Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-nordic/5 text-nordic border border-nordic/10">
                              {property.category}
                            </span>
                          </td>

                          {/* Type Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                property.type === "sale"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}
                            >
                              {property.type === "sale" ? "Venta" : "Renta"}
                            </span>
                          </td>

                          {/* Beds, Baths, Sqm */}
                          <td className="py-3.5 px-4 text-xs text-nordic/70 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span>{property.beds} hab</span>
                              <span>•</span>
                              <span>{property.baths} ba</span>
                              <span>•</span>
                              <span>{property.sqm} m²</span>
                            </div>
                          </td>

                          {/* Featured Toggle Switch */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleFeatured(
                                  property.id,
                                  !!property.isFeatured
                                )
                              }
                              disabled={isToggling}
                              title="Alternar estado destacado"
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-mosque/30 ${
                                property.isFeatured
                                  ? "bg-mosque"
                                  : "bg-gray-300"
                              } ${isToggling ? "opacity-50 pointer-events-none" : ""}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  property.isFeatured
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <Link
                              href={`/propiedades/${property.slug}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-mosque hover:text-mosque-light px-2.5 py-1.5 rounded-lg hover:bg-mosque/10 transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">
                                open_in_new
                              </span>
                              <span>Ver</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="py-3 px-4 bg-[#EEF6F6]/40 border-t border-mosque/10 text-xs text-nordic/60 flex items-center justify-between">
              <span>
                Mostrando {filteredProperties.length} de {properties.length} propiedades
              </span>
              <span className="italic">
                Los cambios en el switch &quot;Destacada&quot; se aplican en tiempo real.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: GESTIÓN DE ROLES DE USUARIOS                            */}
      {/* ============================================================== */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          {/* Roles Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-mosque/10 shadow-xs">
              <span className="text-xs font-medium text-nordic/60">
                Usuarios Registrados
              </span>
              <p className="text-2xl font-bold text-nordic mt-1">
                {totalUsersCount}
              </p>
              <span className="text-[11px] text-mosque font-medium">
                En tabla user_roles
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200/60 shadow-xs">
              <span className="text-xs font-medium text-emerald-800">
                Administradores
              </span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">
                {adminUsersCount}
              </p>
              <span className="text-[11px] text-emerald-600">Acceso Total</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-200/60 shadow-xs">
              <span className="text-xs font-medium text-blue-800">Agentes</span>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {agentUsersCount}
              </p>
              <span className="text-[11px] text-blue-600">Gestión de Inmuebles</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-xs font-medium text-nordic/60">
                Usuarios / Clientes
              </span>
              <p className="text-2xl font-bold text-nordic/80 mt-1">
                {regularUsersCount}
              </p>
              <span className="text-[11px] text-nordic/50">Permisos Estándar</span>
            </div>
          </div>

          {/* Quick Assign Role Form */}
          <div className="bg-white p-5 rounded-xl border border-mosque/10 shadow-xs">
            <h3 className="text-sm font-bold text-nordic flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-mosque text-lg">
                person_add
              </span>
              <span>Asignar o Cambiar Rol por Correo Electrónico</span>
            </h3>

            {assignMessage && (
              <div
                className={`mb-3 p-3 rounded-lg text-xs leading-relaxed ${
                  assignMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {assignMessage.text}
              </div>
            )}

            <form
              onSubmit={handleAssignByEmail}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <input
                type="email"
                required
                placeholder="correo-usuario@ejemplo.com"
                value={assignEmail}
                onChange={(e) => setAssignEmail(e.target.value)}
                className="flex-1 px-3.5 py-2 text-sm bg-[#F4F9F9] border border-mosque/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-mosque/30"
              />

              <select
                value={assignRole}
                onChange={(e) => setAssignRole(e.target.value as UserRole)}
                className="px-3.5 py-2 text-sm bg-[#F4F9F9] border border-mosque/15 rounded-lg text-nordic focus:outline-none focus:ring-2 focus:ring-mosque/30 cursor-pointer"
              >
                <option value="admin">Administrador (admin)</option>
                <option value="agent">Agente (agent)</option>
                <option value="user">Usuario Estándar (user)</option>
              </select>

              <button
                type="submit"
                disabled={isPendingAssign}
                className="px-5 py-2 rounded-lg bg-mosque hover:bg-mosque-light text-white text-sm font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isPendingAssign ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">
                      check
                    </span>
                    <span>Actualizar Rol</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* User List & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-mosque/10 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-nordic/40 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar por correo o ID..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#F4F9F9] border border-mosque/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-mosque/30"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-nordic/60 whitespace-nowrap">
                Filtrar Rol:
              </span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="text-xs sm:text-sm bg-[#F4F9F9] border border-mosque/15 rounded-lg px-3 py-2 text-nordic focus:outline-none focus:ring-2 focus:ring-mosque/30 cursor-pointer"
              >
                <option value="All">Todos los roles</option>
                <option value="admin">Solo Administradores</option>
                <option value="agent">Solo Agentes</option>
                <option value="user">Solo Usuarios</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-mosque/10 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-mosque/10 bg-[#EEF6F6]/60 text-xs font-semibold text-nordic/70 uppercase tracking-wider">
                    <th className="py-3 px-4">Usuario</th>
                    <th className="py-3 px-4">User ID (UUID)</th>
                    <th className="py-3 px-4">Rol Actual</th>
                    <th className="py-3 px-4">Modificar Rol</th>
                    <th className="py-3 px-4 text-right">Registrado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mosque/10 text-sm">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-nordic/50">
                        <span className="material-symbols-outlined text-3xl mb-2">
                          person_off
                        </span>
                        <p>No se encontraron usuarios en la tabla user_roles.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isUpdating = updatingUserId === u.id;
                      const isCurrent = u.id === currentUserId;

                      return (
                        <tr
                          key={u.id}
                          className="hover:bg-mosque/5 transition-colors"
                        >
                          {/* User Avatar & Email */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-mosque/10 border border-mosque/20 flex items-center justify-center font-bold text-mosque text-sm flex-shrink-0">
                                {u.email?.charAt(0).toUpperCase() || "U"}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-nordic truncate">
                                    {u.email || "Sin correo"}
                                  </span>
                                  {isCurrent && (
                                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-mosque/15 text-mosque">
                                      TÚ
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* UUID */}
                          <td className="py-3.5 px-4 font-mono text-xs text-nordic/60">
                            <span
                              title={u.id}
                              className="cursor-pointer hover:text-mosque"
                              onClick={() => {
                                navigator.clipboard.writeText(u.id);
                                showToast("success", "ID copiado al portapapeles");
                              }}
                            >
                              {u.id.slice(0, 8)}...{u.id.slice(-4)}
                            </span>
                          </td>

                          {/* Current Role Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {u.role === "admin" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <span className="material-symbols-outlined text-xs">
                                  verified_user
                                </span>
                                Administrador
                              </span>
                            ) : u.role === "agent" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                                <span className="material-symbols-outlined text-xs">
                                  real_estate_agent
                                </span>
                                Agente
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                <span className="material-symbols-outlined text-xs">
                                  person
                                </span>
                                Usuario
                              </span>
                            )}
                          </td>

                          {/* Role Selector Dropdown */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <select
                                value={u.role}
                                disabled={isUpdating}
                                onChange={(e) =>
                                  handleRoleChange(
                                    u.id,
                                    e.target.value as UserRole
                                  )
                                }
                                className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-mosque/20 bg-white shadow-2xs focus:outline-none focus:ring-2 focus:ring-mosque/30 cursor-pointer ${
                                  isUpdating ? "opacity-50 pointer-events-none" : ""
                                }`}
                              >
                                <option value="admin">Administrador (admin)</option>
                                <option value="agent">Agente (agent)</option>
                                <option value="user">Usuario (user)</option>
                              </select>

                              {isUpdating && (
                                <span className="w-3.5 h-3.5 border-2 border-mosque border-t-transparent rounded-full animate-spin" />
                              )}
                            </div>
                          </td>

                          {/* Created Date */}
                          <td className="py-3.5 px-4 text-right text-xs text-nordic/50 whitespace-nowrap font-mono">
                            {u.created_at
                              ? new Date(u.created_at).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="py-3 px-4 bg-[#EEF6F6]/40 border-t border-mosque/10 text-xs text-nordic/60 flex items-center justify-between">
              <span>
                Mostrando {filteredUsers.length} de {users.length} usuarios
              </span>
              <span className="italic">
                Cualquier cambio de rol actualiza la tabla de base de datos `public.user_roles` al instante.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: ESQUEMA SQL & MIGRACIÓN                                 */}
      {/* ============================================================== */}
      {activeTab === "sql" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-mosque/10 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-nordic flex items-center gap-2">
                  <span className="material-symbols-outlined text-mosque">
                    database
                  </span>
                  <span>Script de Migración SQL para Supabase</span>
                </h2>
                <p className="text-xs text-nordic/60 mt-0.5">
                  Ejecuta este script en el <strong>SQL Editor</strong> de tu proyecto Supabase para crear la tabla <code className="bg-nordic/5 px-1 py-0.5 rounded font-mono text-mosque">user_roles</code>, configurar las políticas RLS y el trigger automático.
                </p>
              </div>

              <button
                onClick={handleCopySql}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-mosque text-white text-xs font-semibold hover:bg-mosque-light transition-all shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-sm">
                  {copiedSql ? "done" : "content_copy"}
                </span>
                <span>{copiedSql ? "¡Copiado!" : "Copiar SQL"}</span>
              </button>
            </div>

            {/* Code Block */}
            <div className="relative rounded-xl overflow-hidden bg-nordic text-gray-200 p-4 font-mono text-xs overflow-x-auto max-h-[500px]">
              <pre>{sqlScript}</pre>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
              <p className="font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">info</span>
                <span>Instrucciones rápidas:</span>
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-amber-800">
                <li>Abre el panel de control de Supabase en tu navegador.</li>
                <li>Ve a la sección <strong>SQL Editor</strong> en el menú lateral.</li>
                <li>Pega el código anterior y pulsa <strong>Run</strong>.</li>
                <li>
                  Para hacer que tu usuario sea administrador de inmediato, ejecuta: <br />
                  <code className="font-bold bg-amber-100 px-1 py-0.5 rounded">
                    UPDATE public.user_roles SET role = &apos;admin&apos; WHERE email = &apos;{currentUserEmail || "tu_correo@ejemplo.com"}&apos;;
                  </code>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

