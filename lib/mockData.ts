import {
  Estudiante, Docente, Curso, Materia, Calificacion,
  Asistencia, Disciplina, Evento, Actividad, User, Post, AppUser,
  LearningCore, Evaluation, EvaluationGrade
} from '@/types';

export const MOCK_USERS: User[] = [
  { id: 'u1', nombre: 'Administrador', email: 'admin@escuelanet.edu', rol: 'admin' },
  { id: 'u2', nombre: 'Prof. García', email: 'docente@escuelanet.edu', rol: 'docente' },
  { id: 'u3', nombre: 'Lucas Rodríguez', email: 'estudiante@escuelanet.edu', rol: 'estudiante' },
  { id: 'u4', nombre: 'Sra. Martínez', email: 'preceptor@escuelanet.edu', rol: 'preceptor' },
];

export const MOCK_CREDENTIALS: Record<string, string> = {
  'admin@escuelanet.edu': 'admin123',
  'docente@escuelanet.edu': 'docente123',
  'estudiante@escuelanet.edu': 'estudiante123',
  'preceptor@escuelanet.edu': 'preceptor123',
};

export const MOCK_ESTUDIANTES: Estudiante[] = [
  { id: 'e1', nombre: 'Lucas', apellido: 'Rodríguez', dni: '45123456', email: 'lucas@mail.com', telefono: '11-4567-8901', curso: 'c1', turno: 'mañana', fechaNacimiento: '2008-03-15', activo: true },
  { id: 'e2', nombre: 'Valentina', apellido: 'López', dni: '45234567', email: 'valentina@mail.com', telefono: '11-4567-8902', curso: 'c1', turno: 'mañana', fechaNacimiento: '2008-06-22', activo: true },
  { id: 'e3', nombre: 'Mateo', apellido: 'Fernández', dni: '45345678', email: 'mateo@mail.com', telefono: '11-4567-8903', curso: 'c1', turno: 'mañana', fechaNacimiento: '2008-01-10', activo: true },
  { id: 'e4', nombre: 'Sofía', apellido: 'Gómez', dni: '45456789', email: 'sofia@mail.com', telefono: '11-4567-8904', curso: 'c2', turno: 'tarde', fechaNacimiento: '2007-09-05', activo: true },
  { id: 'e5', nombre: 'Santiago', apellido: 'Martínez', dni: '45567890', email: 'santiago@mail.com', telefono: '11-4567-8905', curso: 'c2', turno: 'tarde', fechaNacimiento: '2007-11-18', activo: true },
  { id: 'e6', nombre: 'Camila', apellido: 'Torres', dni: '45678901', email: 'camila@mail.com', telefono: '11-4567-8906', curso: 'c3', turno: 'mañana', fechaNacimiento: '2006-04-30', activo: true },
  { id: 'e7', nombre: 'Benjamín', apellido: 'Díaz', dni: '45789012', email: 'benjamin@mail.com', telefono: '11-4567-8907', curso: 'c3', turno: 'mañana', fechaNacimiento: '2006-07-14', activo: false },
  { id: 'e8', nombre: 'Isabella', apellido: 'Pérez', dni: '45890123', email: 'isabella@mail.com', telefono: '11-4567-8908', curso: 'c2', turno: 'tarde', fechaNacimiento: '2007-02-28', activo: true },
];

export const MOCK_DOCENTES: Docente[] = [
  { id: 'd1', nombre: 'Carlos', apellido: 'García', dni: '30123456', email: 'docente@escuelanet.edu', telefono: '11-5678-9012', materias: ['m1', 'm3'], activo: true },
  { id: 'd2', nombre: 'María', apellido: 'González', dni: '30234567', email: 'mgonzalez@escuelanet.edu', telefono: '11-5678-9013', materias: ['m2', 'm5'], activo: true },
  { id: 'd3', nombre: 'Roberto', apellido: 'Silva', dni: '30345678', email: 'rsilva@escuelanet.edu', telefono: '11-5678-9014', materias: ['m4', 'm6'], activo: true },
  { id: 'd4', nombre: 'Ana', apellido: 'Ramírez', dni: '30456789', email: 'aramirez@escuelanet.edu', telefono: '11-5678-9015', materias: ['m7'], activo: true },
];

