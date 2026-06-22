import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Estudiante } from '@/types';

export function exportStudentsToExcel(students: Estudiante[], filename = 'estudiantes.xlsx') {
  const data = students.map(s => ({
    'Nombre': s.nombre,
    'Apellido': s.apellido,
    'DNI': s.dni || '',
    'Fecha Nacimiento': s.fechaNacimiento || '',
    'Curso': s.curso,
    'Turno': s.turno || '',
    'Email': s.email || '',
    'Teléfono': s.telefono || '',
    'Tutor': s.tutor || '',
    'Teléfono Tutor': s.telefonoTutor || '',
    'Dirección': s.direccion || '',
    'Estado': s.activo ? 'Activo' : 'Inactivo',
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), filename);
}

export function downloadTemplateExcel() {
  const template = [{
    'Nombre': '', 'Apellido': '', 'DNI': '', 'Fecha Nacimiento': '',
    'Curso': '', 'Turno': '', 'Email': '', 'Teléfono': '',
    'Tutor': '', 'Teléfono Tutor': '', 'Dirección': ''
  }];
  const ws = XLSX.utils.json_to_sheet(template);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'plantilla-estudiantes.xlsx');
}

export interface ImportRow {
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  curso: string;
  turno: string;
  email: string;
  telefono: string;
  tutor: string;
  telefonoTutor: string;
  direccion: string;
  errors: string[];
}

export function parseStudentsExcel(file: File): Promise<ImportRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);
        const result: ImportRow[] = rows.map((row) => {
          const nombre = String(row['Nombre'] || row['nombre'] || '').trim();
          const apellido = String(row['Apellido'] || row['apellido'] || '').trim();
          const dni = String(row['DNI'] || row['dni'] || '').trim();
          const errors: string[] = [];
          if (!nombre) errors.push('Nombre requerido');
          if (!apellido) errors.push('Apellido requerido');
          return {
            nombre,
            apellido,
            dni,
            fechaNacimiento: String(row['Fecha Nacimiento'] || row['fechaNacimiento'] || '').trim(),
            curso: String(row['Curso'] || row['curso'] || '').trim(),
            turno: String(row['Turno'] || row['turno'] || 'mañana').trim(),
            email: String(row['Email'] || row['email'] || '').trim(),
            telefono: String(row['Teléfono'] || row['telefono'] || '').trim(),
            tutor: String(row['Tutor'] || row['tutor'] || '').trim(),
            telefonoTutor: String(row['Teléfono Tutor'] || row['telefonoTutor'] || '').trim(),
            direccion: String(row['Dirección'] || row['direccion'] || '').trim(),
            errors,
          };
        });
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
