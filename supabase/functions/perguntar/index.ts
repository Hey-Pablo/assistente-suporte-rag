import { createClient } from 'npm:@supabase/supabase-js@2';
import { perguntar } from '../_shared/perguntar.mjs';
import { provedorCompativel } from '../_shared/provedor.mjs';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Método não permitido', { status: 405 });
  try {
    const token = req.headers.get('Authorization');
    if (!token?.startsWith('Bearer ')) return new Response('Não autorizado', { status: 401 });
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: token } } });
    const { data: auth, error: authError } = await db.auth.getUser();
    if (authError || !auth.user) return new Response('Não autorizado', { status: 401 });
    const body = await req.json();
    if (typeof body.pergunta !== 'string' || !body.pergunta.trim() || body.pergunta.length > 2000 || typeof body.conversa_id !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.conversa_id)) return new Response('Entrada inválida', { status: 400 });
    const { data: conversa, error: conversaError } = await db.from('conversas').select('id').eq('id', body.conversa_id).maybeSingle();
    if (conversaError || !conversa) return new Response('Conversa não encontrada', { status: 404 });
    const { data: permitido, error: limiteError } = await db.rpc('consumir_limite');
    if (limiteError) throw limiteError;
    if (!permitido) return new Response('Limite diário atingido', { status: 429 });
    const provedor = provedorCompativel({ baseUrl: Deno.env.get('BASE_URL') ?? 'http://localhost:3001/v1', apiKey: Deno.env.get('API_KEY'), embeddingModel: Deno.env.get('EMBEDDING_MODEL'), chatModel: Deno.env.get('MODEL') });
    const resultado = await perguntar(body.pergunta, { ...provedor, limiar: Number(Deno.env.get('LIMIAR_SIMILARIDADE') ?? '0.75'), repositorio: {
      async buscar(vetor: number[], quantidade: number) { const { data, error } = await db.rpc('buscar_trechos', { consulta: vetor, quantidade }); if (error) throw error; return data; },
      async registrarLacuna(pergunta: string) { const { error } = await db.from('lacunas').insert({ usuario_id: auth.user.id, pergunta }); if (error) throw error; },
    } });
    const { error } = await db.from('mensagens').insert([{ conversa_id: conversa.id, papel: 'usuario', conteudo: body.pergunta }, { conversa_id: conversa.id, papel: 'assistente', conteudo: resultado.resposta, fontes: resultado.fontes }]);
    if (error) throw error;
    return Response.json(resultado);
  } catch { return new Response('Não foi possível responder', { status: 500 }); }
});