export const MOCK_CURSOS: Curso[] = [
  { id: 'c1', nombre: '1er Año', division: 'A', turno: 'mañana', nivel: 'Secundario', docenteId: 'd1', estudiantesIds: ['e1', 'e2', 'e3'] },
  { id: 'c2', nombre: '2do Año', division: 'B', turno: 'tarde', nivel: 'Secundario', docenteId: 'd2', estudiantesIds: ['e4', 'e5', 'e8'] },
  { id: 'c3', nombre: '3er Año', division: 'A', turno: 'mañana', nivel: 'Secundario', docenteId: 'd3', estudiantesIds: ['e6', 'e7'] },
];

export const MOCK_MATERIAS: Materia[] = [
  { id: 'm1', nombre: 'Matemática', cursoId: 'c1', docenteId: 'd1', horasSemanal: 5, descripcion: 'Álgebra, geometría y análisis matemático.' },
  { id: 'm2', nombre: 'Lengua y Literatura', cursoId: 'c1', docenteId: 'd2', horasSemanal: 4, descripcion: 'Comprensión lectora, gramática y producción escrita.' },
  { id: 'm3', nombre: 'Historia', cursoId: 'c1', docenteId: 'd1', horasSemanal: 3, descripcion: 'Historia argentina y mundial.' },
  { id: 'm4', nombre: 'Biología', cursoId: 'c2', docenteId: 'd3', horasSemanal: 4, descripcion: 'Ciencias naturales y biología celular.' },
  { id: 'm5', nombre: 'Inglés', cursoId: 'c2', docenteId: 'd2', horasSemanal: 3, descripcion: 'Inglés técnico y conversacional.' },
  { id: 'm6', nombre: 'Física', cursoId: 'c3', docenteId: 'd3', horasSemanal: 4, descripcion: 'Mecánica, termodinámica y electromagnetismo.' },
  { id: 'm7', nombre: 'Química', cursoId: 'c3', docenteId: 'd4', horasSemanal: 4, descripcion: 'Química orgánica e inorgánica.' },
  { id: 'm8', nombre: 'Geografía', cursoId: 'c2', docenteId: 'd2', horasSemanal: 3, descripcion: 'Geografía física y humana.' },
];

export const MOCK_CALIFICACIONES: Calificacion[] = [
  { id: 'cal1', estudianteId: 'e1', materiaId: 'm1', nota: 8, tipo: 'Evaluación', fecha: '2024-04-10', trimestre: 1, descripcion: 'Evaluación - Núcleo 1', docenteId: 'd1' },
  { id: 'cal2', estudianteId: 'e1', materiaId: 'm1', nota: 7, tipo: 'Trabajo práctico', fecha: '2024-04-25', trimestre: 1, descripcion: 'TP Álgebra', docenteId: 'd1' },
  { id: 'cal3', estudianteId: 'e1', materiaId: 'm2', nota: 9, tipo: 'Evaluación', fecha: '2024-04-12', trimestre: 1, descripcion: 'Evaluación - Núcleo 1 Lengua', docenteId: 'd2' },
  { id: 'cal4', estudianteId: 'e1', materiaId: 'm3', nota: 6, tipo: 'Evaluación oral', fecha: '2024-05-03', trimestre: 1, descripcion: 'Coloquio Historia', docenteId: 'd1' },
  { id: 'cal5', estudianteId: 'e1', materiaId: 'm1', nota: 9, tipo: 'Evaluación', fecha: '2024-06-15', trimestre: 2, descripcion: 'Evaluación - Núcleo 2', docenteId: 'd1' },
  { id: 'cal6', estudianteId: 'e1', materiaId: 'm2', nota: 8, tipo: 'Trabajo práctico', fecha: '2024-06-20', trimestre: 2, descripcion: 'TP Redacción', docenteId: 'd2' },
  { id: 'cal7', estudianteId: 'e2', materiaId: 'm1', nota: 10, tipo: 'Evaluación', fecha: '2024-04-10', trimestre: 1, descripcion: 'Evaluación - Núcleo 1', docenteId: 'd1' },
  { id: 'cal8', estudianteId: 'e2', materiaId: 'm2', nota: 8, tipo: 'Evaluación', fecha: '2024-04-12', trimestre: 1, descripcion: 'Evaluación - Núcleo 1 Lengua', docenteId: 'd2' },
  { id: 'cal9', estudianteId: 'e3', materiaId: 'm1', nota: 5, tipo: 'Evaluación', fecha: '2024-04-10', trimestre: 1, descripcion: 'Evaluación - Núcleo 1', docenteId: 'd1' },
  { id: 'cal10', estudianteId: 'e3', materiaId: 'm2', nota: 7, tipo: 'Evaluación', fecha: '2024-04-12', trimestre: 1, descripcion: 'Evaluación - Núcleo 1 Lengua', docenteId: 'd2' },
];

