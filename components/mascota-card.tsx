"use client"

import { type Mascota, type MascotaEstado } from "@/lib/mascotas"
import { useElapsedTime } from "@/hooks/use-mascotas"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  User,
  Phone,
  FileText,
  Timer,
  Scissors,
  CheckCircle2,
  Dog,
} from "lucide-react"

const estadoConfig: Record<
  MascotaEstado,
  {
    label: string
    borderColor: string
    bgColor: string
    badgeBg: string
    badgeText: string
  }
> = {
  en_proceso: {
    label: "En Proceso",
    borderColor: "border-teal-400",
    bgColor: "bg-teal-50",
    badgeBg: "bg-teal-500",
    badgeText: "text-white",
  },
  lista: {
    label: "Lista",
    borderColor: "border-emerald-400",
    bgColor: "bg-emerald-50",
    badgeBg: "bg-emerald-500",
    badgeText: "text-white",
  },
}

interface MascotaCardProps {
  mascota: Mascota
  actions?: React.ReactNode
}

export function MascotaCard({ mascota, actions }: MascotaCardProps) {
  const config = estadoConfig[mascota.estado]
  const elapsed = useElapsedTime(
    mascota.estado === "en_proceso" ? mascota.inicioServicio : undefined
  )

  return (
    <Card
      className={cn(
        "border-l-4 py-4 gap-3 transition-all",
        config.borderColor,
        config.bgColor
      )}
    >
      <CardContent className="flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dog className="size-5 text-teal-600" />
            <span className="text-lg font-bold text-foreground">
              {mascota.nombreMascota}
            </span>
            <Badge
              className={cn(
                "text-xs border-none",
                config.badgeBg,
                config.badgeText
              )}
            >
              {config.label}
            </Badge>
          </div>
        </div>

        {/* Service type */}
        <div className="flex items-center gap-1.5">
          <Scissors className="size-3.5 text-teal-600" />
          <span className="text-sm font-semibold text-teal-700">
            {mascota.servicio}
          </span>
        </div>

        {/* Info row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
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
          {mascota.realizadoPor && (
            <span className="flex items-center gap-1">
              <User className="size-3.5" />
              Por: {mascota.realizadoPor}
            </span>
          )}
          {mascota.notas && (
            <span className="flex items-center gap-1">
              <FileText className="size-3.5" />
              {mascota.notas}
            </span>
          )}
        </div>

        {/* Timer */}
        {mascota.estado === "en_proceso" && (
          <div className="flex items-center gap-2">
            <Timer className="size-4 text-muted-foreground" />
            <span className="font-mono text-base text-foreground">
              {elapsed}
            </span>
          </div>
        )}

        {/* Completed info for finished */}
        {mascota.estado === "lista" && mascota.finServicio && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
            <CheckCircle2 className="size-4" />
            Completado:{" "}
            {new Date(mascota.finServicio).toLocaleTimeString("es-MX", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}

        {/* Actions */}
        {actions && <div className="flex flex-wrap gap-2 pt-1">{actions}</div>}
      </CardContent>
    </Card>
  )
}
