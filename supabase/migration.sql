-- ============================================================
-- EscuelaNet - Migración inicial
-- Ejecutar en: Supabase SQL Editor
-- ============================================================

-- Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('admin','docente','estudiante','preceptor','directivo','tutor')),
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  dni TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  curso TEXT NOT NULL,
  turno TEXT NOT NULL CHECK (turno IN ('mañana','tarde')),
  fecha_nacimiento TEXT,
  activo BOOLEAN DEFAULT true,
  photo TEXT,
  tutor TEXT,
  telefono_tutor TEXT,
  direccion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Docentes
CREATE TABLE IF NOT EXISTS docentes (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  dni TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  materias TEXT[] DEFAULT '{}',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cursos
CREATE TABLE IF NOT EXISTS cursos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  division TEXT NOT NULL,
  turno TEXT NOT NULL CHECK (turno IN ('mañana','tarde')),
  nivel TEXT NOT NULL,
  docente_id TEXT,
  estudiantes_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Materias
CREATE TABLE IF NOT EXISTS materias (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  curso_id TEXT NOT NULL,
  docente_id TEXT NOT NULL,
  horas_semanal INTEGER DEFAULT 0,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calificaciones
CREATE TABLE IF NOT EXISTS calificaciones (
  id TEXT PRIMARY KEY,
  estudiante_id TEXT NOT NULL,
  materia_id TEXT NOT NULL,
  nota NUMERIC NOT NULL,
  tipo TEXT NOT NULL,
  fecha TEXT NOT NULL,
  trimestre INTEGER NOT NULL CHECK (trimestre IN (1,2,3)),
  descripcion TEXT,
  docente_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asistencias
CREATE TABLE IF NOT EXISTS asistencias (
  id TEXT PRIMARY KEY,
  estudiante_id TEXT NOT NULL,
  curso_id TEXT NOT NULL,
  fecha TEXT NOT NULL,
  presente BOOLEAN NOT NULL,
  justificada BOOLEAN,
  observacion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disciplina
CREATE TABLE IF NOT EXISTS disciplina (
  id TEXT PRIMARY KEY,
  estudiante_id TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('observacion','apercibimiento','suspension','felicitacion')),
  descripcion TEXT NOT NULL,
  fecha TEXT NOT NULL,
  docente_id TEXT,
  preceptor_id TEXT,
  resuelto BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eventos
CREATE TABLE IF NOT EXISTS eventos (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha TEXT NOT NULL,
  fecha_fin TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('examen','reunion','feriado','actividad','entrega')),
  curso_id TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Actividades
CREATE TABLE IF NOT EXISTS actividades (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  materia_id TEXT NOT NULL,
  docente_id TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('tarea','material','actividad')),
  fecha_entrega TEXT,
  fecha_publicacion TEXT NOT NULL,
  archivo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  attachments TEXT[] DEFAULT '{}',
  created_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('published','draft','archived'))
);

-- App users (system accounts)
CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  linked_profile_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TEXT NOT NULL
);

-- Learning cores (núcleos de aprendizaje)
CREATE TABLE IF NOT EXISTS learning_cores (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  period TEXT NOT NULL CHECK (period IN ('Primer cuatrimestre','Segundo cuatrimestre','Anual')),
  "order" INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluations
CREATE TABLE IF NOT EXISTS evaluations (
  id TEXT PRIMARY KEY,
  learning_core_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Evaluación','Recuperatorio 1','Recuperatorio 2')),
  status TEXT NOT NULL CHECK (status IN ('Programada','Realizada','Cancelada')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluation grades
CREATE TABLE IF NOT EXISTS evaluation_grades (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  learning_core_id TEXT NOT NULL,
  evaluation_id TEXT NOT NULL,
  instance_type TEXT NOT NULL CHECK (instance_type IN ('evaluacion_principal','recuperatorio_1','recuperatorio_2')),
  grade NUMERIC NOT NULL,
  date TEXT NOT NULL,
  observation TEXT,
  teacher_id TEXT NOT NULL,
  visible_for_student BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Priority contents
CREATE TABLE IF NOT EXISTS priority_contents (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  school_year INTEGER NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('Primer cuatrimestre','Segundo cuatrimestre','Anual')),
  learning_core_id TEXT,
  title TEXT NOT NULL,
  "order" INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TEXT NOT NULL
);

-- Worked learnings
CREATE TABLE IF NOT EXISTS worked_learnings (
  id TEXT PRIMARY KEY,
  priority_content_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  description TEXT NOT NULL,
  "order" INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TEXT NOT NULL
);

-- Simple grades (evaluaciones 1-8)
CREATE TABLE IF NOT EXISTS simple_grades (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  school_year INTEGER NOT NULL,
  evaluation_number INTEGER NOT NULL CHECK (evaluation_number BETWEEN 1 AND 8),
  grade TEXT DEFAULT '',
  recovery_one_grade TEXT DEFAULT '',
  recovery_two_grade TEXT DEFAULT '',
  observation TEXT DEFAULT '',
  updated_at TEXT NOT NULL,
  UNIQUE(student_id, course_id, subject_id, school_year, evaluation_number)
);

-- ============================================================
-- Row Level Security (RLS) - habilitado para seguridad básica
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE docentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE materias ENABLE ROW LEVEL SECURITY;
ALTER TABLE calificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplina ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE actividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_cores ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE priority_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE worked_learnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE simple_grades ENABLE ROW LEVEL SECURITY;

-- Política: usuarios autenticados pueden leer y escribir todo
-- (en producción se refinan por rol)
CREATE POLICY "Authenticated full access" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON estudiantes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON docentes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON cursos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON materias FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON calificaciones FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON asistencias FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON disciplina FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON eventos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON actividades FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON app_users FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON learning_cores FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON evaluations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON evaluation_grades FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON priority_contents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON worked_learnings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON simple_grades FOR ALL TO authenticated USING (true) WITH CHECK (true);