export const MOCK_ASISTENCIAS: Asistencia[] = [
  { id: 'a1', estudianteId: 'e1', cursoId: 'c1', fecha: '2024-06-03', presente: true },
  { id: 'a2', estudianteId: 'e1', cursoId: 'c1', fecha: '2024-06-04', presente: false, justificada: false, observacion: 'Sin aviso' },
  { id: 'a3', estudianteId: 'e1', cursoId: 'c1', fecha: '2024-06-05', presente: true },
  { id: 'a4', estudianteId: 'e1', cursoId: 'c1', fecha: '2024-06-06', presente: false, justificada: true, observacion: 'Médico' },
  { id: 'a5', estudianteId: 'e1', cursoId: 'c1', fecha: '2024-06-07', presente: true },
  { id: 'a6', estudianteId: 'e1', cursoId: 'c1', fecha: '2024-06-10', presente: true },
  { id: 'a7', estudianteId: 'e1', cursoId: 'c1', fecha: '2024-06-11', presente: false, justificada: false },
  { id: 'a8', estudianteId: 'e1', cursoId: 'c1', fecha: '2024-06-12', presente: true },
  { id: 'a9', estudianteId: 'e2', cursoId: 'c1', fecha: '2024-06-03', presente: true },
  { id: 'a10', estudianteId: 'e2', cursoId: 'c1', fecha: '2024-06-04', presente: true },
  { id: 'a11', estudianteId: 'e3', cursoId: 'c1', fecha: '2024-06-03', presente: false, justificada: false },
  { id: 'a12', estudianteId: 'e3', cursoId: 'c1', fecha: '2024-06-04', presente: true },
];

export const MOCK_DISCIPLINA: Disciplina[] = [
  { id: 'dis1', estudianteId: 'e1', tipo: 'observacion', descripcion: 'Uso de celular en clase durante la explicación del docente.', fecha: '2024-05-15', docenteId: 'd1', resuelto: true },
  { id: 'dis2', estudianteId: 'e1', tipo: 'felicitacion', descripcion: 'Excelente participación en el proyecto de ciencias. Actitud positiva y colaborativa.', fecha: '2024-06-01', docenteId: 'd2', resuelto: false },
  { id: 'dis3', estudianteId: 'e3', tipo: 'apercibimiento', descripcion: 'Falta de respeto hacia un compañero. Se habló con los padres.', fecha: '2024-05-20', preceptorId: 'u4', resuelto: true },
  { id: 'dis4', estudianteId: 'e5', tipo: 'suspension', descripcion: 'Reincidencia en comportamiento disruptivo. Suspensión de 2 días.', fecha: '2024-06-10', preceptorId: 'u4', resuelto: false },
  { id: 'dis5', estudianteId: 'e2', tipo: 'felicitacion', descripcion: 'Primer puesto en olimpíada de matemática regional.', fecha: '2024-06-05', docenteId: 'd1', resuelto: false },
];

