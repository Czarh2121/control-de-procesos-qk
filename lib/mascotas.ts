import { createClient } from "@/lib/supabase/client"

export type MascotaEstado = "en_proceso" | "lista"

export interface Mascota {
  id: string
  nombreMascota: string
  nombreDueno: string
  telefono?: string
  servicio: string
  estado: MascotaEstado
  creadoEn: string
  inicioServicio: string
  finServicio?: string
  realizadoPor?: string
  notas?: string
}

/* ---------- helpers ---------- */

// Map DB row (snake_case) → app Mascota (camelCase)
function rowToMascota(row: Record<string, unknown>): Mascota {
  return {
    id: row.id as string,
    nombreMascota: row.nombre_mascota as string,
    nombreDueno: row.nombre_dueno as string,
    telefono: (row.telefono as string) || undefined,
    servicio: row.servicio as string,
    estado: row.estado as MascotaEstado,
    creadoEn: row.creado_en as string,
    inicioServicio: row.inicio_servicio as string,
    finServicio: (row.fin_servicio as string) || undefined,
    realizadoPor: (row.realizado_por as string) || undefined,
    notas: (row.notas as string) || undefined,
  }
}

/* ---------- CRUD ---------- */

export async function getMascotas(): Promise<Mascota[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("mascotas")
    .select("*")
    .order("creado_en", { ascending: false })

  if (error) {
    console.error("Error fetching mascotas:", error.message)
    return []
  }
  return (data ?? []).map(rowToMascota)
}

export async function getMascotasByEstado(estados: MascotaEstado[]): Promise<Mascota[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("mascotas")
    .select("*")
    .in("estado", estados)
    .order("creado_en", { ascending: false })

  if (error) {
    console.error("Error fetching mascotas by estado:", error.message)
    return []
  }
  return (data ?? []).map(rowToMascota)
}

export async function addMascota(
  mascotaData: Pick<
    Mascota,
    | "nombreMascota"
    | "nombreDueno"
    | "telefono"
    | "servicio"
    | "realizadoPor"
    | "notas"
  >
): Promise<Mascota> {
  const supabase = createClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("mascotas")
    .insert({
      nombre_mascota: mascotaData.nombreMascota,
      nombre_dueno: mascotaData.nombreDueno,
      telefono: mascotaData.telefono || null,
      servicio: mascotaData.servicio,
      estado: "en_proceso",
      creado_en: now,
      inicio_servicio: now,
      realizado_por: mascotaData.realizadoPor || null,
      notas: mascotaData.notas || null,
    })
    .select()
    .single()

  if (error) throw new Error(`Error creating mascota: ${error.message}`)
  return rowToMascota(data)
}

export async function updateMascota(
  id: string,
  updates: Partial<Omit<Mascota, "id">>
): Promise<Mascota | null> {
  const supabase = createClient()

  // Map camelCase updates → snake_case for DB
  const dbUpdates: Record<string, unknown> = {}
  if (updates.nombreMascota !== undefined) dbUpdates.nombre_mascota = updates.nombreMascota
  if (updates.nombreDueno !== undefined) dbUpdates.nombre_dueno = updates.nombreDueno
  if (updates.telefono !== undefined) dbUpdates.telefono = updates.telefono
  if (updates.servicio !== undefined) dbUpdates.servicio = updates.servicio
  if (updates.estado !== undefined) dbUpdates.estado = updates.estado
  if (updates.inicioServicio !== undefined) dbUpdates.inicio_servicio = updates.inicioServicio
  if (updates.finServicio !== undefined) dbUpdates.fin_servicio = updates.finServicio
  if (updates.realizadoPor !== undefined) dbUpdates.realizado_por = updates.realizadoPor
  if (updates.notas !== undefined) dbUpdates.notas = updates.notas

  const { data, error } = await supabase
    .from("mascotas")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating mascota:", error.message)
    return null
  }
  return rowToMascota(data)
}

export async function marcarMascotaLista(id: string): Promise<Mascota | null> {
  return updateMascota(id, {
    estado: "lista",
    finServicio: new Date().toISOString(),
  })
}

export async function deleteMascota(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from("mascotas").delete().eq("id", id)
  if (error) {
    console.error("Error deleting mascota:", error.message)
    return false
  }
  return true
}
