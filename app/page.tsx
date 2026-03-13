import Link from "next/link"
import { Scissors, Search, Dog } from "lucide-react"

export default function HomePage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-lg flex-col items-center gap-8">
        {/* Logo / Icon */}
        <div className="flex items-center justify-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-teal-100">
            <Dog className="size-12 text-teal-600" />
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            Veterinaria Estetica
          </h1>
          <p className="text-muted-foreground text-base">
            Sistema de control para el servicio de estetica canina
          </p>
        </div>

        {/* Station buttons */}
        <div className="flex w-full flex-col gap-4">
          <Link
            href="/estetica"
            className="group flex items-center gap-4 rounded-xl border-2 border-teal-300 bg-teal-50 p-6 transition-all hover:border-teal-500 hover:bg-teal-100 hover:shadow-lg active:scale-[0.98]"
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-teal-500">
              <Scissors className="size-7 text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xl font-bold text-foreground">
                Estacion de Estetica
              </span>
              <span className="text-sm text-muted-foreground">
                Registrar mascotas y marcar cuando estan listas
              </span>
            </div>
          </Link>
        </div>

        {/* Separator */}
        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Para clientes</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Client lookup */}
        <Link
          href="/consulta"
          className="group flex w-full items-center gap-4 rounded-xl border-2 border-emerald-300 bg-emerald-50 p-6 transition-all hover:border-emerald-500 hover:bg-emerald-100 hover:shadow-lg active:scale-[0.98]"
        >
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-emerald-500">
            <Search className="size-7 text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold text-foreground">
              Consultar Mascota
            </span>
            <span className="text-sm text-muted-foreground">
              Revisa si tu mascota ya esta lista para recoger
            </span>
          </div>
        </Link>

        <p className="text-xs text-muted-foreground text-center">
          Tu mascota lucira increible
        </p>
      </div>
    </main>
  )
}
