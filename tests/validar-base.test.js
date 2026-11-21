const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = __dirname.replace('/tests', '');

// Função para extrair frontmatter
function extrairFrontmatter(conteudo) {
  const match = conteudo.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatterStr = match[1];
  const dados = {};

  const linhas = frontmatterStr.split('\n');
  for (const linha of linhas) {
    const [chave, valor] = linha.split(': ').map(s => s.trim());
    if (chave && valor) {
      dados[chave] = valor.replace(/"/g, '');
    }
  }

  return dados;
}

// Função para parsear CSV manualmente (sem dependências)
function parseCSV(conteudo) {
  const linhas = conteudo.trim().split('\n');
  const resultados = [];

  // Pular linha de headers
  for (let i = 1; i < linhas.length; i++) {
    const linha = linhas[i];
    // CSV simples: separar por vírgula fora de aspas
    const partes = [];
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

// Carregar todos os artigos .md
let artigos = [];
let perguntas = [];

const diretorioBase = path.join(PROJECT_ROOT, 'base');
const categorias = fs.readdirSync(diretorioBase, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

for (const categoria of categorias) {
  const caminhoCategoria = path.join(diretorioBase, categoria);
  const arquivos = fs.readdirSync(caminhoCategoria)
    .filter(arq => arq.endsWith('.md'))
    .map(arq => path.join(caminhoCategoria, arq));

  for (const caminho of arquivos) {
    const conteudo = fs.readFileSync(caminho, 'utf-8');
    const frontmatter = extrairFrontmatter(conteudo);
    if (frontmatter) {
      artigos.push({
        caminho: path.relative(PROJECT_ROOT, caminho),
        ...frontmatter
      });
    }
  }
}

// Carregar perguntas do CSV
const csvContent = fs.readFileSync(path.join(PROJECT_ROOT, 'avaliacao', 'perguntas.csv'), 'utf-8');
perguntas = parseCSV(csvContent);

describe('Validação da Base de Conhecimento', () => {
  describe('Artigos', () => {
    it('deve ter exatamente 30 artigos', () => {
      assert.strictEqual(artigos.length, 30, `Esperado 30 artigos, encontrado ${artigos.length}`);
    });

    it('deve ter todos os artigos com ID unico', () => {
      const ids = artigos.map(a => a.id);
      const idsUnicos = new Set(ids);
      assert.strictEqual(ids.length, idsUnicos.size, 'IDs devem ser unicos');
    });

    it('deve ter todos os artigos com titulo', () => {
      artigos.forEach(artigo => {
        assert.ok(artigo.titulo, `Artigo ${artigo.id} sem titulo`);
        assert.ok(artigo.titulo.length > 5, `Titulo de ${artigo.id} muito curto`);
      });
    });

    it('deve ter todos os artigos com categoria', () => {
      artigos.forEach(artigo => {
        assert.ok(artigo.categoria, `Artigo ${artigo.id} sem categoria`);
      });
    });

    it('deve ter todos os artigos com frontmatter valido', () => {
      artigos.forEach(artigo => {
        assert.ok(artigo.id, `Artigo sem ID`);
        // ID deve seguir padrao artigo-XXX
        assert.ok(/^artigo-\d+$/.test(artigo.id), `ID ${artigo.id} nao segue padrao artigo-XXX`);
      });
    });
  });

  describe('Perguntas de avaliacao', () => {
    it('deve ter exatamente 40 perguntas', () => {
      assert.strictEqual(perguntas.length, 40, `Esperado 40 perguntas, encontrado ${perguntas.length}`);
    });

    it('deve ter todas as perguntas com conteudo', () => {
      let vazias = 0;
      perguntas.forEach(p => {
        if (!p.pergunta || p.pergunta.trim().length < 10) {
          vazias++;
        }
      });
      assert.strictEqual(vazias, 0, 'Algumas perguntas estao vazias ou muito curtas');
    });

    it('deve ter perguntas fora da base com artigo_esperado vazio', () => {
      const foraDaBase = perguntas.filter(p => !p.artigo_esperado || p.artigo_esperado.trim() === '');
      assert.ok(foraDaBase.length >= 8, `Esperado pelo menos 8 perguntas fora da base, encontrado ${foraDaBase.length}`);
    });

    it('deve ter artigos referenciados pelas perguntas existentes', () => {
      const artigosRefenciados = new Set();
      perguntas.forEach(p => {
        if (p.artigo_esperado && p.artigo_esperado.trim() !== '') {
          artigosRefenciados.add(p.artigo_esperado);
        }
      });

      artigosRefenciados.forEach(id => {
        const existe = artigos.some(a => a.id === id);
        assert.ok(existe, `Artigo ${id} referenciado por pergunta nao existe`);
      });
    });
  });

  describe('Cobertura de categorias', () => {
    it('deve cobrir as categorias principais', () => {
      const categoriasSet = new Set(artigos.map(a => a.categoria));
      const categoriasEsperadas = [
        'Impressora Fiscal',
        'NF-e',
        'Acesso Remoto',
        'Boleto',
        'Rede',
        'Suporte'
      ];

      categoriasEsperadas.forEach(cat => {
        assert.ok(categoriasSet.has(cat), `Categoria ${cat} nao encontrada`);
      });
    });
  });

  describe('Padroes de formatação', () => {
    it('deve ter IDs numericos sequenciais', () => {
      const ids = artigos.map(a => parseInt(a.id.split('-')[1])).sort((a, b) => a - b);
      for (let i = 0; i < ids.length - 1; i++) {
        assert.strictEqual(ids[i + 1] - ids[i], 1, `IDs nao sao sequenciais entre ${ids[i]} e ${ids[i + 1]}`);
      }
    });
  });
});