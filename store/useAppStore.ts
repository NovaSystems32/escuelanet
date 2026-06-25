import { create } from 'zustand';
import {
  Estudiante, Docente, Curso, Materia, Calificacion,
  Asistencia, Disciplina, Evento, Actividad, Post, AppUser,
  LearningCore, Evaluation, EvaluationGrade, CoreStatus,
  PriorityContent, WorkedLearning, SimpleGrade
} from '@/types';
import { supabase } from '@/lib/supabase/client';

// ---- helpers ----
const genId = () => Math.random().toString(36).substr(2, 9);
const now = () => new Date().toISOString().split('T')[0];

// ---- DB mappers: DB row → TypeScript object ----
const mapEst = (r: any): Estudiante => ({
  id: r.id, nombre: r.nombre, apellido: r.apellido, dni: r.dni,
  email: r.email, telefono: r.telefono, curso: r.curso, turno: r.turno,
  fechaNacimiento: r.fecha_nacimiento, activo: r.activo, photo: r.photo,
  tutor: r.tutor, telefonoTutor: r.telefono_tutor, direccion: r.direccion,
});
const mapDoc = (r: any): Docente => ({
  id: r.id, nombre: r.nombre, apellido: r.apellido, dni: r.dni,
  email: r.email, telefono: r.telefono, materias: r.materias ?? [], activo: r.activo,
});
const mapCurso = (r: any): Curso => ({
  id: r.id, nombre: r.nombre, division: r.division, turno: r.turno,
  nivel: r.nivel, docenteId: r.docente_id, estudiantesIds: r.estudiantes_ids ?? [],
});
const mapMateria = (r: any): Materia => ({
  id: r.id, nombre: r.nombre, cursoId: r.curso_id, docenteId: r.docente_id,
  horasSemanal: r.horas_semanal, descripcion: r.descripcion,
});
const mapCal = (r: any): Calificacion => ({
  id: r.id, estudianteId: r.estudiante_id, materiaId: r.materia_id,
  nota: r.nota, tipo: r.tipo, fecha: r.fecha, trimestre: r.trimestre,
  descripcion: r.descripcion, docenteId: r.docente_id,
});
const mapAsist = (r: any): Asistencia => ({
  id: r.id, estudianteId: r.estudiante_id, cursoId: r.curso_id,
  fecha: r.fecha, presente: r.presente, justificada: r.justificada, observacion: r.observacion,
});
const mapDisc = (r: any): Disciplina => ({
  id: r.id, estudianteId: r.estudiante_id, tipo: r.tipo,
  descripcion: r.descripcion, fecha: r.fecha,
  docenteId: r.docente_id, preceptorId: r.preceptor_id, resuelto: r.resuelto,
});
const mapEvento = (r: any): Evento => ({
  id: r.id, titulo: r.titulo, descripcion: r.descripcion,
  fecha: r.fecha, fechaFin: r.fecha_fin, tipo: r.tipo, cursoId: r.curso_id, color: r.color,
});
const mapActiv = (r: any): Actividad => ({
  id: r.id, titulo: r.titulo, descripcion: r.descripcion,
  materiaId: r.materia_id, docenteId: r.docente_id, tipo: r.tipo,
  fechaEntrega: r.fecha_entrega, fechaPublicacion: r.fecha_publicacion, archivo: r.archivo,
});
const mapPost = (r: any): Post => ({
  id: r.id, subjectId: r.subject_id, courseId: r.course_id,
  teacherId: r.teacher_id, title: r.title, content: r.content,
  images: r.images ?? [], attachments: r.attachments ?? [],
  createdAt: r.created_at, status: r.status,
});
const mapAppUser = (r: any): AppUser => ({
  id: r.id, username: r.username, password: r.password,
  role: r.role, linkedProfileId: r.linked_profile_id,
  isActive: r.is_active, createdAt: r.created_at,
});
const mapLc = (r: any): LearningCore => ({
  id: r.id, subjectId: r.subject_id, courseId: r.course_id,
  teacherId: r.teacher_id, title: r.title, description: r.description,
  period: r.period, order: r.order, isActive: r.is_active,
});
const mapEval = (r: any): Evaluation => ({
  id: r.id, learningCoreId: r.learning_core_id, subjectId: r.subject_id,
  courseId: r.course_id, teacherId: r.teacher_id, title: r.title,
  description: r.description, date: r.date, type: r.type, status: r.status,
});
const mapEvalGrade = (r: any): EvaluationGrade => ({
  id: r.id, studentId: r.student_id, subjectId: r.subject_id,
  courseId: r.course_id, learningCoreId: r.learning_core_id,
  evaluationId: r.evaluation_id, instanceType: r.instance_type,
  grade: r.grade, date: r.date, observation: r.observation,
  teacherId: r.teacher_id, visibleForStudent: r.visible_for_student,
});
const mapPc = (r: any): PriorityContent => ({
  id: r.id, courseId: r.course_id, subjectId: r.subject_id,
  teacherId: r.teacher_id, schoolYear: r.school_year, period: r.period,
  learningCoreId: r.learning_core_id, title: r.title,
  order: r.order, isActive: r.is_active, createdAt: r.created_at,
});
const mapWl = (r: any): WorkedLearning => ({
  id: r.id, priorityContentId: r.priority_content_id,
  courseId: r.course_id, subjectId: r.subject_id,
  teacherId: r.teacher_id, description: r.description,
  order: r.order, isActive: r.is_active, createdAt: r.created_at,
});
const mapSg = (r: any): SimpleGrade => ({
  id: r.id, studentId: r.student_id, courseId: r.course_id,
  subjectId: r.subject_id, teacherId: r.teacher_id,
  schoolYear: r.school_year, evaluationNumber: r.evaluation_number,
  grade: r.grade, recoveryOneGrade: r.recovery_one_grade,
  recoveryTwoGrade: r.recovery_two_grade, observation: r.observation,
  updatedAt: r.updated_at,
});

