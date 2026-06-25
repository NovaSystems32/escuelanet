import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET /api/admin/users — lista todos los usuarios con sus perfiles
export async function GET() {
  const { data: profiles, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: profiles ?? [] });
}

// POST /api/admin/users — crea usuario en Supabase Auth + perfil
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, nombre, rol, linkedProfileId } = body;

  if (!email || !password || !nombre || !rol) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  // 1. Crear en Supabase Auth
  const { data, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    const msg = authError.message.includes('already been registered')
      ? 'Ya existe un usuario con ese email'
      : authError.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const userId = data.user!.id;

  // 2. Crear perfil en DB
  const { error: profileError } = await supabaseAdmin.from('profiles').insert({
    id: userId,
    nombre,
    email,
    rol,
    linked_profile_id: linkedProfileId || null,
    is_active: true,
  });

  if (profileError) {
    // Rollback: eliminar el usuario de auth
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId });
}
