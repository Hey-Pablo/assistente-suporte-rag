import { createClient } from 'npm:@supabase/supabase-js@2';
import { ingerir } from '../_shared/ingerir.mjs';
import { provedorCompativel } from '../_shared/provedor.mjs';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Método não permitido', { status: 405 });
  try {
    const token = req.headers.get('Authorization');
    if (!token?.startsWith('Bearer ')) return new Response('Não autorizado', { status: 401 });
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: token } } });
    const { data: user, error: authError } = await db.auth.getUser();
    if (authError || !user.user) return new Response('Não autorizado', { status: 401 });
    const { data: admin, error: adminError } = await db.rpc('eh_admin');
    if (adminError || !admin) return new Response('Acesso negado', { status: 403 });
    const body = await req.json();
    if (typeof body.artigo_id !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.artigo_id)) return new Response('Artigo inválido', { status: 400 });
    const { data: artigo, error } = await db.from('artigos').select('id,conteudo').eq('id', body.artigo_id).single();
    if (error || !artigo) return new Response('Artigo não encontrado', { status: 404 });
    const provedor = provedorCompativel({ baseUrl: Deno.env.get('BASE_URL') ?? 'http://localhost:3001/v1', apiKey: Deno.env.get('API_KEY'), embeddingModel: Deno.env.get('EMBEDDING_MODEL'), chatModel: Deno.env.get('MODEL') });
    const quantidade = await ingerir(artigo, { embeddings: provedor.embeddings, repositorio: { async substituir(id: string, trechos: unknown[]) { const { error } = await db.rpc('substituir_trechos', { p_artigo_id: id, p_trechos: trechos }); if (error) throw error; } } });
    return Response.json({ quantidade });
  } catch { return new Response('Não foi possível ingerir o artigo', { status: 500 }); }
});
