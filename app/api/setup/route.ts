import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import {
  MOCK_ESTUDIANTES, MOCK_DOCENTES, MOCK_CURSOS, MOCK_MATERIAS,
  MOCK_CALIFICACIONES, MOCK_ASISTENCIAS, MOCK_DISCIPLINA,
  MOCK_EVENTOS, MOCK_ACTIVIDADES, MOCK_POSTS, MOCK_APP_USERS,
  MOCK_LEARNING_CORES, MOCK_EVALUATIONS, MOCK_EVALUATION_GRADES,
  MOCK_PRIORITY_CONTENTS, MOCK_WORKED_LEARNINGS, MOCK_SIMPLE_GRADES
} from '@/lib/mockData';

const DEMO_USERS = [
  { email: 'admin@escuelanet.edu', password: 'admin123', nombre: 'Administrador', rol: 'admin' },
  { email: 'docente@escuelanet.edu', password: 'docente123', nombre: 'Prof. García', rol: 'docente' },
  { email: 'estudiante@escuelanet.edu', password: 'estudiante123', nombre: 'Lucas Rodríguez', rol: 'estudiante' },
  { email: 'preceptor@escuelanet.edu', password: 'preceptor123', nombre: 'Sra. Martínez', rol: 'preceptor' },
];

export async function POST() {
  try {
    const results: string[] = [];

    // 1. Create auth users and profiles
    for (const demo of DEMO_USERS) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: demo.email,
        password: demo.password,
        email_confirm: true,
      });
      if (error && !error.message.includes('already been registered')) {
        results.push(`Auth user ${demo.email}: ERROR - ${error.message}`);
        continue;
      }
      const userId = data?.user?.id;
      if (userId) {
        await supabaseAdmin.from('profiles').upsert({
          id: userId,
          nombre: demo.nombre,
          email: demo.email,
          rol: demo.rol,
        });
        results.push(`Auth user ${demo.email}: OK`);
      } else {
        results.push(`Auth user ${demo.email}: already exists`);
      }
    }

    // 2. Seed all tables
    const tables = [
      { name: 'estudiantes', data: MOCK_ESTUDIANTES.map(e => ({
        id: e.id, nombre: e.nombre, apellido: e.apellido, dni: e.dni,
        email: e.email, telefono: e.telefono, curso: e.curso, turno: e.turno,
        fecha_nacimiento: e.fechaNacimiento, activo: e.activo, photo: e.photo,
        tutor: e.tutor, telefono_tutor: e.telefonoTutor, direccion: e.direccion,
      })) },
      { name: 'docentes', data: MOCK_DOCENTES.map(d => ({
        id: d.id, nombre: d.nombre, apellido: d.apellido, dni: d.dni,
        email: d.email, telefono: d.telefono, materias: d.materias, activo: d.activo,
      })) },
      { name: 'cursos', data: MOCK_CURSOS.map(c => ({
        id: c.id, nombre: c.nombre, division: c.division, turno: c.turno,
        nivel: c.nivel, docente_id: c.docenteId, estudiantes_ids: c.estudiantesIds,
      })) },
      { name: 'materias', data: MOCK_MATERIAS.map(m => ({
        id: m.id, nombre: m.nombre, curso_id: m.cursoId, docente_id: m.docenteId,
        horas_semanal: m.horasSemanal, descripcion: m.descripcion,
      })) },
      { name: 'calificaciones', data: MOCK_CALIFICACIONES.map(c => ({
        id: c.id, estudiante_id: c.estudianteId, materia_id: c.materiaId,
        nota: c.nota, tipo: c.tipo, fecha: c.fecha, trimestre: c.trimestre,
        descripcion: c.descripcion, docente_id: c.docenteId,
      })) },
      { name: 'asistencias', data: MOCK_ASISTENCIAS.map(a => ({
        id: a.id, estudiante_id: a.estudianteId, curso_id: a.cursoId,
        fecha: a.fecha, presente: a.presente, justificada: a.justificada,
        observacion: a.observacion,
      })) },
      { name: 'disciplina', data: MOCK_DISCIPLINA.map(d => ({
        id: d.id, estudiante_id: d.estudianteId, tipo: d.tipo,
        descripcion: d.descripcion, fecha: d.fecha,
        docente_id: d.docenteId, preceptor_id: d.preceptorId, resuelto: d.resuelto,
      })) },
      { name: 'eventos', data: MOCK_EVENTOS.map(e => ({
        id: e.id, titulo: e.titulo, descripcion: e.descripcion,
        fecha: e.fecha, fecha_fin: e.fechaFin, tipo: e.tipo,
        curso_id: e.cursoId, color: e.color,
      })) },
      { name: 'actividades', data: MOCK_ACTIVIDADES.map(a => ({
        id: a.id, titulo: a.titulo, descripcion: a.descripcion,
        materia_id: a.materiaId, docente_id: a.docenteId, tipo: a.tipo,
        fecha_entrega: a.fechaEntrega, fecha_publicacion: a.fechaPublicacion,
        archivo: a.archivo,
      })) },
      { name: 'posts', data: MOCK_POSTS.map(p => ({
        id: p.id, subject_id: p.subjectId, course_id: p.courseId,
        teacher_id: p.teacherId, title: p.title, content: p.content,
        images: p.images, attachments: p.attachments ?? [],
        created_at: p.createdAt, status: p.status,
      })) },
      { name: 'app_users', data: MOCK_APP_USERS.map(u => ({
        id: u.id, username: u.username, password: u.password,
        role: u.role, linked_profile_id: u.linkedProfileId,
        is_active: u.isActive, created_at: u.createdAt,
      })) },
      { name: 'learning_cores', data: MOCK_LEARNING_CORES.map(lc => ({
        id: lc.id, subject_id: lc.subjectId, course_id: lc.courseId,
        teacher_id: lc.teacherId, title: lc.title, description: lc.description,
        period: lc.period, order: lc.order, is_active: lc.isActive,
      })) },
      { name: 'evaluations', data: MOCK_EVALUATIONS.map(ev => ({
        id: ev.id, learning_core_id: ev.learningCoreId, subject_id: ev.subjectId,
        course_id: ev.courseId, teacher_id: ev.teacherId, title: ev.title,
        description: ev.description, date: ev.date, type: ev.type, status: ev.status,
      })) },
      { name: 'evaluation_grades', data: MOCK_EVALUATION_GRADES.map(eg => ({
        id: eg.id, student_id: eg.studentId, subject_id: eg.subjectId,
        course_id: eg.courseId, learning_core_id: eg.learningCoreId,
        evaluation_id: eg.evaluationId, instance_type: eg.instanceType,
        grade: eg.grade, date: eg.date, observation: eg.observation,
        teacher_id: eg.teacherId, visible_for_student: eg.visibleForStudent,
      })) },
      { name: 'priority_contents', data: MOCK_PRIORITY_CONTENTS.map(pc => ({
        id: pc.id, course_id: pc.courseId, subject_id: pc.subjectId,
        teacher_id: pc.teacherId, school_year: pc.schoolYear, period: pc.period,
        learning_core_id: pc.learningCoreId, title: pc.title,
        order: pc.order, is_active: pc.isActive, created_at: pc.createdAt,
      })) },
      { name: 'worked_learnings', data: MOCK_WORKED_LEARNINGS.map(wl => ({
        id: wl.id, priority_content_id: wl.priorityContentId,
        course_id: wl.courseId, subject_id: wl.subjectId,
        teacher_id: wl.teacherId, description: wl.description,
        order: wl.order, is_active: wl.isActive, created_at: wl.createdAt,
      })) },
      { name: 'simple_grades', data: MOCK_SIMPLE_GRADES.map(sg => ({
        id: sg.id, student_id: sg.studentId, course_id: sg.courseId,
        subject_id: sg.subjectId, teacher_id: sg.teacherId,
        school_year: sg.schoolYear, evaluation_number: sg.evaluationNumber,
        grade: sg.grade, recovery_one_grade: sg.recoveryOneGrade,
        recovery_two_grade: sg.recoveryTwoGrade, observation: sg.observation,
        updated_at: sg.updatedAt,
      })) },
    ];

    for (const table of tables) {
      const { error } = await supabaseAdmin.from(table.name).upsert(table.data as any[]);
      if (error) {
        results.push(`Table ${table.name}: ERROR - ${error.message}`);
      } else {
        results.push(`Table ${table.name}: ${table.data.length} rows OK`);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