export const MOCK_EVENTOS: Evento[] = [
  { id: 'ev1', titulo: 'Evaluación Matemática 1A', descripcion: 'Evaluación de Matemática para 1er Año A - Núcleo 1', fecha: '2024-07-10', tipo: 'examen', cursoId: 'c1', color: '#ef4444' },
  { id: 'ev2', titulo: 'Reunión de Padres', descripcion: 'Reunión general de padres y tutores', fecha: '2024-07-15', tipo: 'reunion', color: '#3b82f6' },
  { id: 'ev3', titulo: 'Feriado Nacional', descripcion: 'Día de la Independencia', fecha: '2024-07-09', tipo: 'feriado', color: '#6b7280' },
  { id: 'ev4', titulo: 'Entrega TP Biología', descripcion: 'Entrega de trabajo práctico de biología', fecha: '2024-07-08', tipo: 'entrega', cursoId: 'c2', color: '#10b981' },
  { id: 'ev5', titulo: 'Acto Escolar', descripcion: 'Acto por el aniversario de la escuela', fecha: '2024-07-20', tipo: 'actividad', color: '#f59e0b' },
  { id: 'ev6', titulo: 'Olimpíada de Matemática', descripcion: 'Participación en olimpíada zonal', fecha: '2024-07-25', tipo: 'actividad', color: '#8b5cf6' },
  { id: 'ev7', titulo: 'Evaluación Historia', descripcion: 'Evaluación de Historia para 1er año - Núcleo 1', fecha: '2024-07-18', tipo: 'examen', cursoId: 'c1', color: '#ef4444' },
];

export const MOCK_POSTS: Post[] = [
  { id: 'p1', subjectId: 'm1', courseId: 'c1', teacherId: 'd1', title: 'TP de Funciones', content: 'Resuelvan los ejercicios 1 al 10 de la página 45 del libro. Entregar la semana que viene en la clase.', images: [], createdAt: '2026-06-20', status: 'published' },
  { id: 'p2', subjectId: 'm1', courseId: 'c1', teacherId: 'd1', title: 'Material: Derivadas e Integrales', content: 'Les comparto el apunte teórico sobre derivadas e integrales. Leer antes de la próxima clase para poder practicar ejercicios.', images: [], createdAt: '2026-06-18', status: 'published' },
  { id: 'p3', subjectId: 'm1', courseId: 'c1', teacherId: 'd1', title: 'Borrador: Evaluación integradora', content: 'Evaluación integradora del primer trimestre. Temas: funciones, derivadas, límites.', images: [], createdAt: '2026-06-22', status: 'draft' },
  { id: 'p4', subjectId: 'm2', courseId: 'c1', teacherId: 'd2', title: 'Análisis de "El Aleph"', content: 'Para la próxima clase: leer el cuento "El Aleph" de Borges y preparar un análisis sobre el símbolo del aleph como metáfora del universo.', images: [], createdAt: '2026-06-19', status: 'published' },
  { id: 'p5', subjectId: 'm2', courseId: 'c1', teacherId: 'd2', title: 'Gramática: Los tiempos verbales', content: 'Repaso de los tiempos verbales en el modo subjuntivo. Ejercicios de práctica en la guía adjunta.', images: [], createdAt: '2026-06-17', status: 'published' },
  { id: 'p6', subjectId: 'm3', courseId: 'c1', teacherId: 'd1', title: 'Revolución Francesa: Cronología', content: 'Hoy vimos la cronología de la Revolución Francesa. Les dejo un resumen de las etapas más importantes. Para la evaluación: estudiar causas, etapas y consecuencias.', images: [], createdAt: '2026-06-15', status: 'published' },
  { id: 'p7', subjectId: 'm3', courseId: 'c1', teacherId: 'd1', title: 'Fuentes primarias: Declaración de los Derechos del Hombre', content: 'Análisis de la Declaración de los Derechos del Hombre y del Ciudadano como fuente primaria histórica.', images: [], createdAt: '2026-06-12', status: 'published' },
  { id: 'p8', subjectId: 'm4', courseId: 'c2', teacherId: 'd3', title: 'Mitosis y Meiosis: Resumen', content: 'Resumen de los procesos de división celular. Incluye diagramas de las fases de la mitosis y meiosis.', images: [], createdAt: '2026-06-20', status: 'published' },
  { id: 'p9', subjectId: 'm4', courseId: 'c2', teacherId: 'd3', title: 'Trabajo Práctico: ADN y ARN', content: 'TP grupal sobre la estructura del ADN y ARN. Grupos de 3 personas. Entregar el viernes 26/06.', images: [], createdAt: '2026-06-18', status: 'published' },
  { id: 'p10', subjectId: 'm5', courseId: 'c2', teacherId: 'd2', title: 'Unit 5: Present Perfect', content: 'Practice exercises for Present Perfect tense. Complete pages 45-48 in your textbook before next class.', images: [], createdAt: '2026-06-19', status: 'published' },
  { id: 'p11', subjectId: 'm5', courseId: 'c2', teacherId: 'd2', title: 'Vocabulary Review: Technology', content: 'Review the vocabulary list from Unit 4 - Technology and Innovation. Quiz next Monday.', images: [], createdAt: '2026-06-16', status: 'published' },
  { id: 'p12', subjectId: 'm6', courseId: 'c3', teacherId: 'd3', title: 'Leyes de Newton: Problemas', content: 'Resolución de problemas aplicando las tres leyes de Newton. Deben resolver los ejercicios del 1 al 15.', images: [], createdAt: '2026-06-20', status: 'published' },
  { id: 'p13', subjectId: 'm6', courseId: 'c3', teacherId: 'd3', title: 'Termodinámica: Introducción', content: 'Comenzamos la unidad de termodinámica. Les comparto los conceptos fundamentales: temperatura, calor y trabajo.', images: [], createdAt: '2026-06-17', status: 'published' },
  { id: 'p14', subjectId: 'm7', courseId: 'c3', teacherId: 'd4', title: 'Reacciones Químicas: Balance', content: 'Práctica de balance de ecuaciones químicas. Completar los ejercicios de la guía antes del jueves.', images: [], createdAt: '2026-06-19', status: 'published' },
  { id: 'p15', subjectId: 'm7', courseId: 'c3', teacherId: 'd4', title: 'Química Orgánica: Hidrocarbonos', content: 'Clasificación y nomenclatura de los hidrocarburos. Tabla periódica y estructuras moleculares.', images: [], createdAt: '2026-06-14', status: 'published' },
];

