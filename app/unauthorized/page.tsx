import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6 text-nordic">
      <div className="w-full max-w-md bg-surface dark:bg-[#152e2a] rounded-2xl shadow-xl border border-mosque/15 p-8 text-center backdrop-blur-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 mb-6">
          <span className="material-symbols-outlined text-4xl">
            lock_person
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-nordic dark:text-white mb-3">
          Acceso Restringido
        </h1>

        <p className="text-sm text-nordic/70 dark:text-gray-300 leading-relaxed mb-8">
          Esta sección está reservada exclusivamente para el equipo administrativo de Luxe Estate. Tu cuenta no cuenta con permisos de administrador actualmente.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-mosque hover:bg-mosque-light text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            <span>Volver al Inicio</span>
          </Link>

          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-mosque/20 hover:bg-mosque/5 text-nordic dark:text-gray-200 text-sm font-medium transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">sync_alt</span>
            <span>Iniciar Sesión con otra cuenta</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-mosque/10 text-xs text-nordic/50 dark:text-gray-400">
          ¿Crees que se trata de un error? Contacta con el superadministrador del sistema.
        </div>
      </div>
    </div>
  );
}

