import { createClient } from 'npm:@supabase/supabase-js@2';
import { perguntar } from '../_shared/perguntar.mjs';
import { provedorCompativel } from '../_shared/provedor.mjs';

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  const allowed = Deno.env.get('WEB_ORIGIN');
  const cors = origin && allowed && origin === allowed ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin' } : {};
  if (origin && (!allowed || origin !== allowed)) return new Response('Origem não permitida', { status: 403 });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  const respond = (body: string, status: number) => new Response(body, { status, headers: cors });
  if (req.method !== 'POST') return respond('Método não permitido', 405);
  try {
    const token = req.headers.get('Authorization');
    if (!token?.startsWith('Bearer ')) return respond('Não autorizado', 401);
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: token } } });
    const { data: auth, error: authError } = await db.auth.getUser();
    if (authError || !auth.user) return respond('Não autorizado', 401);
    const body = await req.json();
    if (typeof body.pergunta !== 'string' || !body.pergunta.trim() || body.pergunta.length > 2000 || typeof body.conversa_id !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.conversa_id)) return respond('Entrada inválida', 400);
    const { data: conversa, error: conversaError } = await db.from('conversas').select('id').eq('id', body.conversa_id).maybeSingle();
    if (conversaError || !conversa) return respond('Conversa não encontrada', 404);
    const { data: permitido, error: limiteError } = await db.rpc('consumir_limite');
    if (limiteError) throw limiteError;
    if (!permitido) return respond('Limite diário atingido', 429);
    const provedor = provedorCompativel({ baseUrl: Deno.env.get('BASE_URL') ?? 'http://localhost:3001/v1', apiKey: Deno.env.get('API_KEY'), embeddingModel: Deno.env.get('EMBEDDING_MODEL'), dimensoes: Number(Deno.env.get('EMBEDDING_DIMENSIONS') ?? '1536'), chatModel: Deno.env.get('MODEL') });
    const resultado = await perguntar(body.pergunta, { ...provedor, limiar: Number(Deno.env.get('LIMIAR_SIMILARIDADE') ?? '0.75'), repositorio: {
      async buscar(vetor: number[], quantidade: number) { const { data, error } = await db.rpc('buscar_trechos', { consulta: vetor, quantidade }); if (error) throw error; return data; },
      async registrarLacuna(pergunta: string) { const { error } = await db.from('lacunas').insert({ usuario_id: auth.user.id, pergunta }); if (error) throw error; },
    } });
    const { error } = await db.from('mensagens').insert([{ conversa_id: conversa.id, papel: 'usuario', conteudo: body.pergunta }, { conversa_id: conversa.id, papel: 'assistente', conteudo: resultado.resposta, fontes: resultado.fontes }]);
    if (error) throw error;
    return Response.json(resultado, { headers: cors });
  } catch { return respond('Não foi possível responder', 500); }
});