export const MOCK_APP_USERS: AppUser[] = [
  { id: 'user-admin', username: 'admin', password: 'admin123', role: 'admin', linkedProfileId: '', isActive: true, createdAt: '2026-01-01' },
  { id: 'user-doc1', username: 'carlos.garcia', password: 'doc123', role: 'docente', linkedProfileId: 'd1', isActive: true, createdAt: '2026-01-01' },
  { id: 'user-doc2', username: 'maria.gonzalez', password: 'doc123', role: 'docente', linkedProfileId: 'd2', isActive: true, createdAt: '2026-01-01' },
  { id: 'user-doc3', username: 'roberto.silva', password: 'doc123', role: 'docente', linkedProfileId: 'd3', isActive: true, createdAt: '2026-01-01' },
  { id: 'user-prec1', username: 'preceptor1', password: 'prec123', role: 'preceptor', linkedProfileId: 'u4', isActive: true, createdAt: '2026-01-01' },
  { id: 'user-est1', username: 'lucas.rodriguez', password: 'est123', role: 'estudiante', linkedProfileId: 'e1', isActive: true, createdAt: '2026-01-01' },
  { id: 'user-est2', username: 'valentina.lopez', password: 'est123', role: 'estudiante', linkedProfileId: 'e2', isActive: true, createdAt: '2026-01-01' },
  { id: 'user-est3', username: 'sofia.gomez', password: 'est123', role: 'estudiante', linkedProfileId: 'e4', isActive: false, createdAt: '2026-01-01' },
];

