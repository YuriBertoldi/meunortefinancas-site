# Meu Norte Finanças: site

Site público em https://meunortefinancas.com.br (português) e https://meunortefinancas.com.br/en/ (inglês), servido pelo GitHub Pages.
O sistema fica em https://app.meunortefinancas.com.br.

## Como mudar
Edite a fonte em `_fonte/` (`index.html`, `en.html`, `estilo.css`, `site.js`) e rode:

    python _fonte/montar_site.py

O script coloca os ícones e as ilustrações do app inline (marcadores `{{ic:nome}}` e `{{il:nome}}`, lidos de `C:\GoinBertoldi\static\marca`) e copia `tokens.css`, `ilustracoes.css` e a marca. Depois, commit e push na `main`: o Pages publica sozinho. A pasta `_fonte/` não é publicada.
