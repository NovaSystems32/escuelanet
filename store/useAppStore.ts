import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Estudiante, Docente, Curso, Materia, Calificacion,
  Asistencia, Disciplina, Evento, Actividad
} from '@/types';
import {
  MOCK_ESTUDIANTES, MOCK_DOCENTES, MOCK_CURSOS, MOCK_MATERIAS,
  MOCK_CALIFICACIONES, MOCK_ASISTENCIAS, MOCK_DISCIPLINA,
  MOCK_EVENTOS, MOCK_ACTIVIDADES
} from '@/lib/mockData';

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

  // Estudiantes CRUD
  addEstudiante: (e: Omit<Estudiante, 'id'>) => void;
  updateEstudiante: (id: string, e: Partial<Estudiante>) => void;
  deleteEstudiante: (id: string) => void;

  // Docentes CRUD
  addDocente: (d: Omit<Docente, 'id'>) => void;
  updateDocente: (id: string, d: Partial<Docente>) => void;
  deleteDocente: (id: string) => void;

  // Cursos CRUD
  addCurso: (c: Omit<Curso, 'id'>) => void;
  updateCurso: (id: string, c: Partial<Curso>) => void;
  deleteCurso: (id: string) => void;

  // Materias CRUD
  addMateria: (m: Omit<Materia, 'id'>) => void;
  updateMateria: (id: string, m: Partial<Materia>) => void;
  deleteMateria: (id: string) => void;

  // Calificaciones CRUD
  addCalificacion: (c: Omit<Calificacion, 'id'>) => void;
  updateCalificacion: (id: string, c: Partial<Calificacion>) => void;
  deleteCalificacion: (id: string) => void;

  // Asistencias CRUD
  addAsistencia: (a: Omit<Asistencia, 'id'>) => void;
  updateAsistencia: (id: string, a: Partial<Asistencia>) => void;

  // Disciplina CRUD
  addDisciplina: (d: Omit<Disciplina, 'id'>) => void;
  updateDisciplina: (id: string, d: Partial<Disciplina>) => void;
  deleteDisciplina: (id: string) => void;

  // Eventos CRUD
  addEvento: (e: Omit<Evento, 'id'>) => void;
  updateEvento: (id: string, e: Partial<Evento>) => void;
  deleteEvento: (id: string) => void;

  // Actividades CRUD
  addActividad: (a: Omit<Actividad, 'id'>) => void;
  updateActividad: (id: string, a: Partial<Actividad>) => void;
  deleteActividad: (id: string) => void;
}

const genId = () => Math.random().toString(36).substr(2, 9);

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      estudiantes: MOCK_ESTUDIANTES,
      docentes: MOCK_DOCENTES,
      cursos: MOCK_CURSOS,
      materias: MOCK_MATERIAS,
      calificaciones: MOCK_CALIFICACIONES,
      asistencias: MOCK_ASISTENCIAS,
      disciplina: MOCK_DISCIPLINA,
      eventos: MOCK_EVENTOS,
      actividades: MOCK_ACTIVIDADES,

      addEstudiante: (e) => set((s) => ({ estudiantes: [...s.estudiantes, { ...e, id: genId() }] })),
      updateEstudiante: (id, e) => set((s) => ({ estudiantes: s.estudiantes.map(x => x.id === id ? { ...x, ...e } : x) })),
      deleteEstudiante: (id) => set((s) => ({ estudiantes: s.estudiantes.filter(x => x.id !== id) })),

      addDocente: (d) => set((s) => ({ docentes: [...s.docentes, { ...d, id: genId() }] })),
      updateDocente: (id, d) => set((s) => ({ docentes: s.docentes.map(x => x.id === id ? { ...x, ...d } : x) })),
      deleteDocente: (id) => set((s) => ({ docentes: s.docentes.filter(x => x.id !== id) })),

      addCurso: (c) => set((s) => ({ cursos: [...s.cursos, { ...c, id: genId() }] })),
      updateCurso: (id, c) => set((s) => ({ cursos: s.cursos.map(x => x.id === id ? { ...x, ...c } : x) })),
      deleteCurso: (id) => set((s) => ({ cursos: s.cursos.filter(x => x.id !== id) })),

      addMateria: (m) => set((s) => ({ materias: [...s.materias, { ...m, id: genId() }] })),
      updateMateria: (id, m) => set((s) => ({ materias: s.materias.map(x => x.id === id ? { ...x, ...m } : x) })),
      deleteMateria: (id) => set((s) => ({ materias: s.materias.filter(x => x.id !== id) })),

      addCalificacion: (c) => set((s) => ({ calificaciones: [...s.calificaciones, { ...c, id: genId() }] })),
      updateCalificacion: (id, c) => set((s) => ({ calificaciones: s.calificaciones.map(x => x.id === id ? { ...x, ...c } : x) })),
      deleteCalificacion: (id) => set((s) => ({ calificaciones: s.calificaciones.filter(x => x.id !== id) })),

      addAsistencia: (a) => set((s) => ({ asistencias: [...s.asistencias, { ...a, id: genId() }] })),
      updateAsistencia: (id, a) => set((s) => ({ asistencias: s.asistencias.map(x => x.id === id ? { ...x, ...a } : x) })),

      addDisciplina: (d) => set((s) => ({ disciplina: [...s.disciplina, { ...d, id: genId() }] })),
      updateDisciplina: (id, d) => set((s) => ({ disciplina: s.disciplina.map(x => x.id === id ? { ...x, ...d } : x) })),
      deleteDisciplina: (id) => set((s) => ({ disciplina: s.disciplina.filter(x => x.id !== id) })),

      addEvento: (e) => set((s) => ({ eventos: [...s.eventos, { ...e, id: genId() }] })),
      updateEvento: (id, e) => set((s) => ({ eventos: s.eventos.map(x => x.id === id ? { ...x, ...e } : x) })),
      deleteEvento: (id) => set((s) => ({ eventos: s.eventos.filter(x => x.id !== id) })),

      addActividad: (a) => set((s) => ({ actividades: [...s.actividades, { ...a, id: genId() }] })),
      updateActividad: (id, a) => set((s) => ({ actividades: s.actividades.map(x => x.id === id ? { ...x, ...a } : x) })),
      deleteActividad: (id) => set((s) => ({ actividades: s.actividades.filter(x => x.id !== id) })),
    }),
    {
      name: 'escuelanet-data',
    }
  )
);
