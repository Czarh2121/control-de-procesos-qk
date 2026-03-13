"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addMascota } from "@/lib/mascotas"
import { revalidateAllMascotas } from "@/hooks/use-mascotas"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface MascotaFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SERVICIOS = [
  "Bano completo",
  "Corte de pelo",
  "Bano y corte",
  "Corte de unas",
  "Limpieza de oidos",
  "Bano medicado",
]

export function MascotaFormDialog({ open, onOpenChange }: MascotaFormDialogProps) {
  const [nombreMascota, setNombreMascota] = useState("")
  const [nombreDueno, setNombreDueno] = useState("")
  const [telefono, setTelefono] = useState("")
  const [servicio, setServicio] = useState("")
  const [realizadoPor, setRealizadoPor] = useState("")
  const [notas, setNotas] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!nombreMascota.trim()) {
      setError("El nombre de la mascota es obligatorio")
      return
    }
    if (!nombreDueno.trim()) {
      setError("El nombre del dueno es obligatorio")
      return
    }
    if (!servicio.trim()) {
      setError("Selecciona o escribe un servicio")
      return
    }

    setIsSubmitting(true)
    try {
      await addMascota({
        nombreMascota: nombreMascota.trim(),
        nombreDueno: nombreDueno.trim(),
        telefono: telefono.trim() || undefined,
        servicio: servicio.trim(),
        realizadoPor: realizadoPor.trim() || undefined,
        notas: notas.trim() || undefined,
      })
      revalidateAllMascotas()
      toast.success(`${nombreMascota.trim()} registrada`)

      // Reset form
      setNombreMascota("")
      setNombreDueno("")
      setTelefono("")
      setServicio("")
      setRealizadoPor("")
      setNotas("")
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar la mascota")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      setError("")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[90svh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Nueva Mascota</DialogTitle>
          <DialogDescription>
            Registra una mascota para el servicio de estetica
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-1">
          <form id="mascota-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombreMascota" className="text-sm">
                Nombre de la Mascota *
              </Label>
              <Input
                id="nombreMascota"
                placeholder="Ej: Firulais"
                value={nombreMascota}
                onChange={(e) => setNombreMascota(e.target.value)}
                autoFocus
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombreDueno" className="text-sm">
                Nombre del Dueno *
              </Label>
              <Input
                id="nombreDueno"
                placeholder="Ej: Juan Perez"
                value={nombreDueno}
                onChange={(e) => setNombreDueno(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="telefono" className="text-sm">
                Telefono (opcional)
              </Label>
              <Input
                id="telefono"
                placeholder="Ej: 55 1234 5678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="h-10"
              />
            </div>

            {/* Service type selector */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Servicio *</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {SERVICIOS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setServicio(s)}
                    className={`rounded-lg border-2 p-2 text-xs font-medium transition-colors ${
                      servicio === s
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-muted bg-background text-muted-foreground hover:border-muted-foreground/30"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Input
                placeholder="O escribe otro servicio..."
                value={SERVICIOS.includes(servicio) ? "" : servicio}
                onChange={(e) => setServicio(e.target.value)}
                className="h-10 mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="realizadoPor" className="text-sm">
                  Realizado por
                </Label>
                <Input
                  id="realizadoPor"
                  placeholder="Estilista"
                  value={realizadoPor}
                  onChange={(e) => setRealizadoPor(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="notas" className="text-sm">Notas</Label>
                <Input
                  id="notas"
                  placeholder="Opcional"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
          </form>
        </div>
        <DialogFooter className="flex-shrink-0 border-t pt-4 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="h-10"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="mascota-form"
            className="h-10 gap-2 bg-teal-600 hover:bg-teal-700" 
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            {isSubmitting ? "Registrando..." : "Registrar Mascota"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Edit dialog for updating mascota fields
interface EditMascotaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialRealizadoPor: string
  initialNotas: string
  title: string
  onSave: (realizadoPor: string, notas: string) => void
}

export function EditMascotaDialog({
  open,
  onOpenChange,
  initialRealizadoPor,
  initialNotas,
  title,
  onSave,
}: EditMascotaDialogProps) {
  const [realizadoPor, setRealizadoPor] = useState(initialRealizadoPor)
  const [notas, setNotas] = useState(initialNotas)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(realizadoPor.trim(), notas.trim())
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Modifica los datos de la mascota
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-realizadoPor">Realizado por</Label>
            <Input
              id="edit-realizadoPor"
              placeholder="Nombre del estilista"
              value={realizadoPor}
              onChange={(e) => setRealizadoPor(e.target.value)}
              autoFocus
              className="h-11 text-base"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-notas">Notas</Label>
            <Input
              id="edit-notas"
              placeholder="Detalles adicionales"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="h-11 text-base"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11"
            >
              Cancelar
            </Button>
            <Button type="submit" className="h-11 bg-teal-600 hover:bg-teal-700">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
