// Site do Meu Norte Finanças: tema, simulador de sobra, preço mensal/anual e
// entrada suave das seções. Tudo roda no navegador; nada é enviado.
(function () {
  // Pagina em ingles (/en/): numeros com ponto decimal e textos traduzidos.
  const ingles = document.documentElement.lang === 'en';
  const textos = ingles
    ? { acima: 'expenses above income', anos: 'in over 10 years', umMes: 'in 1 month', meses: function (n) { return 'in ' + n + ' months'; } }
    : { acima: 'gastos acima do que entra', anos: 'em mais de 10 anos', umMes: 'em 1 mês', meses: function (n) { return 'em ' + n + ' meses'; } };

  function lerValor(texto) {
    const limpo = String(texto).replace(/[^\d,.-]/g, '');
    if (ingles) return parseFloat(limpo.replace(/,/g, '')) || 0;
    if (limpo.includes(',')) return parseFloat(limpo.replace(/\./g, '').replace(',', '.')) || 0;
    return parseFloat(limpo.replace(/\./g, '')) || 0;
  }
  function brl(valor) {
    return valor.toLocaleString(ingles ? 'en-US' : 'pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Por dentro: cada tela anima quando aparece (a classe .ativo do vitrine.css).
  const telas = document.querySelectorAll('[data-anima]');
  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('ativo');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.35 });
    telas.forEach(function (tela) { observador.observe(tela); });
  } else {
    telas.forEach(function (tela) { tela.classList.add('ativo'); });
  }

  // Tema: o botao alterna e guarda a escolha (tema.js aplica no carregamento).
  document.querySelectorAll('.botao-tema').forEach(function (botao) {
    botao.addEventListener('click', function () {
      const novo = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', novo);
      try { localStorage.setItem('tema-do-site', novo); } catch (erro) { /* sem armazenamento: vale so nesta visita */ }
    });
  });

  // Simulador: sobra, quanto se guarda e em quantos meses forma a reserva de
  // 6 meses de gastos.
  const entra = document.getElementById('sim-entra');
  const sai = document.getElementById('sim-sai');
  function simular() {
    const receitas = lerValor(entra.value);
    const despesas = lerValor(sai.value);
    const sobra = receitas - despesas;
    document.getElementById('sim-sobra').textContent = brl(sobra);
    document.getElementById('sim-sobra').style.color = sobra < 0 ? '#FF6464' : '';
    document.getElementById('sim-taxa').textContent = receitas > 0 ? Math.round(sobra / receitas * 100) + '%' : '—';
    const reserva = despesas * 6;
    let texto = '—';
    if (sobra <= 0) texto = textos.acima;
    else if (reserva > 0) {
      const meses = Math.ceil(reserva / sobra);
      texto = meses > 120 ? textos.anos : meses <= 1 ? textos.umMes : textos.meses(meses);
    }
    document.getElementById('sim-reserva').textContent = texto;
  }
  if (entra && sai) {
    entra.addEventListener('input', simular);
    sai.addEventListener('input', simular);
    document.getElementById('simulador-form').addEventListener('submit', function (evento) { evento.preventDefault(); });
    simular();
  }

  // Precos: mensal ou anual (anual = 10 meses).
  document.querySelectorAll('.alternar-periodo button').forEach(function (botao) {
    botao.addEventListener('click', function () {
      document.querySelectorAll('.alternar-periodo button').forEach(function (outro) { outro.classList.toggle('ativo', outro === botao); });
      document.querySelector('.planos').classList.toggle('periodo-anual', botao.dataset.periodo === 'anual');
    });
  });

  // Secoes aparecem ao entrar na tela.
  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) { entrada.target.classList.add('visivel'); observador.unobserve(entrada.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.recurso, .plano, .seguranca, .perguntas details, .simulador-cartao').forEach(function (elemento) {
      elemento.classList.add('aparece');
      observador.observe(elemento);
    });
  }
})();
