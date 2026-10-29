"""Monta o site em C:\\Go\\meunorte-site: SVGs inline, tokens e marca do app."""
import os, re, shutil
APP = r'C:\Go\finBertoldi'
FONTE = os.path.join(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.dirname(FONTE)

def svg(pasta, nome):
    caminho = os.path.join(APP, 'static', 'marca', pasta, nome + '.svg')
    return open(caminho, encoding='utf-8').read().strip()

def gravar(caminho, texto):
    open(os.path.join(DESTINO, caminho), 'w', encoding='utf-8', newline='\n').write(texto)

os.makedirs(os.path.join(DESTINO, 'marca'), exist_ok=True)
os.makedirs(os.path.join(DESTINO, 'en'), exist_ok=True)

# Portugues na raiz e ingles em /en/.
for origem, destino in (('index.html', 'index.html'), ('en.html', os.path.join('en', 'index.html'))):
    html = open(os.path.join(FONTE, origem), encoding='utf-8').read()
    html = re.sub(r'\{\{ic:([a-z-]+)\}\}', lambda m: svg('icones', m.group(1)), html)
    html = re.sub(r'\{\{il:([a-z-]+)\}\}', lambda m: svg('ilustracoes', m.group(1)), html)
    assert '{{' not in html, re.findall(r'\{\{[^}]*\}\}', html)
    gravar(destino, html)

for arquivo in ('estilo.css', 'site.js'):
    shutil.copy(os.path.join(FONTE, arquivo), os.path.join(DESTINO, arquivo))
shutil.copy(os.path.join(APP, 'static', 'tokens.css'), os.path.join(DESTINO, 'tokens.css'))
shutil.copy(os.path.join(APP, 'static', 'ilustracoes.css'), os.path.join(DESTINO, 'ilustracoes.css'))
for arquivo in ('favicon.svg', 'favicon-32.png', 'simbolo-fundo-claro.svg', 'simbolo-fundo-escuro.svg'):
    shutil.copy(os.path.join(APP, 'static', 'marca', arquivo), os.path.join(DESTINO, 'marca', arquivo))

# Tema: o escolhido no botao do topo; sem escolha, o do sistema operacional.
gravar('tema.js', """// Tema do site: o escolhido no botao do topo ou, sem escolha, o do sistema operacional.
(function () {
  let tema = null;
  try { tema = localStorage.getItem('tema-do-site'); } catch (erro) { /* sem armazenamento */ }
  if (tema !== 'light' && tema !== 'dark') {
    tema = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', tema);
})();
""")

# GitHub Pages: dominio proprio, robots e sitemap.
gravar('CNAME', 'meunortefinancas.com.br\n')
gravar('robots.txt', 'User-agent: *\nAllow: /\nSitemap: https://meunortefinancas.com.br/sitemap.xml\n')
gravar('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n'
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
       '  <url><loc>https://meunortefinancas.com.br/</loc></url>\n'
       '  <url><loc>https://meunortefinancas.com.br/en/</loc></url>\n'
       '</urlset>\n')
print('site montado em', DESTINO)
