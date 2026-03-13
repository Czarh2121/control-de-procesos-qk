"use client"

import { useState } from "react"
import Link from "next/link"
import { useMascotas, revalidateAllMascotas } from "@/hooks/use-mascotas"
import {
  marcarMascotaLista,
  updateMascota,
  deleteMascota,
} from "@/lib/mascotas"
import { MascotaCard } from "@/components/mascota-card"
import {
  MascotaFormDialog,
  EditMascotaDialog,
} from "@/components/mascota-form-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Plus,
  ArrowLeft,
  CheckCircle2,
  Pencil,
  ChevronDown,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import type { Mascota, MascotaEstado } from "@/lib/mascotas"

const FILTER_EN_PROCESO: MascotaEstado[] = ["en_proceso"]
const FILTER_LISTAS: MascotaEstado[] = ["lista"]

export default function EsteticaPage() {
  const { mascotas: enProceso } = useMascotas(FILTER_EN_PROCESO)
  const { mascotas: listas } = useMascotas(FILTER_LISTAS)
  const [formOpen, setFormOpen] = useState(false)
  const [editMascota, setEditMascota] = useState<Mascota | null>(null)
  const [historialOpen, setHistorialOpen] = useState(false)

  // Only show today's history
  const today = new Date().toDateString()
  const listasHoy = listas.filter(
    (m) => new Date(m.creadoEn).toDateString() === today
  )

  async function handleMarcarLista(mascota: Mascota) {
    await marcarMascotaLista(mascota.id)
    revalidateAllMascotas()
    toast.success(`${mascota.nombreMascota} esta lista para recoger`)
  }

  async function handleEditSave(realizadoPor: string, notas: string) {
    if (!editMascota) return
    await updateMascota(editMascota.id, {
      realizadoPor: realizadoPor || undefined,
      notas: notas || undefined,
    })
    revalidateAllMascotas()
    toast.success(`${editMascota.nombreMascota} actualizada`)
    setEditMascota(null)
  }

  async function handleDelete(id: string, nombreMascota: string) {
    await deleteMascota(id)
    revalidateAllMascotas()
    toast.success(`${nombreMascota} eliminada`)
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-teal-50 px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="size-9">
                <ArrowLeft className="size-4" />
                <span className="sr-only">Volver al inicio</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">Estetica</h1>
              {enProceso.length > 0 && (
                <Badge className="bg-teal-500 text-white border-none text-sm">
                  {enProceso.length}
                </Badge>
              )}
            </div>
          </div>
          <Button
            onClick={() => setFormOpen(true)}
            className="h-10 gap-2 bg-teal-600 text-white hover:bg-teal-700"
          >
            <Plus className="size-4" />
            Nueva Mascota
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
        {/* Active mascotas */}
        {enProceso.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
              <Plus className="size-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">
              No hay mascotas en proceso
            </p>
            <Button
              onClick={() => setFormOpen(true)}
              variant="outline"
              className="h-11 gap-2"
            >
              <Plus className="size-4" />
              Registrar primera mascota
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              En proceso ({enProceso.length})
            </h2>
            {enProceso.map((mascota) => (
              <MascotaCard
                key={mascota.id}
                mascota={mascota}
                actions={
                  <>
                    <Button
                      onClick={() => handleMarcarLista(mascota)}
                      className="h-11 flex-1 gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="size-4" />
                      Marcar Lista
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-11"
                      onClick={() => setEditMascota(mascota)}
                    >
                      <Pencil className="size-4" />
                      <span className="sr-only">Editar mascota</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-11 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() =>
                        handleDelete(mascota.id, mascota.nombreMascota)
                      }
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Eliminar mascota</span>
                    </Button>
                  </>
                }
              />
            ))}
          </div>
        )}

        {/* History */}
        {listasHoy.length > 0 && (
          <Collapsible open={historialOpen} onOpenChange={setHistorialOpen}>
            <CollapsibleTrigger asChild>
              <button className="flex w-full items-center justify-between rounded-lg border bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted">
                <span>
                  Listas hoy ({listasHoy.length})
                </span>
                <ChevronDown
                  className={`size-4 transition-transform ${historialOpen ? "rotate-180" : ""}`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-3 pt-3">
              {listasHoy.map((mascota) => (
                <MascotaCard key={mascota.id} mascota={mascota} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </main>

      {/* Dialogs */}
      <MascotaFormDialog open={formOpen} onOpenChange={setFormOpen} />

      {editMascota && (
        <EditMascotaDialog
          open={!!editMascota}
          onOpenChange={(open) => {
            if (!open) setEditMascota(null)
          }}
          initialRealizadoPor={editMascota.realizadoPor || ""}
          initialNotas={editMascota.notas || ""}
          title={`Editar ${editMascota.nombreMascota}`}
          onSave={handleEditSave}
        />
      )}
    </div>
  )
}
