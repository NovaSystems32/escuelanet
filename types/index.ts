export type Role = 'admin' | 'docente' | 'estudiante' | 'preceptor' | 'directivo' | 'tutor';

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: Role;
  avatar?: string;
}

export interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  curso: string;
  turno: 'mañana' | 'tarde';
  fechaNacimiento: string;
  activo: boolean;
  photo?: string;
  tutor?: string;
  telefonoTutor?: string;
  direccion?: string;
}

export interface Docente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  materias: string[];
  activo: boolean;
}

export interface Curso {
  id: string;
  nombre: string;
  division: string;
  turno: 'mañana' | 'tarde';
  nivel: string;
  docenteId?: string;
  estudiantesIds: string[];
}

export interface Materia {
  id: string;
  nombre: string;
  cursoId: string;
  docenteId: string;
  horasSemanal: number;
  descripcion?: string;
}

export interface Calificacion {
  id: string;
  estudianteId: string;
  materiaId: string;
  nota: number;
  tipo: 'parcial' | 'trabajo_practico' | 'examen_final' | 'oral';
  fecha: string;
  trimestre: 1 | 2 | 3;
  descripcion?: string;
  docenteId: string;
}

export interface Asistencia {
  id: string;
  estudianteId: string;
  cursoId: string;
  fecha: string;
  presente: boolean;
  justificada?: boolean;
  observacion?: string;
}

export interface Disciplina {
  id: string;
  estudianteId: string;
  tipo: 'observacion' | 'apercibimiento' | 'suspension' | 'felicitacion';
  descripcion: string;
  fecha: string;
  docenteId?: string;
  preceptorId?: string;
  resuelto: boolean;
}

export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  fechaFin?: string;
  tipo: 'examen' | 'reunion' | 'feriado' | 'actividad' | 'entrega';
  cursoId?: string;
  color: string;
}

export interface Actividad {
  id: string;
  titulo: string;
  descripcion: string;
  materiaId: string;
  docenteId: string;
  tipo: 'tarea' | 'material' | 'actividad';
  fechaEntrega?: string;
  fechaPublicacion: string;
  archivo?: string;
}

export interface Post {
  id: string;
  subjectId: string;
  courseId: string;
  teacherId: string;
  title: string;
  content: string;
  images: string[];
  attachments?: string[];
  createdAt: string;
  status: 'published' | 'draft' | 'archived';
}

export interface AppUser {
  id: string;
  username: string;
  password: string;
  role: Role;
  linkedProfileId: string;
  isActive: boolean;
  createdAt: string;
}

export interface AulaVirtual {
  id: string;
  materiaId: string;
  nombre: string;
  descripcion: string;
  actividades: Actividad[];
}
