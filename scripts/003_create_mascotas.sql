-- Crear tabla de mascotas para el servicio de estetica veterinaria
CREATE TABLE IF NOT EXISTS mascotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_mascota TEXT NOT NULL,
  nombre_dueno TEXT NOT NULL,
  telefono TEXT,
  servicio TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'en_proceso' CHECK (estado IN ('en_proceso', 'lista')),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  inicio_servicio TIMESTAMPTZ NOT NULL DEFAULT now(),
  fin_servicio TIMESTAMPTZ,
  realizado_por TEXT,
  notas TEXT
);

-- Indices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_mascotas_estado ON mascotas(estado);
CREATE INDEX IF NOT EXISTS idx_mascotas_creado_en ON mascotas(creado_en DESC);

-- Habilitar RLS (Row Level Security) - opcional para seguridad
-- ALTER TABLE mascotas ENABLE ROW LEVEL SECURITY;

-- Politica para permitir todas las operaciones (ajustar segun necesidades)
-- CREATE POLICY "Allow all operations" ON mascotas FOR ALL USING (true) WITH CHECK (true);
