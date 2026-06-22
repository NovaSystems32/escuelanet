'use client';
import { useState, useRef } from 'react';
import { parseStudentsExcel, ImportRow } from '@/lib/excel';
import { useAppStore } from '@/store/useAppStore';
import Modal from '@/components/Modal';

interface ImportStudentsProps {
  isOpen: boolean;
  onClose: () => void;
  courseFilter?: string; // if set, only import into this course
}

export default function ImportStudents({ isOpen, onClose, courseFilter }: ImportStudentsProps) {
  const { addEstudiante, estudiantes, cursos } = useAppStore();
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [imported, setImported] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const validRows = rows.filter(r => r.errors.length === 0);
  const errorRows = rows.filter(r => r.errors.length > 0);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setImported(false);
    try {
      const existingDnis = new Set(estudiantes.map(s => s.dni));
      const parsed = await parseStudentsExcel(file);
      // Validate DNI duplicates
      const result = parsed.map(r => {
        const errors = [...r.errors];
        if (r.dni && existingDnis.has(r.dni)) {
          errors.push(`DNI ${r.dni} ya existe`);
        }
        return { ...r, errors };
      });
      setRows(result);
    } catch {
      alert('Error al leer el archivo. Asegurate de que sea un archivo .xlsx o .csv válido.');
    }
    setLoading(false);
  };

  const handleImport = () => {
    const curso = courseFilter || cursos[0]?.id || 'c1';
    validRows.forEach(r => {
      addEstudiante({
        nombre: r.nombre,
        apellido: r.apellido,
        dni: r.dni,
        email: r.email,
        telefono: r.telefono,
        curso: r.curso || curso,
        turno: (r.turno as 'mañana' | 'tarde') || 'mañana',
        fechaNacimiento: r.fechaNacimiento,
        activo: true,
        tutor: r.tutor,
        telefonoTutor: r.telefonoTutor,
        direccion: r.direccion,
      });
    });
    setImported(true);
  };

  const handleClose = () => {
    setRows([]);
    setImported(false);
    if (fileRef.current) fileRef.current.value = '';
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Importar Estudiantes desde Excel" size="lg">
      <div className="space-y-4">
        {!imported && (
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">
              Seleccioná un archivo Excel (.xlsx) o CSV
            </label>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFile}
              className="block w-full text-sm text-[#888888] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#1a5276] file:text-white hover:file:bg-[#154360] cursor-pointer"
            />
          </div>
        )}

        {loading && <p className="text-sm text-[#888888]">Procesando archivo...</p>}

        {rows.length > 0 && !imported && (
          <>
            <div className="flex gap-4 text-sm">
              <span className="text-green-700 font-medium">{validRows.length} filas válidas</span>
              {errorRows.length > 0 && (
                <span className="text-[#c62828] font-medium">{errorRows.length} filas con errores</span>
              )}
            </div>

            <div className="overflow-auto max-h-64 border border-[#e8e8ec] rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-[#f4f4f6] sticky top-0">
                  <tr>
                    <th className="text-left px-3 py-2 text-[#888888]">#</th>
                    <th className="text-left px-3 py-2 text-[#888888]">Nombre</th>
                    <th className="text-left px-3 py-2 text-[#888888]">Apellido</th>
                    <th className="text-left px-3 py-2 text-[#888888]">DNI</th>
                    <th className="text-left px-3 py-2 text-[#888888]">Email</th>
                    <th className="text-left px-3 py-2 text-[#888888]">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e8ec]">
                  {rows.map((r, i) => (
                    <tr key={i} className={r.errors.length > 0 ? 'bg-red-50' : 'hover:bg-[#f4f4f6]'}>
                      <td className="px-3 py-2 text-[#888888]">{i + 1}</td>
                      <td className="px-3 py-2">{r.nombre}</td>
                      <td className="px-3 py-2">{r.apellido}</td>
                      <td className="px-3 py-2">{r.dni}</td>
                      <td className="px-3 py-2">{r.email}</td>
                      <td className="px-3 py-2">
                        {r.errors.length > 0 ? (
                          <span className="text-[#c62828]">{r.errors.join(', ')}</span>
                        ) : (
                          <span className="text-green-700">OK</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {validRows.length > 0 && (
              <div className="flex gap-3 justify-end">
                <button onClick={handleClose} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm text-[#111111] hover:bg-[#f4f4f6]">
                  Cancelar
                </button>
                <button
                  onClick={handleImport}
                  className="px-4 py-2 rounded-lg bg-[#1a5276] text-white text-sm hover:bg-[#154360]"
                >
                  Importar {validRows.length} estudiante{validRows.length !== 1 ? 's' : ''}
                </button>
              </div>
            )}
          </>
        )}

        {imported && (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-lg font-semibold text-[#111111]">{validRows.length} estudiante{validRows.length !== 1 ? 's' : ''} importado{validRows.length !== 1 ? 's' : ''}</p>
            <button onClick={handleClose} className="mt-4 px-4 py-2 rounded-lg bg-[#1a5276] text-white text-sm">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