// ---- State interface ----
interface AppState {
  estudiantes: Estudiante[];
  docentes: Docente[];
  cursos: Curso[];
  materias: Materia[];
  calificaciones: Calificacion[];
  asistencias: Asistencia[];
  disciplina: Disciplina[];
  eventos: Evento[];
  actividades: Actividad[];
  posts: Post[];
  appUsers: AppUser[];
  learningCores: LearningCore[];
  evaluations: Evaluation[];
  evaluationGrades: EvaluationGrade[];
  priorityContents: PriorityContent[];
  workedLearnings: WorkedLearning[];
  simpleGrades: SimpleGrade[];
  dataLoaded: boolean;

  // Loader
  loadAllData: () => Promise<void>;

  // Estudiantes CRUD
  addEstudiante: (e: Omit<Estudiante, 'id'>) => Promise<void>;
  updateEstudiante: (id: string, e: Partial<Estudiante>) => Promise<void>;
  deleteEstudiante: (id: string) => Promise<void>;

  // Docentes CRUD
  addDocente: (d: Omit<Docente, 'id'>) => Promise<void>;
  updateDocente: (id: string, d: Partial<Docente>) => Promise<void>;
  deleteDocente: (id: string) => Promise<void>;

  // Cursos CRUD
  addCurso: (c: Omit<Curso, 'id'>) => Promise<void>;
  updateCurso: (id: string, c: Partial<Curso>) => Promise<void>;
  deleteCurso: (id: string) => Promise<void>;

  // Materias CRUD
  addMateria: (m: Omit<Materia, 'id'>) => Promise<void>;
  updateMateria: (id: string, m: Partial<Materia>) => Promise<void>;
  deleteMateria: (id: string) => Promise<void>;

  // Calificaciones CRUD
  addCalificacion: (c: Omit<Calificacion, 'id'>) => Promise<void>;
  updateCalificacion: (id: string, c: Partial<Calificacion>) => Promise<void>;
  deleteCalificacion: (id: string) => Promise<void>;

  // Asistencias CRUD
  addAsistencia: (a: Omit<Asistencia, 'id'>) => Promise<void>;
  updateAsistencia: (id: string, a: Partial<Asistencia>) => Promise<void>;

  // Disciplina CRUD
  addDisciplina: (d: Omit<Disciplina, 'id'>) => Promise<void>;
  updateDisciplina: (id: string, d: Partial<Disciplina>) => Promise<void>;
  deleteDisciplina: (id: string) => Promise<void>;

  // Eventos CRUD
  addEvento: (e: Omit<Evento, 'id'>) => Promise<void>;
  updateEvento: (id: string, e: Partial<Evento>) => Promise<void>;
  deleteEvento: (id: string) => Promise<void>;

  // Actividades CRUD
  addActividad: (a: Omit<Actividad, 'id'>) => Promise<void>;
  updateActividad: (id: string, a: Partial<Actividad>) => Promise<void>;
  deleteActividad: (id: string) => Promise<void>;

