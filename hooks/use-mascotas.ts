"use client"

import useSWR, { mutate } from "swr"
import { useState, useEffect } from "react"
import { getMascotas, getMascotasByEstado, type MascotaEstado } from "@/lib/mascotas"

const POLL_MS = 5000

function keyForEstados(estados?: MascotaEstado[]) {
  return estados?.length
    ? `mascotas:${estados.sort().join(",")}`
    : "mascotas:all"
}

export function useMascotas(filterEstados?: MascotaEstado[]) {
  const key = keyForEstados(filterEstados)

  const { data, error, isLoading } = useSWR(
    key,
    () =>
      filterEstados?.length
        ? getMascotasByEstado(filterEstados)
        : getMascotas(),
    { refreshInterval: POLL_MS }
  )

  return {
    mascotas: data ?? [],
    isLoading,
    isError: !!error,
  }
}

export function revalidateAllMascotas() {
  // Revalidate all possible keys
  mutate((key) => typeof key === "string" && key.startsWith("mascotas:"), undefined, { revalidate: true })
}

// Hook for elapsed time display
export function useElapsedTime(startIso?: string) {
  const [elapsed, setElapsed] = useState("")

  useEffect(() => {
    if (!startIso) {
      setElapsed("")
      return
    }

    function update() {
      const start = new Date(startIso!).getTime()
      const diff = Date.now() - start
      const mins = Math.floor(diff / 60000)
      const secs = Math.floor((diff % 60000) / 1000)
      setElapsed(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`)
    }

    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [startIso])

  return elapsed
}