export const MOCK_LEARNING_CORES: LearningCore[] = [
  // Matemática (m1, c1, d1)
  { id: 'nc-m1-1', subjectId: 'm1', courseId: 'c1', teacherId: 'd1', title: 'Núcleo 1: Números reales', description: 'Conjuntos numéricos, operaciones y propiedades.', period: 'Primer cuatrimestre', order: 1, isActive: true },
  { id: 'nc-m1-2', subjectId: 'm1', courseId: 'c1', teacherId: 'd1', title: 'Núcleo 2: Funciones', description: 'Función lineal y cuadrática, análisis gráfico.', period: 'Primer cuatrimestre', order: 2, isActive: true },
  { id: 'nc-m1-3', subjectId: 'm1', courseId: 'c1', teacherId: 'd1', title: 'Núcleo 3: Geometría', description: 'Geometría analítica y trigonometría básica.', period: 'Segundo cuatrimestre', order: 3, isActive: true },
  // Lengua (m2, c1, d2)
  { id: 'nc-m2-1', subjectId: 'm2', courseId: 'c1', teacherId: 'd2', title: 'Núcleo 1: Comprensión lectora', description: 'Análisis de textos narrativos y expositivos.', period: 'Primer cuatrimestre', order: 1, isActive: true },
  { id: 'nc-m2-2', subjectId: 'm2', courseId: 'c1', teacherId: 'd2', title: 'Núcleo 2: Producción escrita', description: 'Redacción, coherencia y cohesión textual.', period: 'Segundo cuatrimestre', order: 2, isActive: true },
  // Historia (m3, c1, d1)
  { id: 'nc-m3-1', subjectId: 'm3', courseId: 'c1', teacherId: 'd1', title: 'Núcleo 1: Historia Moderna', description: 'Revolución Francesa y sus consecuencias.', period: 'Primer cuatrimestre', order: 1, isActive: true },
  { id: 'nc-m3-2', subjectId: 'm3', courseId: 'c1', teacherId: 'd1', title: 'Núcleo 2: Historia Argentina', description: 'Formación del Estado nacional argentino.', period: 'Segundo cuatrimestre', order: 2, isActive: true },
  // Biología (m4, c2, d3)
  { id: 'nc-m4-1', subjectId: 'm4', courseId: 'c2', teacherId: 'd3', title: 'Núcleo 1: Célula y División', description: 'Estructura celular, mitosis y meiosis.', period: 'Primer cuatrimestre', order: 1, isActive: true },
  { id: 'nc-m4-2', subjectId: 'm4', courseId: 'c2', teacherId: 'd3', title: 'Núcleo 2: Genética', description: 'ADN, ARN, herencia y variabilidad genética.', period: 'Segundo cuatrimestre', order: 2, isActive: true },
];

export const MOCK_EVALUATIONS: Evaluation[] = [
  { id: 'ev-nc-m1-1', learningCoreId: 'nc-m1-1', subjectId: 'm1', courseId: 'c1', teacherId: 'd1', title: 'Evaluación - Núcleo 1', description: 'Números reales y operaciones.', date: '2026-07-10', type: 'Evaluación', status: 'Programada' },
  { id: 'ev-nc-m1-1-r1', learningCoreId: 'nc-m1-1', subjectId: 'm1', courseId: 'c1', teacherId: 'd1', title: 'Recuperatorio 1 - Núcleo 1', description: 'Primera instancia de recuperación.', date: '2026-07-17', type: 'Recuperatorio 1', status: 'Programada' },
  { id: 'ev-nc-m1-2', learningCoreId: 'nc-m1-2', subjectId: 'm1', courseId: 'c1', teacherId: 'd1', title: 'Evaluación - Núcleo 2', description: 'Funciones lineal y cuadrática.', date: '2026-07-24', type: 'Evaluación', status: 'Programada' },
  { id: 'ev-nc-m2-1', learningCoreId: 'nc-m2-1', subjectId: 'm2', courseId: 'c1', teacherId: 'd2', title: 'Evaluación - Núcleo 1', description: 'Comprensión de texto narrativo.', date: '2026-07-08', type: 'Evaluación', status: 'Realizada' },
  { id: 'ev-nc-m2-1-r1', learningCoreId: 'nc-m2-1', subjectId: 'm2', courseId: 'c1', teacherId: 'd2', title: 'Recuperatorio 1 - Núcleo 1', description: 'Primera instancia de recuperación.', date: '2026-07-15', type: 'Recuperatorio 1', status: 'Programada' },
  { id: 'ev-nc-m3-1', learningCoreId: 'nc-m3-1', subjectId: 'm3', courseId: 'c1', teacherId: 'd1', title: 'Evaluación - Núcleo 1', description: 'Revolución Francesa: causas, etapas y consecuencias.', date: '2026-07-12', type: 'Evaluación', status: 'Realizada' },
  { id: 'ev-nc-m4-1', learningCoreId: 'nc-m4-1', subjectId: 'm4', courseId: 'c2', teacherId: 'd3', title: 'Evaluación - Núcleo 1', description: 'Estructura celular y división celular.', date: '2026-07-09', type: 'Evaluación', status: 'Realizada' },
];

