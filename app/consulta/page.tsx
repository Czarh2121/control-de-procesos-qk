"use client"

import { useState } from "react"
import { useMascotas } from "@/hooks/use-mascotas"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Mascota, MascotaEstado } from "@/lib/mascotas"
import {
  Search,
  CheckCircle2,
  Clock,
  Dog,
  Scissors,
  User,
  Phone,
} from "lucide-react"

function estadoLabel(estado: MascotaEstado): string {
  switch (estado) {
    case "en_proceso":
      return "En proceso"
    case "lista":
      return "Lista para recoger"
    default:
      return estado
  }
}

function ConsultaMascotaCard({ mascota }: { mascota: Mascota }) {
  const isLista = mascota.estado === "lista"

  return (
    <Card
      className={cn(
        "border-2 py-0 overflow-hidden",
        isLista ? "border-emerald-400" : "border-border"
      )}
    >
      {/* Status banner */}
      <div
        className={cn(
          "px-4 py-3 flex items-center justify-between",
          isLista
            ? "bg-emerald-500 text-white"
            : "bg-teal-100 text-teal-800"
        )}
      >
        <div className="flex items-center gap-2">
          <Dog className="size-5" />
          <span className="font-bold text-lg">
            {mascota.nombreMascota}
          </span>
        </div>
        <Badge
          className={cn(
            "text-sm border-none",
            isLista
              ? "bg-white/20 text-white"
              : "bg-teal-200 text-teal-800"
          )}
        >
          {estadoLabel(mascota.estado)}
        </Badge>
      </div>

      <CardContent className="flex flex-col gap-4 p-4">
        {/* Service */}
        <div className="flex items-center gap-2">
          <Scissors className="size-4 text-teal-600" />
          <span className="font-semibold text-foreground">
            {mascota.servicio}
          </span>
        </div>

        {/* Owner info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="size-3.5" />
            {mascota.nombreDueno}
          </span>
          {mascota.telefono && (
            <span className="flex items-center gap-1">
              <Phone className="size-3.5" />
              {mascota.telefono}
            </span>
          )}
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-0">
          {[
            { estado: "en_proceso" as MascotaEstado, label: "En proceso", icon: Scissors },
            { estado: "lista" as MascotaEstado, label: "Lista", icon: CheckCircle2 },
          ].map((paso, idx) => {
            const Icon = paso.icon
            const currentIdx = mascota.estado === "lista" ? 1 : 0
            const completed = idx <= currentIdx
            const isCurrent = idx === currentIdx
            return (
              <div
                key={paso.estado}
                className="flex flex-1 flex-col items-center gap-1.5"
              >
                <div className="flex w-full items-center">
                  {idx > 0 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1",
                        idx <= currentIdx ? "bg-emerald-400" : "bg-border"
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full transition-all",
                      completed &&
                        !isCurrent &&
                        "bg-emerald-100 text-emerald-600",
                      isCurrent &&
                        !isLista &&
                        "bg-teal-100 text-teal-600 ring-2 ring-teal-400",
                      isCurrent &&
                        isLista &&
                        "bg-emerald-500 text-white ring-2 ring-emerald-400",
                      !completed && "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  {idx < 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1",
                        idx < currentIdx ? "bg-emerald-400" : "bg-border"
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs text-center leading-tight",
                    isCurrent
                      ? "font-bold text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {paso.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Status info */}
        {!isLista && (
          <div className="flex items-center gap-2 rounded-lg bg-teal-50 border border-teal-200 px-4 py-3">
            <Clock className="size-5 text-teal-600" />
            <div>
              <p className="text-sm font-semibold text-teal-800">
                Tu mascota esta siendo atendida
              </p>
              <p className="text-xs text-teal-600">
                Te notificaremos cuando este lista
              </p>
            </div>
          </div>
        )}

        {/* Big message for finished */}
        {isLista && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-center">
            <p className="text-lg font-bold text-emerald-700">
              Tu mascota esta lista
            </p>
            <p className="text-sm text-emerald-600">
              Puedes pasar a recogerla
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function ConsultaPage() {
  const { mascotas: allMascotas } = useMascotas()
  const [busqueda, setBusqueda] = useState("")

  const query = busqueda.trim().toLowerCase()

  // Show all mascotas, filtered by search if query exists
  const resultados = query
    ? allMascotas.filter(
        (m) =>
          m.nombreMascota.toLowerCase().includes(query) ||
          m.nombreDueno.toLowerCase().includes(query) ||
          (m.telefono && m.telefono.includes(query))
      )
    : allMascotas

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-emerald-50 px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <h1 className="text-xl font-bold text-foreground">
            Consultar Mascota
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4">
        {/* Search bar */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="busqueda"
            className="text-sm font-medium text-muted-foreground"
          >
            Busca por nombre de mascota, dueno o telefono
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              id="busqueda"
              placeholder="Ej: Firulais o Juan Perez"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="h-14 pl-11 text-lg"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        {resultados.length > 0 ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {resultados.length} mascota{resultados.length !== 1 ? "s" : ""}
              {query ? " encontrada" : ""}
              {resultados.length !== 1 && query ? "s" : ""}
            </p>
            {resultados.map((mascota) => (
              <ConsultaMascotaCard key={mascota.id} mascota={mascota} />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
              <Search className="size-8 text-muted-foreground" />
            </div>
            <p className="text-foreground text-lg font-medium">
              {query
                ? "No se encontraron resultados"
                : "No hay mascotas registradas"}
            </p>
            <p className="text-muted-foreground text-sm">
              {query
                ? "Verifica el nombre de la mascota o el dueno"
                : "Las mascotas apareceran aqui cuando se registren"}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
