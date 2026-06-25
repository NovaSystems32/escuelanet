import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// PATCH /api/admin/users/[id] — actualiza usuario (contraseña, estado, perfil)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { password, isActive, nombre, linkedProfileId } = body;

  // Actualizar contraseña en Supabase Auth
  if (password) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(id, { password });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Actualizar perfil en DB
  const profileUpdate: any = {};
  if (typeof isActive === 'boolean') profileUpdate.is_active = isActive;
  if (nombre !== undefined) profileUpdate.nombre = nombre;
  if (linkedProfileId !== undefined) profileUpdate.linked_profile_id = linkedProfileId || null;

  if (Object.keys(profileUpdate).length > 0) {
    const { error } = await supabaseAdmin.from('profiles').update(profileUpdate).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/admin/users/[id] — elimina usuario de Auth y perfil
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Eliminar de Supabase Auth (cascade elimina el perfil)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