  // Posts CRUD
  addPost: (p: Omit<Post, 'id'>) => Promise<void>;
  updatePost: (id: string, p: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;

  // AppUsers CRUD
  addAppUser: (u: Omit<AppUser, 'id'>) => Promise<void>;
  updateAppUser: (id: string, u: Partial<AppUser>) => Promise<void>;
  deleteAppUser: (id: string) => Promise<void>;

  // LearningCores CRUD
  addLearningCore: (lc: Omit<LearningCore, 'id'>) => Promise<void>;
  updateLearningCore: (id: string, lc: Partial<LearningCore>) => Promise<void>;
  deleteLearningCore: (id: string) => Promise<void>;

  // Evaluations CRUD
  addEvaluation: (ev: Omit<Evaluation, 'id'>) => Promise<void>;
  updateEvaluation: (id: string, ev: Partial<Evaluation>) => Promise<void>;
  deleteEvaluation: (id: string) => Promise<void>;

  // EvaluationGrades CRUD
  addEvaluationGrade: (eg: Omit<EvaluationGrade, 'id'>) => Promise<void>;
  updateEvaluationGrade: (id: string, eg: Partial<EvaluationGrade>) => Promise<void>;

  // PriorityContents
  addPriorityContent: (c: PriorityContent) => Promise<void>;
  updatePriorityContent: (id: string, data: Partial<PriorityContent>) => Promise<void>;
  deletePriorityContent: (id: string) => Promise<void>;

  // WorkedLearnings
  addWorkedLearning: (l: WorkedLearning) => Promise<void>;
  updateWorkedLearning: (id: string, data: Partial<WorkedLearning>) => Promise<void>;
  deleteWorkedLearning: (id: string) => Promise<void>;

  // SimpleGrades
  upsertSimpleGrade: (grade: SimpleGrade) => Promise<void>;

  // Selectors
  getStudentPosts: (studentId: string) => Post[];
  getStudentGrades: (studentId: string) => Calificacion[];
  getStudentAbsences: (studentId: string) => Asistencia[];
  getTeacherSubjects: (teacherId: string) => Materia[];
  getTeacherPosts: (teacherId: string) => Post[];
  getPreceptorStudents: (preceptorId: string) => Estudiante[];
  getCoreStatus: (studentId: string, coreId: string) => CoreStatus;
}

export const useAppStore = create<AppState>()((set, get) => ({
  estudiantes: [],
  docentes: [],
  cursos: [],
  materias: [],
  calificaciones: [],
  asistencias: [],
  disciplina: [],
  eventos: [],
  actividades: [],
  posts: [],
  appUsers: [],
  learningCores: [],
  evaluations: [],
  evaluationGrades: [],
  priorityContents: [],
  workedLearnings: [],
  simpleGrades: [],
  dataLoaded: false,

  loadAllData: async () => {
    const [
      { data: est }, { data: doc }, { data: cur }, { data: mat },
      { data: cal }, { data: asi }, { data: dis }, { data: ev },
      { data: act }, { data: pos }, { data: usr }, { data: lc },
      { data: eva }, { data: eg }, { data: pc }, { data: wl }, { data: sg },
    ] = await Promise.all([
      supabase.from('estudiantes').select('*'),
      supabase.from('docentes').select('*'),
      supabase.from('cursos').select('*'),
      supabase.from('materias').select('*'),
      supabase.from('calificaciones').select('*'),
      supabase.from('asistencias').select('*'),
      supabase.from('disciplina').select('*'),
      supabase.from('eventos').select('*'),
      supabase.from('actividades').select('*'),
      supabase.from('posts').select('*'),
      supabase.from('app_users').select('*'),
      supabase.from('learning_cores').select('*'),
      supabase.from('evaluations').select('*'),
      supabase.from('evaluation_grades').select('*'),
      supabase.from('priority_contents').select('*'),
      supabase.from('worked_learnings').select('*'),
      supabase.from('simple_grades').select('*'),
    ]);
    set({
      estudiantes: (est ?? []).map(mapEst),
      docentes: (doc ?? []).map(mapDoc),
      cursos: (cur ?? []).map(mapCurso),
      materias: (mat ?? []).map(mapMateria),
      calificaciones: (cal ?? []).map(mapCal),
      asistencias: (asi ?? []).map(mapAsist),
      disciplina: (dis ?? []).map(mapDisc),
      eventos: (ev ?? []).map(mapEvento),
      actividades: (act ?? []).map(mapActiv),
      posts: (pos ?? []).map(mapPost),
      appUsers: (usr ?? []).map(mapAppUser),
      learningCores: (lc ?? []).map(mapLc),
      evaluations: (eva ?? []).map(mapEval),
      evaluationGrades: (eg ?? []).map(mapEvalGrade),
      priorityContents: (pc ?? []).map(mapPc),
      workedLearnings: (wl ?? []).map(mapWl),
      simpleGrades: (sg ?? []).map(mapSg),
      dataLoaded: true,
    });
  },

  // ---- Estudiantes ----
  addEstudiante: async (e) => {
    const id = genId();
    const row = { id, nombre: e.nombre, apellido: e.apellido, dni: e.dni, email: e.email, telefono: e.telefono, curso: e.curso, turno: e.turno, fecha_nacimiento: e.fechaNacimiento, activo: e.activo, photo: e.photo, tutor: e.tutor, telefono_tutor: e.telefonoTutor, direccion: e.direccion };
    await supabase.from('estudiantes').insert(row);
    set(s => ({ estudiantes: [...s.estudiantes, { ...e, id }] }));
  },
  updateEstudiante: async (id, e) => {
    const row: any = {};
    if (e.nombre !== undefined) row.nombre = e.nombre;
    if (e.apellido !== undefined) row.apellido = e.apellido;
    if (e.dni !== undefined) row.dni = e.dni;
    if (e.email !== undefined) row.email = e.email;
    if (e.telefono !== undefined) row.telefono = e.telefono;
    if (e.curso !== undefined) row.curso = e.curso;
    if (e.turno !== undefined) row.turno = e.turno;
    if (e.fechaNacimiento !== undefined) row.fecha_nacimiento = e.fechaNacimiento;
    if (e.activo !== undefined) row.activo = e.activo;
    if (e.photo !== undefined) row.photo = e.photo;
    if (e.tutor !== undefined) row.tutor = e.tutor;
    if (e.telefonoTutor !== undefined) row.telefono_tutor = e.telefonoTutor;
    if (e.direccion !== undefined) row.direccion = e.direccion;
    await supabase.from('estudiantes').update(row).eq('id', id);
    set(s => ({ estudiantes: s.estudiantes.map(x => x.id === id ? { ...x, ...e } : x) }));
  },
  deleteEstudiante: async (id) => {
    await supabase.from('estudiantes').delete().eq('id', id);
    set(s => ({ estudiantes: s.estudiantes.filter(x => x.id !== id) }));
  },

  // ---- Docentes ----
  addDocente: async (d) => {
    const id = genId();
    await supabase.from('docentes').insert({ id, nombre: d.nombre, apellido: d.apellido, dni: d.dni, email: d.email, telefono: d.telefono, materias: d.materias, activo: d.activo });
    set(s => ({ docentes: [...s.docentes, { ...d, id }] }));
  },
  updateDocente: async (id, d) => {
    const row: any = {};
    if (d.nombre !== undefined) row.nombre = d.nombre;
    if (d.apellido !== undefined) row.apellido = d.apellido;
    if (d.dni !== undefined) row.dni = d.dni;
    if (d.email !== undefined) row.email = d.email;
    if (d.telefono !== undefined) row.telefono = d.telefono;
    if (d.materias !== undefined) row.materias = d.materias;
    if (d.activo !== undefined) row.activo = d.activo;
    await supabase.from('docentes').update(row).eq('id', id);
    set(s => ({ docentes: s.docentes.map(x => x.id === id ? { ...x, ...d } : x) }));
  },
  deleteDocente: async (id) => {
    await supabase.from('docentes').delete().eq('id', id);
    set(s => ({ docentes: s.docentes.filter(x => x.id !== id) }));
  },

  // ---- Cursos ----
  addCurso: async (c) => {
    const id = genId();
    await supabase.from('cursos').insert({ id, nombre: c.nombre, division: c.division, turno: c.turno, nivel: c.nivel, docente_id: c.docenteId, estudiantes_ids: c.estudiantesIds });
    set(s => ({ cursos: [...s.cursos, { ...c, id }] }));
  },
  updateCurso: async (id, c) => {
    const row: any = {};
    if (c.nombre !== undefined) row.nombre = c.nombre;
    if (c.division !== undefined) row.division = c.division;
    if (c.turno !== undefined) row.turno = c.turno;
    if (c.nivel !== undefined) row.nivel = c.nivel;
    if (c.docenteId !== undefined) row.docente_id = c.docenteId;
    if (c.estudiantesIds !== undefined) row.estudiantes_ids = c.estudiantesIds;
    await supabase.from('cursos').update(row).eq('id', id);
    set(s => ({ cursos: s.cursos.map(x => x.id === id ? { ...x, ...c } : x) }));
  },
  deleteCurso: async (id) => {
    await supabase.from('cursos').delete().eq('id', id);
    set(s => ({ cursos: s.cursos.filter(x => x.id !== id) }));
  },

  // ---- Materias ----
  addMateria: async (m) => {
    const id = genId();
    await supabase.from('materias').insert({ id, nombre: m.nombre, curso_id: m.cursoId, docente_id: m.docenteId, horas_semanal: m.horasSemanal, descripcion: m.descripcion });
    set(s => ({ materias: [...s.materias, { ...m, id }] }));
  },
  updateMateria: async (id, m) => {
    const row: any = {};
    if (m.nombre !== undefined) row.nombre = m.nombre;
    if (m.cursoId !== undefined) row.curso_id = m.cursoId;
    if (m.docenteId !== undefined) row.docente_id = m.docenteId;
    if (m.horasSemanal !== undefined) row.horas_semanal = m.horasSemanal;
    if (m.descripcion !== undefined) row.descripcion = m.descripcion;
    await supabase.from('materias').update(row).eq('id', id);
    set(s => ({ materias: s.materias.map(x => x.id === id ? { ...x, ...m } : x) }));
  },
  deleteMateria: async (id) => {
    await supabase.from('materias').delete().eq('id', id);
    set(s => ({ materias: s.materias.filter(x => x.id !== id) }));
  },

  // ---- Calificaciones ----
  addCalificacion: async (c) => {
    const id = genId();
    await supabase.from('calificaciones').insert({ id, estudiante_id: c.estudianteId, materia_id: c.materiaId, nota: c.nota, tipo: c.tipo, fecha: c.fecha, trimestre: c.trimestre, descripcion: c.descripcion, docente_id: c.docenteId });
    set(s => ({ calificaciones: [...s.calificaciones, { ...c, id }] }));
  },
  updateCalificacion: async (id, c) => {
    const row: any = {};
    if (c.estudianteId !== undefined) row.estudiante_id = c.estudianteId;
    if (c.materiaId !== undefined) row.materia_id = c.materiaId;
    if (c.nota !== undefined) row.nota = c.nota;
    if (c.tipo !== undefined) row.tipo = c.tipo;
    if (c.fecha !== undefined) row.fecha = c.fecha;
    if (c.trimestre !== undefined) row.trimestre = c.trimestre;
    if (c.descripcion !== undefined) row.descripcion = c.descripcion;
    if (c.docenteId !== undefined) row.docente_id = c.docenteId;
    await supabase.from('calificaciones').update(row).eq('id', id);
    set(s => ({ calificaciones: s.calificaciones.map(x => x.id === id ? { ...x, ...c } : x) }));
  },
  deleteCalificacion: async (id) => {
    await supabase.from('calificaciones').delete().eq('id', id);
    set(s => ({ calificaciones: s.calificaciones.filter(x => x.id !== id) }));
  },

  // ---- Asistencias ----
  addAsistencia: async (a) => {
    const id = genId();
    await supabase.from('asistencias').insert({ id, estudiante_id: a.estudianteId, curso_id: a.cursoId, fecha: a.fecha, presente: a.presente, justificada: a.justificada, observacion: a.observacion });
    set(s => ({ asistencias: [...s.asistencias, { ...a, id }] }));
  },
  updateAsistencia: async (id, a) => {
    const row: any = {};
    if (a.estudianteId !== undefined) row.estudiante_id = a.estudianteId;
    if (a.cursoId !== undefined) row.curso_id = a.cursoId;
    if (a.fecha !== undefined) row.fecha = a.fecha;
    if (a.presente !== undefined) row.presente = a.presente;
    if (a.justificada !== undefined) row.justificada = a.justificada;
    if (a.observacion !== undefined) row.observacion = a.observacion;
    await supabase.from('asistencias').update(row).eq('id', id);
    set(s => ({ asistencias: s.asistencias.map(x => x.id === id ? { ...x, ...a } : x) }));
  },

  // ---- Disciplina ----
  addDisciplina: async (d) => {
    const id = genId();
    await supabase.from('disciplina').insert({ id, estudiante_id: d.estudianteId, tipo: d.tipo, descripcion: d.descripcion, fecha: d.fecha, docente_id: d.docenteId, preceptor_id: d.preceptorId, resuelto: d.resuelto });
    set(s => ({ disciplina: [...s.disciplina, { ...d, id }] }));
  },
  updateDisciplina: async (id, d) => {
    const row: any = {};
    if (d.estudianteId !== undefined) row.estudiante_id = d.estudianteId;
    if (d.tipo !== undefined) row.tipo = d.tipo;
    if (d.descripcion !== undefined) row.descripcion = d.descripcion;
    if (d.fecha !== undefined) row.fecha = d.fecha;
    if (d.docenteId !== undefined) row.docente_id = d.docenteId;
    if (d.preceptorId !== undefined) row.preceptor_id = d.preceptorId;
    if (d.resuelto !== undefined) row.resuelto = d.resuelto;
    await supabase.from('disciplina').update(row).eq('id', id);
    set(s => ({ disciplina: s.disciplina.map(x => x.id === id ? { ...x, ...d } : x) }));
  },
  deleteDisciplina: async (id) => {
    await supabase.from('disciplina').delete().eq('id', id);
    set(s => ({ disciplina: s.disciplina.filter(x => x.id !== id) }));
  },

  // ---- Eventos ----
  addEvento: async (e) => {
    const id = genId();
    await supabase.from('eventos').insert({ id, titulo: e.titulo, descripcion: e.descripcion, fecha: e.fecha, fecha_fin: e.fechaFin, tipo: e.tipo, curso_id: e.cursoId, color: e.color });
    set(s => ({ eventos: [...s.eventos, { ...e, id }] }));
  },
  updateEvento: async (id, e) => {
    const row: any = {};
    if (e.titulo !== undefined) row.titulo = e.titulo;
    if (e.descripcion !== undefined) row.descripcion = e.descripcion;
    if (e.fecha !== undefined) row.fecha = e.fecha;
    if (e.fechaFin !== undefined) row.fecha_fin = e.fechaFin;
    if (e.tipo !== undefined) row.tipo = e.tipo;
    if (e.cursoId !== undefined) row.curso_id = e.cursoId;
    if (e.color !== undefined) row.color = e.color;
    await supabase.from('eventos').update(row).eq('id', id);
    set(s => ({ eventos: s.eventos.map(x => x.id === id ? { ...x, ...e } : x) }));
  },
  deleteEvento: async (id) => {
    await supabase.from('eventos').delete().eq('id', id);
    set(s => ({ eventos: s.eventos.filter(x => x.id !== id) }));
  },

  // ---- Actividades ----
  addActividad: async (a) => {
    const id = genId();
    await supabase.from('actividades').insert({ id, titulo: a.titulo, descripcion: a.descripcion, materia_id: a.materiaId, docente_id: a.docenteId, tipo: a.tipo, fecha_entrega: a.fechaEntrega, fecha_publicacion: a.fechaPublicacion, archivo: a.archivo });
    set(s => ({ actividades: [...s.actividades, { ...a, id }] }));
  },
  updateActividad: async (id, a) => {
    const row: any = {};
    if (a.titulo !== undefined) row.titulo = a.titulo;
    if (a.descripcion !== undefined) row.descripcion = a.descripcion;
    if (a.materiaId !== undefined) row.materia_id = a.materiaId;
    if (a.docenteId !== undefined) row.docente_id = a.docenteId;
    if (a.tipo !== undefined) row.tipo = a.tipo;
    if (a.fechaEntrega !== undefined) row.fecha_entrega = a.fechaEntrega;
    if (a.fechaPublicacion !== undefined) row.fecha_publicacion = a.fechaPublicacion;
    if (a.archivo !== undefined) row.archivo = a.archivo;
    await supabase.from('actividades').update(row).eq('id', id);
    set(s => ({ actividades: s.actividades.map(x => x.id === id ? { ...x, ...a } : x) }));
  },
  deleteActividad: async (id) => {
    await supabase.from('actividades').delete().eq('id', id);
    set(s => ({ actividades: s.actividades.filter(x => x.id !== id) }));
  },

  // ---- Posts ----
  addPost: async (p) => {
    const id = genId();
    await supabase.from('posts').insert({ id, subject_id: p.subjectId, course_id: p.courseId, teacher_id: p.teacherId, title: p.title, content: p.content, images: p.images, attachments: p.attachments ?? [], created_at: p.createdAt, status: p.status });
    set(s => ({ posts: [...s.posts, { ...p, id }] }));
  },
  updatePost: async (id, p) => {
    const row: any = {};
    if (p.subjectId !== undefined) row.subject_id = p.subjectId;
    if (p.courseId !== undefined) row.course_id = p.courseId;
    if (p.teacherId !== undefined) row.teacher_id = p.teacherId;
    if (p.title !== undefined) row.title = p.title;
    if (p.content !== undefined) row.content = p.content;
    if (p.images !== undefined) row.images = p.images;
    if (p.attachments !== undefined) row.attachments = p.attachments;
    if (p.createdAt !== undefined) row.created_at = p.createdAt;
    if (p.status !== undefined) row.status = p.status;
    await supabase.from('posts').update(row).eq('id', id);
    set(s => ({ posts: s.posts.map(x => x.id === id ? { ...x, ...p } : x) }));
  },
  deletePost: async (id) => {
    await supabase.from('posts').delete().eq('id', id);
    set(s => ({ posts: s.posts.filter(x => x.id !== id) }));
  },

  // ---- AppUsers ----
  addAppUser: async (u) => {
    const id = genId();
    await supabase.from('app_users').insert({ id, username: u.username, password: u.password, role: u.role, linked_profile_id: u.linkedProfileId, is_active: u.isActive, created_at: u.createdAt });
    set(s => ({ appUsers: [...s.appUsers, { ...u, id }] }));
  },
  updateAppUser: async (id, u) => {
    const row: any = {};
    if (u.username !== undefined) row.username = u.username;
    if (u.password !== undefined) row.password = u.password;
    if (u.role !== undefined) row.role = u.role;
    if (u.linkedProfileId !== undefined) row.linked_profile_id = u.linkedProfileId;
    if (u.isActive !== undefined) row.is_active = u.isActive;
    await supabase.from('app_users').update(row).eq('id', id);
    set(s => ({ appUsers: s.appUsers.map(x => x.id === id ? { ...x, ...u } : x) }));
  },
  deleteAppUser: async (id) => {
    await supabase.from('app_users').delete().eq('id', id);
    set(s => ({ appUsers: s.appUsers.filter(x => x.id !== id) }));
  },

  // ---- LearningCores ----
  addLearningCore: async (lc) => {
    const id = genId();
    await supabase.from('learning_cores').insert({ id, subject_id: lc.subjectId, course_id: lc.courseId, teacher_id: lc.teacherId, title: lc.title, description: lc.description, period: lc.period, order: lc.order, is_active: lc.isActive });
    set(s => ({ learningCores: [...s.learningCores, { ...lc, id }] }));
  },
  updateLearningCore: async (id, lc) => {
    const row: any = {};
    if (lc.subjectId !== undefined) row.subject_id = lc.subjectId;
    if (lc.courseId !== undefined) row.course_id = lc.courseId;
    if (lc.teacherId !== undefined) row.teacher_id = lc.teacherId;
    if (lc.title !== undefined) row.title = lc.title;
    if (lc.description !== undefined) row.description = lc.description;
    if (lc.period !== undefined) row.period = lc.period;
    if (lc.order !== undefined) row.order = lc.order;
    if (lc.isActive !== undefined) row.is_active = lc.isActive;
    await supabase.from('learning_cores').update(row).eq('id', id);
    set(s => ({ learningCores: s.learningCores.map(x => x.id === id ? { ...x, ...lc } : x) }));
  },
  deleteLearningCore: async (id) => {
    await supabase.from('learning_cores').delete().eq('id', id);
    set(s => ({ learningCores: s.learningCores.filter(x => x.id !== id) }));
  },

  // ---- Evaluations ----
  addEvaluation: async (ev) => {
    const id = genId();
    await supabase.from('evaluations').insert({ id, learning_core_id: ev.learningCoreId, subject_id: ev.subjectId, course_id: ev.courseId, teacher_id: ev.teacherId, title: ev.title, description: ev.description, date: ev.date, type: ev.type, status: ev.status });
    set(s => ({ evaluations: [...s.evaluations, { ...ev, id }] }));
  },
  updateEvaluation: async (id, ev) => {
    const row: any = {};
    if (ev.learningCoreId !== undefined) row.learning_core_id = ev.learningCoreId;
    if (ev.subjectId !== undefined) row.subject_id = ev.subjectId;
    if (ev.courseId !== undefined) row.course_id = ev.courseId;
    if (ev.teacherId !== undefined) row.teacher_id = ev.teacherId;
    if (ev.title !== undefined) row.title = ev.title;
    if (ev.description !== undefined) row.description = ev.description;
    if (ev.date !== undefined) row.date = ev.date;
    if (ev.type !== undefined) row.type = ev.type;
    if (ev.status !== undefined) row.status = ev.status;
    await supabase.from('evaluations').update(row).eq('id', id);
    set(s => ({ evaluations: s.evaluations.map(x => x.id === id ? { ...x, ...ev } : x) }));
  },
  deleteEvaluation: async (id) => {
    await supabase.from('evaluations').delete().eq('id', id);
    set(s => ({ evaluations: s.evaluations.filter(x => x.id !== id) }));
  },

  // ---- EvaluationGrades ----
  addEvaluationGrade: async (eg) => {
    const id = genId();
    await supabase.from('evaluation_grades').insert({ id, student_id: eg.studentId, subject_id: eg.subjectId, course_id: eg.courseId, learning_core_id: eg.learningCoreId, evaluation_id: eg.evaluationId, instance_type: eg.instanceType, grade: eg.grade, date: eg.date, observation: eg.observation, teacher_id: eg.teacherId, visible_for_student: eg.visibleForStudent });
    set(s => ({ evaluationGrades: [...s.evaluationGrades, { ...eg, id }] }));
  },
  updateEvaluationGrade: async (id, eg) => {
    const row: any = {};
    if (eg.studentId !== undefined) row.student_id = eg.studentId;
    if (eg.subjectId !== undefined) row.subject_id = eg.subjectId;
    if (eg.courseId !== undefined) row.course_id = eg.courseId;
    if (eg.learningCoreId !== undefined) row.learning_core_id = eg.learningCoreId;
    if (eg.evaluationId !== undefined) row.evaluation_id = eg.evaluationId;
    if (eg.instanceType !== undefined) row.instance_type = eg.instanceType;
    if (eg.grade !== undefined) row.grade = eg.grade;
    if (eg.date !== undefined) row.date = eg.date;
    if (eg.observation !== undefined) row.observation = eg.observation;
    if (eg.teacherId !== undefined) row.teacher_id = eg.teacherId;
    if (eg.visibleForStudent !== undefined) row.visible_for_student = eg.visibleForStudent;
    await supabase.from('evaluation_grades').update(row).eq('id', id);
    set(s => ({ evaluationGrades: s.evaluationGrades.map(x => x.id === id ? { ...x, ...eg } : x) }));
  },

  // ---- PriorityContents ----
  addPriorityContent: async (c) => {
    await supabase.from('priority_contents').insert({ id: c.id, course_id: c.courseId, subject_id: c.subjectId, teacher_id: c.teacherId, school_year: c.schoolYear, period: c.period, learning_core_id: c.learningCoreId, title: c.title, order: c.order, is_active: c.isActive, created_at: c.createdAt });
    set(s => ({ priorityContents: [...s.priorityContents, c] }));
  },
  updatePriorityContent: async (id, data) => {
    const row: any = {};
    if (data.courseId !== undefined) row.course_id = data.courseId;
    if (data.subjectId !== undefined) row.subject_id = data.subjectId;
    if (data.teacherId !== undefined) row.teacher_id = data.teacherId;
    if (data.schoolYear !== undefined) row.school_year = data.schoolYear;
    if (data.period !== undefined) row.period = data.period;
    if (data.learningCoreId !== undefined) row.learning_core_id = data.learningCoreId;
    if (data.title !== undefined) row.title = data.title;
    if (data.order !== undefined) row.order = data.order;
    if (data.isActive !== undefined) row.is_active = data.isActive;
    await supabase.from('priority_contents').update(row).eq('id', id);
    set(s => ({ priorityContents: s.priorityContents.map(x => x.id === id ? { ...x, ...data } : x) }));
  },
  deletePriorityContent: async (id) => {
    await supabase.from('priority_contents').delete().eq('id', id);
    set(s => ({ priorityContents: s.priorityContents.filter(x => x.id !== id) }));
  },

  // ---- WorkedLearnings ----
  addWorkedLearning: async (l) => {
    await supabase.from('worked_learnings').insert({ id: l.id, priority_content_id: l.priorityContentId, course_id: l.courseId, subject_id: l.subjectId, teacher_id: l.teacherId, description: l.description, order: l.order, is_active: l.isActive, created_at: l.createdAt });
    set(s => ({ workedLearnings: [...s.workedLearnings, l] }));
  },
  updateWorkedLearning: async (id, data) => {
    const row: any = {};
    if (data.priorityContentId !== undefined) row.priority_content_id = data.priorityContentId;
    if (data.courseId !== undefined) row.course_id = data.courseId;
    if (data.subjectId !== undefined) row.subject_id = data.subjectId;
    if (data.teacherId !== undefined) row.teacher_id = data.teacherId;
    if (data.description !== undefined) row.description = data.description;
    if (data.order !== undefined) row.order = data.order;
    if (data.isActive !== undefined) row.is_active = data.isActive;
    await supabase.from('worked_learnings').update(row).eq('id', id);
    set(s => ({ workedLearnings: s.workedLearnings.map(x => x.id === id ? { ...x, ...data } : x) }));
  },
  deleteWorkedLearning: async (id) => {
    await supabase.from('worked_learnings').delete().eq('id', id);
    set(s => ({ workedLearnings: s.workedLearnings.filter(x => x.id !== id) }));
  },

  // ---- SimpleGrades ----
  upsertSimpleGrade: async (grade) => {
    await supabase.from('simple_grades').upsert({
      id: grade.id,
      student_id: grade.studentId,
      course_id: grade.courseId,
      subject_id: grade.subjectId,
      teacher_id: grade.teacherId,
      school_year: grade.schoolYear,
      evaluation_number: grade.evaluationNumber,
      grade: grade.grade,
      recovery_one_grade: grade.recoveryOneGrade,
      recovery_two_grade: grade.recoveryTwoGrade,
      observation: grade.observation,
      updated_at: grade.updatedAt,
    }, { onConflict: 'student_id,course_id,subject_id,school_year,evaluation_number' });
    set(s => {
      const idx = s.simpleGrades.findIndex(g =>
        g.studentId === grade.studentId &&
        g.courseId === grade.courseId &&
        g.subjectId === grade.subjectId &&
        g.schoolYear === grade.schoolYear &&
        g.evaluationNumber === grade.evaluationNumber
      );
      if (idx >= 0) {
        const updated = [...s.simpleGrades];
        updated[idx] = grade;
        return { simpleGrades: updated };
      }
      return { simpleGrades: [...s.simpleGrades, grade] };
    });
  },

  // ---- Selectors ----
  getStudentPosts: (studentId) => {
    const { posts, estudiantes, materias } = get();
    const student = estudiantes.find(e => e.id === studentId);
    if (!student) return [];
    const subjectIds = materias.filter(m => m.cursoId === student.curso).map(m => m.id);
    return posts.filter(p => subjectIds.includes(p.subjectId) && p.status === 'published');
  },
  getStudentGrades: (studentId) => get().calificaciones.filter(c => c.estudianteId === studentId),
  getStudentAbsences: (studentId) => get().asistencias.filter(a => a.estudianteId === studentId),
  getTeacherSubjects: (teacherId) => get().materias.filter(m => m.docenteId === teacherId),
  getTeacherPosts: (teacherId) => get().posts.filter(p => p.teacherId === teacherId),
  getPreceptorStudents: () => get().estudiantes,
  getCoreStatus: (studentId, coreId): CoreStatus => {
    const grades = get().evaluationGrades.filter(g => g.studentId === studentId && g.learningCoreId === coreId);
    const main = grades.find(g => g.instanceType === 'evaluacion_principal');
    const r1 = grades.find(g => g.instanceType === 'recuperatorio_1');
    const r2 = grades.find(g => g.instanceType === 'recuperatorio_2');
    if (main && main.grade >= 6) return 'Aprobado';
    if (r1 && r1.grade >= 6) return 'Aprobado';
    if (r2 && r2.grade >= 6) return 'Aprobado';
    if (r2 && r2.grade < 6) return 'No aprobado';
    if (r1 && r1.grade < 6) return 'Recuperatorio 2 pendiente';
    if (main && main.grade < 6) return 'Debe recuperar';
    return 'En proceso';
  },
}));
