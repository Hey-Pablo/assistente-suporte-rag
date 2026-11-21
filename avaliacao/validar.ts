import fs from 'fs';
import path from 'path';

// Types
interface Frontmatter {
  id: string;
  titulo: string;
  categoria: string;
}

interface Pergunta {
  pergunta: string;
  resposta_esperada: string;
  artigo_esperado: string;
}

interface ResultadoValidacao {
  valido: boolean;
  erros: string[];
  avisos: string[];
}

// Função para extrair frontmatter de um arquivo Markdown
function extrairFrontmatter(conteudo: string): Frontmatter | null {
  const match = conteudo.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatterStr = match[1];
  const dados: Partial<Frontmatter> = {};

  const linhas = frontmatterStr.split('\n');
  for (const linha of linhas) {
    const [chave, valor] = linha.split(': ').map(s => s.trim());
    if (chave && valor) {
      (dados as any)[chave] = valor.replace(/"/g, '');
    }
  }

  return dados as Frontmatter;
}

// Função para parsear CSV manualmente (sem dependências)
function parseCSV(conteudo: string): Pergunta[] {
  const linhas = conteudo.trim().split('\n');
  const resultados: Pergunta[] = [];

  // Pular linha de headers
  for (let i = 1; i < linhas.length; i++) {
    const linha = linhas[i];
    // CSV simples: separar por vírgula fora de aspas
    const partes: string[] = [];
    let atual = '';
    let emAspas = false;

    for (let j = 0; j < linha.length; j++) {
      const char = linha[j];
      if (char === '"') {
        emAspas = !emAspas;
      } else if (char === ',' && !emAspas) {
        partes.push(atual.trim().replace(/^"|"$/g, ''));
        atual = '';
      } else {
        atual += char;
      }
    }
    partes.push(atual.trim().replace(/^"|"$/g, ''));

    if (partes.length >= 3) {
      resultados.push({
        pergunta: partes[0],
        resposta_esperada: partes[1],
        artigo_esperado: partes[2]
      });
    }
  }

  return resultados;
}

// Função para validar um artigo
function validarArtigo(caminho: string, artigos: Map<string, Frontmatter>): ResultadoValidacao {
  const erros: string[] = [];
  const avisos: string[] = [];

  const conteudo = fs.readFileSync(caminho, 'utf-8');
  const frontmatter = extrairFrontmatter(conteudo);

  if (!frontmatter) {
    erros.push('Frontmatter não encontrado ou mal formatado');
    return { valido: false, erros, avisos };
  }

  if (!frontmatter.id) {
    erros.push('Campo "id" ausente no frontmatter');
  } else if (artigos.has(frontmatter.id)) {
    erros.push(`ID duplicado: ${frontmatter.id}`);
  } else {
    artigos.set(frontmatter.id, frontmatter);
  }

  if (!frontmatter.titulo) {
    erros.push('Campo "titulo" ausente no frontmatter');
  }

  if (!frontmatter.categoria) {
    avisos.push('Campo "categoria" ausente no frontmatter');
  }

  // Verificar se o conteúdo tem passos numerados
  const corpo = conteudo.replace(/^---.*---/s, '');
  const temPassos = /\d+\.\s+/g.test(corpo);
  if (!temPassos) {
    avisos.push('Artigo não parece ter passos numerados');
  }

  return { valido: erros.length === 0, erros, avisos };
}

// Função para validar perguntas
function validarPerguntas(
  caminhoCSV: string,
  artigos: Map<string, Frontmatter>
): ResultadoValidacao[] {
  const conteudo = fs.readFileSync(caminhoCSV, 'utf-8');
  const perguntas = parseCSV(conteudo);
  const resultados: ResultadoValidacao[] = [];

  for (const p of perguntas) {
    const erro: ResultadoValidacao = {
      valido: true,
      erros: [],
      avisos: []
    };

    if (!p.pergunta || p.pergunta.trim().length < 10) {
      erro.erros.push('Pergunta muito curta ou ausente');
      erro.valido = false;
    }

    if (!p.resposta_esperada || p.resposta_esperada.trim().length < 20) {
      erro.erros.push('Resposta esperada muito curta ou ausente');
      erro.valido = false;
    }

    // Verificar se artigo esperado existe (apenas se não estiver vazio)
    if (p.artigo_esperado && p.artigo_esperado.trim() !== '') {
      if (!artigos.has(p.artigo_esperado)) {
        erro.erros.push(`Artigo esperado "${p.artigo_esperado}" não existe`);
        erro.valido = false;
      }
    }

    resultados.push(erro);
  }

  return resultados;
}

// Função principal
function executarValidacao() {
  const diretorioBase = path.join(process.cwd(), 'base');
  const caminhoCSV = path.join(process.cwd(), 'avaliacao', 'perguntas.csv');

  console.log('=== Validação da Base de Conhecimento ===\n');

  const artigos = new Map<string, Frontmatter>();
  const resultadosArtigos: ResultadoValidacao[] = [];

  // Validar todos os arquivos .md na pasta base
  const categorias = fs.readdirSync(diretorioBase, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Encontradas ${categorias.length} categorias: ${categorias.join(', ')}\n`);

  for (const categoria of categorias) {
    const caminhoCategoria = path.join(diretorioBase, categoria);
    const arquivos = fs.readdirSync(caminhoCategoria)
      .filter(arq => arq.endsWith('.md'))
      .map(arq => path.join(caminhoCategoria, arq));

    console.log(`[base/${categoria}] ${arquivos.length} artigos`);

    for (const caminho of arquivos) {
      const resultado = validarArtigo(caminho, artigos);
      if (!resultado.valido) {
        console.log(`  ERRO em ${path.basename(caminho)}:`);
        resultado.erros.forEach(e => console.log(`    - ${e}`));
      }
      if (resultado.avisos.length > 0) {
        console.log(`  AVISOS em ${path.basename(caminho)}:`);
        resultado.avisos.forEach(a => console.log(`    - ${a}`));
      }
      resultadosArtigos.push(resultado);
    }
  }

  // Validar perguntas
  console.log('\n=== Validação de Perguntas ===\n');

  const resultadosPerguntas = validarPerguntas(caminhoCSV, artigos);
  let errosPerguntas = 0;

  for (const resultado of resultadosPerguntas) {
    if (!resultado.valido) {
      errosPerguntas++;
    }
  }

  // Contar perguntas fora da base
  const conteudoCSV = fs.readFileSync(caminhoCSV, 'utf-8');
  const perguntas = parseCSV(conteudoCSV);
  const foraDaBase = perguntas.filter(p => !p.artigo_esperado || p.artigo_esperado.trim() === '');
  console.log(`Perícias processadas: ${perguntas.length}`);
  console.log(`Perguntas fora da base: ${foraDaBase.length}`);
  console.log(`Erros na validação: ${errosPerguntas}`);

  // Resumo final
  const totalErros = resultadosArtigos.filter(r => !r.valido).length + errosPerguntas;
  console.log('\n=== Resumo Final ===');
  console.log(`Total de artigos: ${artigos.size}`);
  console.log(`Artigos válidos: ${artigos.size - resultadosArtigos.filter(r => !r.valido).length}`);
  console.log(`Erros na validação: ${totalErros}`);
  console.log(`Status: ${totalErros === 0 ? '✓ PASSOU' : '✗ FALHOU'}`);

  process.exit(totalErros > 0 ? 1 : 0);
}

executarValidacao();