export const MOCK_EVALUATION_GRADES: EvaluationGrade[] = [
  { id: 'eg-1', studentId: 'e1', subjectId: 'm2', courseId: 'c1', learningCoreId: 'nc-m2-1', evaluationId: 'ev-nc-m2-1', instanceType: 'evaluacion_principal', grade: 5, date: '2026-07-08', observation: 'Necesita mejorar comprensión inferencial.', teacherId: 'd2', visibleForStudent: true },
  { id: 'eg-2', studentId: 'e1', subjectId: 'm1', courseId: 'c1', learningCoreId: 'nc-m1-1', evaluationId: 'ev-nc-m1-1', instanceType: 'evaluacion_principal', grade: 8, date: '2026-07-10', observation: 'Buen desempeño en operaciones.', teacherId: 'd1', visibleForStudent: true },
  { id: 'eg-3', studentId: 'e1', subjectId: 'm3', courseId: 'c1', learningCoreId: 'nc-m3-1', evaluationId: 'ev-nc-m3-1', instanceType: 'evaluacion_principal', grade: 7, date: '2026-07-12', observation: 'Buena comprensión del período histórico.', teacherId: 'd1', visibleForStudent: true },
  { id: 'eg-4', studentId: 'e2', subjectId: 'm2', courseId: 'c1', learningCoreId: 'nc-m2-1', evaluationId: 'ev-nc-m2-1', instanceType: 'evaluacion_principal', grade: 9, date: '2026-07-08', observation: 'Excelente análisis textual.', teacherId: 'd2', visibleForStudent: true },
  { id: 'eg-5', studentId: 'e3', subjectId: 'm2', courseId: 'c1', learningCoreId: 'nc-m2-1', evaluationId: 'ev-nc-m2-1', instanceType: 'evaluacion_principal', grade: 4, date: '2026-07-08', observation: 'Debe recuperar el núcleo.', teacherId: 'd2', visibleForStudent: true },
  { id: 'eg-6', studentId: 'e4', subjectId: 'm4', courseId: 'c2', learningCoreId: 'nc-m4-1', evaluationId: 'ev-nc-m4-1', instanceType: 'evaluacion_principal', grade: 6, date: '2026-07-09', observation: 'Aprobado con conocimientos suficientes.', teacherId: 'd3', visibleForStudent: true },
];

export const MOCK_ACTIVIDADES: Actividad[] = [
  { id: 'act1', titulo: 'TP: Ecuaciones de segundo grado', descripcion: 'Resolver los ejercicios del 1 al 20 del apunte. Entregar el miércoles.', materiaId: 'm1', docenteId: 'd1', tipo: 'tarea', fechaEntrega: '2024-07-10', fechaPublicacion: '2024-07-03' },
  { id: 'act2', titulo: 'Material: Funciones cuadráticas', descripcion: 'Material teórico sobre funciones cuadráticas. Leer antes de la próxima clase.', materiaId: 'm1', docenteId: 'd1', tipo: 'material', fechaPublicacion: '2024-07-01' },
  { id: 'act3', titulo: 'Análisis literario: El Aleph', descripcion: 'Leer el cuento "El Aleph" de Borges y elaborar un análisis de 2 páginas.', materiaId: 'm2', docenteId: 'd2', tipo: 'tarea', fechaEntrega: '2024-07-12', fechaPublicacion: '2024-07-02' },
  { id: 'act4', titulo: 'Guía: Revolución Francesa', descripcion: 'Responder la guía de preguntas sobre la Revolución Francesa.', materiaId: 'm3', docenteId: 'd1', tipo: 'tarea', fechaEntrega: '2024-07-08', fechaPublicacion: '2024-06-28' },
  { id: 'act5', titulo: 'Video: Mitosis y Meiosis', descripcion: 'Ver el video explicativo y responder el cuestionario adjunto.', materiaId: 'm4', docenteId: 'd3', tipo: 'actividad', fechaEntrega: '2024-07-11', fechaPublicacion: '2024-07-04' },
  { id: 'act6', titulo: 'Vocabulary Unit 5', descripcion: 'Practice vocabulary exercises from the textbook, pages 45-48.', materiaId: 'm5', docenteId: 'd2', tipo: 'tarea', fechaEntrega: '2024-07-09', fechaPublicacion: '2024-07-03' },
];
