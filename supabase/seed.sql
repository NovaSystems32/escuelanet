-- ============================================================
-- EscuelaNet - Seed de datos iniciales
-- Ejecutar en: Supabase SQL Editor, DESPUÉS de migration.sql
-- ============================================================

-- NOTA: Los usuarios de autenticación (auth.users) los tenés que
-- crear manualmente en: Authentication > Users > Add user
-- Emails y contraseñas:
--   admin@escuelanet.edu       / admin123
--   docente@escuelanet.edu     / docente123
--   estudiante@escuelanet.edu  / estudiante123
--   preceptor@escuelanet.edu   / preceptor123
-- Después de crearlos, corré el INSERT de profiles de abajo
-- reemplazando los UUIDs con los que te asignó Supabase.

-- ============================================================
-- Estudiantes
-- ============================================================
INSERT INTO estudiantes (id, nombre, apellido, dni, email, telefono, curso, turno, fecha_nacimiento, activo) VALUES
('e1', 'Lucas', 'Rodríguez', '45123456', 'lucas@mail.com', '11-4567-8901', 'c1', 'mañana', '2008-03-15', true),
('e2', 'Valentina', 'López', '45234567', 'valentina@mail.com', '11-4567-8902', 'c1', 'mañana', '2008-06-22', true),
('e3', 'Mateo', 'Fernández', '45345678', 'mateo@mail.com', '11-4567-8903', 'c1', 'mañana', '2008-01-10', true),
('e4', 'Sofía', 'Gómez', '45456789', 'sofia@mail.com', '11-4567-8904', 'c2', 'tarde', '2007-09-05', true),
('e5', 'Santiago', 'Martínez', '45567890', 'santiago@mail.com', '11-4567-8905', 'c2', 'tarde', '2007-11-18', true),
('e6', 'Camila', 'Torres', '45678901', 'camila@mail.com', '11-4567-8906', 'c3', 'mañana', '2006-04-30', true),
('e7', 'Benjamín', 'Díaz', '45789012', 'benjamin@mail.com', '11-4567-8907', 'c3', 'mañana', '2006-07-14', false),
('e8', 'Isabella', 'Pérez', '45890123', 'isabella@mail.com', '11-4567-8908', 'c2', 'tarde', '2007-02-28', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Docentes
-- ============================================================
INSERT INTO docentes (id, nombre, apellido, dni, email, telefono, materias, activo) VALUES
('d1', 'Carlos', 'García', '30123456', 'docente@escuelanet.edu', '11-5678-9012', ARRAY['m1','m3'], true),
('d2', 'María', 'González', '30234567', 'mgonzalez@escuelanet.edu', '11-5678-9013', ARRAY['m2','m5'], true),
('d3', 'Roberto', 'Silva', '30345678', 'rsilva@escuelanet.edu', '11-5678-9014', ARRAY['m4','m6'], true),
('d4', 'Ana', 'Ramírez', '30456789', 'aramirez@escuelanet.edu', '11-5678-9015', ARRAY['m7'], true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Cursos
-- ============================================================
INSERT INTO cursos (id, nombre, division, turno, nivel, docente_id, estudiantes_ids) VALUES
('c1', '1er Año', 'A', 'mañana', 'Secundario', 'd1', ARRAY['e1','e2','e3']),
('c2', '2do Año', 'B', 'tarde', 'Secundario', 'd2', ARRAY['e4','e5','e8']),
('c3', '3er Año', 'A', 'mañana', 'Secundario', 'd3', ARRAY['e6','e7'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Materias
-- ============================================================
INSERT INTO materias (id, nombre, curso_id, docente_id, horas_semanal, descripcion) VALUES
('m1', 'Matemática', 'c1', 'd1', 5, 'Álgebra, geometría y análisis matemático.'),
('m2', 'Lengua y Literatura', 'c1', 'd2', 4, 'Comprensión lectora, gramática y producción escrita.'),
('m3', 'Historia', 'c1', 'd1', 3, 'Historia argentina y mundial.'),
('m4', 'Biología', 'c2', 'd3', 4, 'Ciencias naturales y biología celular.'),
('m5', 'Inglés', 'c2', 'd2', 3, 'Inglés técnico y conversacional.'),
('m6', 'Física', 'c3', 'd3', 4, 'Mecánica, termodinámica y electromagnetismo.'),
('m7', 'Química', 'c3', 'd4', 4, 'Química orgánica e inorgánica.'),
('m8', 'Geografía', 'c2', 'd2', 3, 'Geografía física y humana.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Calificaciones
-- ============================================================
INSERT INTO calificaciones (id, estudiante_id, materia_id, nota, tipo, fecha, trimestre, descripcion, docente_id) VALUES
('cal1', 'e1', 'm1', 8, 'Evaluación', '2024-04-10', 1, 'Evaluación - Núcleo 1', 'd1'),
('cal2', 'e1', 'm1', 7, 'Trabajo práctico', '2024-04-25', 1, 'TP Álgebra', 'd1'),
('cal3', 'e1', 'm2', 9, 'Evaluación', '2024-04-12', 1, 'Evaluación - Núcleo 1 Lengua', 'd2'),
('cal4', 'e1', 'm3', 6, 'Evaluación oral', '2024-05-03', 1, 'Coloquio Historia', 'd1'),
('cal5', 'e1', 'm1', 9, 'Evaluación', '2024-06-15', 2, 'Evaluación - Núcleo 2', 'd1'),
('cal6', 'e1', 'm2', 8, 'Trabajo práctico', '2024-06-20', 2, 'TP Redacción', 'd2'),
('cal7', 'e2', 'm1', 10, 'Evaluación', '2024-04-10', 1, 'Evaluación - Núcleo 1', 'd1'),
('cal8', 'e2', 'm2', 8, 'Evaluación', '2024-04-12', 1, 'Evaluación - Núcleo 1 Lengua', 'd2'),
('cal9', 'e3', 'm1', 5, 'Evaluación', '2024-04-10', 1, 'Evaluación - Núcleo 1', 'd1'),
('cal10', 'e3', 'm2', 7, 'Evaluación', '2024-04-12', 1, 'Evaluación - Núcleo 1 Lengua', 'd2')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Asistencias
-- ============================================================
INSERT INTO asistencias (id, estudiante_id, curso_id, fecha, presente, justificada, observacion) VALUES
('a1', 'e1', 'c1', '2024-06-03', true, null, null),
('a2', 'e1', 'c1', '2024-06-04', false, false, 'Sin aviso'),
('a3', 'e1', 'c1', '2024-06-05', true, null, null),
('a4', 'e1', 'c1', '2024-06-06', false, true, 'Médico'),
('a5', 'e1', 'c1', '2024-06-07', true, null, null),
('a6', 'e1', 'c1', '2024-06-10', true, null, null),
('a7', 'e1', 'c1', '2024-06-11', false, false, null),
('a8', 'e1', 'c1', '2024-06-12', true, null, null),
('a9', 'e2', 'c1', '2024-06-03', true, null, null),
('a10', 'e2', 'c1', '2024-06-04', true, null, null),
('a11', 'e3', 'c1', '2024-06-03', false, false, null),
('a12', 'e3', 'c1', '2024-06-04', true, null, null)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Disciplina
-- ============================================================
INSERT INTO disciplina (id, estudiante_id, tipo, descripcion, fecha, docente_id, preceptor_id, resuelto) VALUES
('dis1', 'e1', 'observacion', 'Uso de celular en clase durante la explicación del docente.', '2024-05-15', 'd1', null, true),
('dis2', 'e1', 'felicitacion', 'Excelente participación en el proyecto de ciencias. Actitud positiva y colaborativa.', '2024-06-01', 'd2', null, false),
('dis3', 'e3', 'apercibimiento', 'Falta de respeto hacia un compañero. Se habló con los padres.', '2024-05-20', null, 'u4', true),
('dis4', 'e5', 'suspension', 'Reincidencia en comportamiento disruptivo. Suspensión de 2 días.', '2024-06-10', null, 'u4', false),
('dis5', 'e2', 'felicitacion', 'Primer puesto en olimpíada de matemática regional.', '2024-06-05', 'd1', null, false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Eventos
-- ============================================================
INSERT INTO eventos (id, titulo, descripcion, fecha, tipo, curso_id, color) VALUES
('ev1', 'Evaluación Matemática 1A', 'Evaluación de Matemática para 1er Año A - Núcleo 1', '2024-07-10', 'examen', 'c1', '#ef4444'),
('ev2', 'Reunión de Padres', 'Reunión general de padres y tutores', '2024-07-15', 'reunion', null, '#3b82f6'),
('ev3', 'Feriado Nacional', 'Día de la Independencia', '2024-07-09', 'feriado', null, '#6b7280'),
('ev4', 'Entrega TP Biología', 'Entrega de trabajo práctico de biología', '2024-07-08', 'entrega', 'c2', '#10b981'),
('ev5', 'Acto Escolar', 'Acto por el aniversario de la escuela', '2024-07-20', 'actividad', null, '#f59e0b'),
('ev6', 'Olimpíada de Matemática', 'Participación en olimpíada zonal', '2024-07-25', 'actividad', null, '#8b5cf6'),
('ev7', 'Evaluación Historia', 'Evaluación de Historia para 1er año - Núcleo 1', '2024-07-18', 'examen', 'c1', '#ef4444')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Actividades
-- ============================================================
INSERT INTO actividades (id, titulo, descripcion, materia_id, docente_id, tipo, fecha_entrega, fecha_publicacion) VALUES
('act1', 'TP: Ecuaciones de segundo grado', 'Resolver los ejercicios del 1 al 20 del apunte. Entregar el miércoles.', 'm1', 'd1', 'tarea', '2024-07-10', '2024-07-03'),
('act2', 'Material: Funciones cuadráticas', 'Material teórico sobre funciones cuadráticas. Leer antes de la próxima clase.', 'm1', 'd1', 'material', null, '2024-07-01'),
('act3', 'Análisis literario: El Aleph', 'Leer el cuento "El Aleph" de Borges y elaborar un análisis de 2 páginas.', 'm2', 'd2', 'tarea', '2024-07-12', '2024-07-02'),
('act4', 'Guía: Revolución Francesa', 'Responder la guía de preguntas sobre la Revolución Francesa.', 'm3', 'd1', 'tarea', '2024-07-08', '2024-06-28'),
('act5', 'Video: Mitosis y Meiosis', 'Ver el video explicativo y responder el cuestionario adjunto.', 'm4', 'd3', 'actividad', '2024-07-11', '2024-07-04'),
('act6', 'Vocabulary Unit 5', 'Practice vocabulary exercises from the textbook, pages 45-48.', 'm5', 'd2', 'tarea', '2024-07-09', '2024-07-03')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Posts
-- ============================================================
INSERT INTO posts (id, subject_id, course_id, teacher_id, title, content, images, created_at, status) VALUES
('p1', 'm1', 'c1', 'd1', 'TP de Funciones', 'Resuelvan los ejercicios 1 al 10 de la página 45 del libro. Entregar la semana que viene en la clase.', '{}', '2026-06-20', 'published'),
('p2', 'm1', 'c1', 'd1', 'Material: Derivadas e Integrales', 'Les comparto el apunte teórico sobre derivadas e integrales. Leer antes de la próxima clase para poder practicar ejercicios.', '{}', '2026-06-18', 'published'),
('p3', 'm1', 'c1', 'd1', 'Borrador: Evaluación integradora', 'Evaluación integradora del primer trimestre. Temas: funciones, derivadas, límites.', '{}', '2026-06-22', 'draft'),
('p4', 'm2', 'c1', 'd2', 'Análisis de "El Aleph"', 'Para la próxima clase: leer el cuento "El Aleph" de Borges y preparar un análisis sobre el símbolo del aleph como metáfora del universo.', '{}', '2026-06-19', 'published'),
('p5', 'm2', 'c1', 'd2', 'Gramática: Los tiempos verbales', 'Repaso de los tiempos verbales en el modo subjuntivo. Ejercicios de práctica en la guía adjunta.', '{}', '2026-06-17', 'published'),
('p6', 'm3', 'c1', 'd1', 'Revolución Francesa: Cronología', 'Hoy vimos la cronología de la Revolución Francesa. Les dejo un resumen de las etapas más importantes. Para la evaluación: estudiar causas, etapas y consecuencias.', '{}', '2026-06-15', 'published'),
('p7', 'm3', 'c1', 'd1', 'Fuentes primarias: Declaración de los Derechos del Hombre', 'Análisis de la Declaración de los Derechos del Hombre y del Ciudadano como fuente primaria histórica.', '{}', '2026-06-12', 'published'),
('p8', 'm4', 'c2', 'd3', 'Mitosis y Meiosis: Resumen', 'Resumen de los procesos de división celular. Incluye diagramas de las fases de la mitosis y meiosis.', '{}', '2026-06-20', 'published'),
('p9', 'm4', 'c2', 'd3', 'Trabajo Práctico: ADN y ARN', 'TP grupal sobre la estructura del ADN y ARN. Grupos de 3 personas. Entregar el viernes 26/06.', '{}', '2026-06-18', 'published'),
('p10', 'm5', 'c2', 'd2', 'Unit 5: Present Perfect', 'Practice exercises for Present Perfect tense. Complete pages 45-48 in your textbook before next class.', '{}', '2026-06-19', 'published'),
('p11', 'm5', 'c2', 'd2', 'Vocabulary Review: Technology', 'Review the vocabulary list from Unit 4 - Technology and Innovation. Quiz next Monday.', '{}', '2026-06-16', 'published'),
('p12', 'm6', 'c3', 'd3', 'Leyes de Newton: Problemas', 'Resolución de problemas aplicando las tres leyes de Newton. Deben resolver los ejercicios del 1 al 15.', '{}', '2026-06-20', 'published'),
('p13', 'm6', 'c3', 'd3', 'Termodinámica: Introducción', 'Comenzamos la unidad de termodinámica. Les comparto los conceptos fundamentales: temperatura, calor y trabajo.', '{}', '2026-06-17', 'published'),
('p14', 'm7', 'c3', 'd4', 'Reacciones Químicas: Balance', 'Práctica de balance de ecuaciones químicas. Completar los ejercicios de la guía antes del jueves.', '{}', '2026-06-19', 'published'),
('p15', 'm7', 'c3', 'd4', 'Química Orgánica: Hidrocarbonos', 'Clasificación y nomenclatura de los hidrocarburos. Tabla periódica y estructuras moleculares.', '{}', '2026-06-14', 'published')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- App Users
-- ============================================================
INSERT INTO app_users (id, username, password, role, linked_profile_id, is_active, created_at) VALUES
('user-admin', 'admin', 'admin123', 'admin', '', true, '2026-01-01'),
('user-doc1', 'carlos.garcia', 'doc123', 'docente', 'd1', true, '2026-01-01'),
('user-doc2', 'maria.gonzalez', 'doc123', 'docente', 'd2', true, '2026-01-01'),
('user-doc3', 'roberto.silva', 'doc123', 'docente', 'd3', true, '2026-01-01'),
('user-prec1', 'preceptor1', 'prec123', 'preceptor', 'u4', true, '2026-01-01'),
('user-est1', 'lucas.rodriguez', 'est123', 'estudiante', 'e1', true, '2026-01-01'),
('user-est2', 'valentina.lopez', 'est123', 'estudiante', 'e2', true, '2026-01-01'),
('user-est3', 'sofia.gomez', 'est123', 'estudiante', 'e4', false, '2026-01-01')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Learning Cores (Núcleos de aprendizaje)
-- ============================================================
INSERT INTO learning_cores (id, subject_id, course_id, teacher_id, title, description, period, "order", is_active) VALUES
('nc-m1-1', 'm1', 'c1', 'd1', 'Núcleo 1: Números reales', 'Conjuntos numéricos, operaciones y propiedades.', 'Primer cuatrimestre', 1, true),
('nc-m1-2', 'm1', 'c1', 'd1', 'Núcleo 2: Funciones', 'Función lineal y cuadrática, análisis gráfico.', 'Primer cuatrimestre', 2, true),
('nc-m1-3', 'm1', 'c1', 'd1', 'Núcleo 3: Geometría', 'Geometría analítica y trigonometría básica.', 'Segundo cuatrimestre', 3, true),
('nc-m2-1', 'm2', 'c1', 'd2', 'Núcleo 1: Comprensión lectora', 'Análisis de textos narrativos y expositivos.', 'Primer cuatrimestre', 1, true),
('nc-m2-2', 'm2', 'c1', 'd2', 'Núcleo 2: Producción escrita', 'Redacción, coherencia y cohesión textual.', 'Segundo cuatrimestre', 2, true),
('nc-m3-1', 'm3', 'c1', 'd1', 'Núcleo 1: Historia Moderna', 'Revolución Francesa y sus consecuencias.', 'Primer cuatrimestre', 1, true),
('nc-m3-2', 'm3', 'c1', 'd1', 'Núcleo 2: Historia Argentina', 'Formación del Estado nacional argentino.', 'Segundo cuatrimestre', 2, true),
('nc-m4-1', 'm4', 'c2', 'd3', 'Núcleo 1: Célula y División', 'Estructura celular, mitosis y meiosis.', 'Primer cuatrimestre', 1, true),
('nc-m4-2', 'm4', 'c2', 'd3', 'Núcleo 2: Genética', 'ADN, ARN, herencia y variabilidad genética.', 'Segundo cuatrimestre', 2, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Evaluations
-- ============================================================
INSERT INTO evaluations (id, learning_core_id, subject_id, course_id, teacher_id, title, description, date, type, status) VALUES
('ev-nc-m1-1', 'nc-m1-1', 'm1', 'c1', 'd1', 'Evaluación - Núcleo 1', 'Números reales y operaciones.', '2026-07-10', 'Evaluación', 'Programada'),
('ev-nc-m1-1-r1', 'nc-m1-1', 'm1', 'c1', 'd1', 'Recuperatorio 1 - Núcleo 1', 'Primera instancia de recuperación.', '2026-07-17', 'Recuperatorio 1', 'Programada'),
('ev-nc-m1-2', 'nc-m1-2', 'm1', 'c1', 'd1', 'Evaluación - Núcleo 2', 'Funciones lineal y cuadrática.', '2026-07-24', 'Evaluación', 'Programada'),
('ev-nc-m2-1', 'nc-m2-1', 'm2', 'c1', 'd2', 'Evaluación - Núcleo 1', 'Comprensión de texto narrativo.', '2026-07-08', 'Evaluación', 'Realizada'),
('ev-nc-m2-1-r1', 'nc-m2-1', 'm2', 'c1', 'd2', 'Recuperatorio 1 - Núcleo 1', 'Primera instancia de recuperación.', '2026-07-15', 'Recuperatorio 1', 'Programada'),
('ev-nc-m3-1', 'nc-m3-1', 'm3', 'c1', 'd1', 'Evaluación - Núcleo 1', 'Revolución Francesa: causas, etapas y consecuencias.', '2026-07-12', 'Evaluación', 'Realizada'),
('ev-nc-m4-1', 'nc-m4-1', 'm4', 'c2', 'd3', 'Evaluación - Núcleo 1', 'Estructura celular y división celular.', '2026-07-09', 'Evaluación', 'Realizada')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Evaluation Grades
-- ============================================================
INSERT INTO evaluation_grades (id, student_id, subject_id, course_id, learning_core_id, evaluation_id, instance_type, grade, date, observation, teacher_id, visible_for_student) VALUES
('eg-1', 'e1', 'm2', 'c1', 'nc-m2-1', 'ev-nc-m2-1', 'evaluacion_principal', 5, '2026-07-08', 'Necesita mejorar comprensión inferencial.', 'd2', true),
('eg-2', 'e1', 'm1', 'c1', 'nc-m1-1', 'ev-nc-m1-1', 'evaluacion_principal', 8, '2026-07-10', 'Buen desempeño en operaciones.', 'd1', true),
('eg-3', 'e1', 'm3', 'c1', 'nc-m3-1', 'ev-nc-m3-1', 'evaluacion_principal', 7, '2026-07-12', 'Buena comprensión del período histórico.', 'd1', true),
('eg-4', 'e2', 'm2', 'c1', 'nc-m2-1', 'ev-nc-m2-1', 'evaluacion_principal', 9, '2026-07-08', 'Excelente análisis textual.', 'd2', true),
('eg-5', 'e3', 'm2', 'c1', 'nc-m2-1', 'ev-nc-m2-1', 'evaluacion_principal', 4, '2026-07-08', 'Debe recuperar el núcleo.', 'd2', true),
('eg-6', 'e4', 'm4', 'c2', 'nc-m4-1', 'ev-nc-m4-1', 'evaluacion_principal', 6, '2026-07-09', 'Aprobado con conocimientos suficientes.', 'd3', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Priority Contents
-- ============================================================
INSERT INTO priority_contents (id, course_id, subject_id, teacher_id, school_year, period, learning_core_id, title, "order", is_active, created_at) VALUES
('pc-1', 'c1', 'm1', 'd1', 2026, 'Primer cuatrimestre', 'nc-m1-1', 'Sistema de Numeración Decimal y Romano', 1, true, '2026-03-10'),
('pc-2', 'c1', 'm1', 'd1', 2026, 'Primer cuatrimestre', 'nc-m1-2', 'Funciones lineales y cuadráticas', 2, true, '2026-03-10'),
('pc-3', 'c1', 'm2', 'd2', 2026, 'Primer cuatrimestre', null, 'Comprensión de textos narrativos', 1, true, '2026-03-10'),
('pc-4', 'c2', 'm4', 'd3', 2026, 'Primer cuatrimestre', 'nc-m4-1', 'Célula: estructura y funciones', 1, true, '2026-03-12')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Worked Learnings
-- ============================================================
INSERT INTO worked_learnings (id, priority_content_id, course_id, subject_id, teacher_id, description, "order", is_active, created_at) VALUES
('wl-1', 'pc-1', 'c1', 'm1', 'd1', 'Identifica y expresa coloquialmente la regla de formación de regularidades numéricas.', 1, true, '2026-03-10'),
('wl-2', 'pc-1', 'c1', 'm1', 'd1', 'Comprende las características principales del sistema decimal.', 2, true, '2026-03-10'),
('wl-3', 'pc-1', 'c1', 'm1', 'd1', 'Diferencia características del sistema romano respecto al decimal.', 3, true, '2026-03-10'),
('wl-4', 'pc-2', 'c1', 'm1', 'd1', 'Reconoce y grafica funciones lineales en el plano cartesiano.', 1, true, '2026-03-10'),
('wl-5', 'pc-3', 'c1', 'm2', 'd2', 'Identifica la estructura narrativa en textos literarios.', 1, true, '2026-03-10'),
('wl-6', 'pc-4', 'c2', 'm4', 'd3', 'Distingue los componentes de la célula eucariota y procariota.', 1, true, '2026-03-12'),
('wl-7', 'pc-4', 'c2', 'm4', 'd3', 'Comprende el proceso de mitosis y su importancia biológica.', 2, true, '2026-03-12')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Simple Grades (Evaluaciones 1-8)
-- ============================================================
INSERT INTO simple_grades (id, student_id, course_id, subject_id, teacher_id, school_year, evaluation_number, grade, recovery_one_grade, recovery_two_grade, observation, updated_at) VALUES
('sg-1', 'e1', 'c1', 'm1', 'd1', 2026, 1, '5', '7', '', 'Aprobó en recuperatorio', '2026-06-20'),
('sg-2', 'e1', 'c1', 'm1', 'd1', 2026, 2, '8', '', '', '', '2026-06-20'),
('sg-3', 'e1', 'c1', 'm1', 'd1', 2026, 3, '7', '', '', '', '2026-06-20'),
('sg-4', 'e2', 'c1', 'm1', 'd1', 2026, 1, '4', '4', '7', 'Aprobó en segundo recuperatorio', '2026-06-20'),
('sg-5', 'e2', 'c1', 'm1', 'd1', 2026, 2, '3', '', '', '', '2026-06-20'),
('sg-6', 'e3', 'c1', 'm1', 'd1', 2026, 1, '9', '', '', '', '2026-06-20'),
('sg-7', 'e3', 'c1', 'm1', 'd1', 2026, 2, '6', '', '', '', '2026-06-20')
ON CONFLICT (id) DO NOTHING;
