-- Agregar columnas a profiles para soporte de usuarios reales
-- Ejecutar en Supabase SQL Editor

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linked_profile_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Índice para búsqueda rápida por linked_profile_id
CREATE INDEX IF NOT EXISTS profiles_linked_profile_id_idx ON profiles(linked_profile_id);
CREATE INDEX IF NOT EXISTS profiles_rol_idx ON profiles(rol);
