// Data de início: 20 de abril de 2025 às 00:00 (horário de Brasília)
const inicioRelacao = new Date(2025, 3, 20, 0, 0, 0); // mês é zero-based (abril = 3)

function atualizarContador() {
  const agora = new Date();
  let totalMeses = (agora.getFullYear() - inicioRelacao.getFullYear()) * 12 + (agora.getMonth() - inicioRelacao.getMonth());
  let anos = Math.floor(totalMeses / 12);
  let meses = totalMeses % 12;
  const dias = Math.floor((agora - new Date(agora.getFullYear(), agora.getMonth(), inicioRelacao.getDate(), inicioRelacao.getHours(), inicioRelacao.getMinutes(), inicioRelacao.getSeconds())) / (1000 * 60 * 60 * 24));
  const horas = agora.getHours() - inicioRelacao.getHours();
  const minutos = agora.getMinutes() - inicioRelacao.getMinutes();
  const segundos = agora.getSeconds() - inicioRelacao.getSeconds();

  let textoTempo = "";
  if (anos >= 1) {
    textoTempo += `${anos} ano${anos > 1 ? 's' : ''}`;
    if (meses > 0) {
      textoTempo += ` e ${meses} mes${meses > 1 ? 'es' : ''}`;
    }
  } else {
    textoTempo += `${totalMeses} mes${totalMeses !== 1 ? 'es' : ''}`;
  }
  textoTempo += `, ${dias} dias, ${horas < 0 ? horas + 24 : horas} horas, ${minutos < 0 ? minutos + 60 : minutos} minutos e ${segundos < 0 ? segundos + 60 : segundos} segundos`;

  var tempo = document.getElementById("tempo");
  if (tempo) {
    tempo.textContent = textoTempo;
  }
}

setInterval(atualizarContador, 1000);
atualizarContador();

// Efeito de rolagem JS para navegadores sem suporte ao CSS scroll-timeline
function fallbackScrollEffect() {
  // Só ativa se NÃO houver suporte ao CSS scroll-timeline
  if (CSS.supports('animation-timeline: scroll()')) return;
  const lista = document.querySelector('.qualidades-lista');
  if (!lista) return;
  const items = lista.querySelectorAll('li');
  const windowHeight = window.innerHeight;

  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const screenCenter = windowHeight / 2;
    const distance = Math.abs(itemCenter - screenCenter);
    const maxDistance = windowHeight / 2;
    // Mesmo range do CSS: 0.2 (longe) até 1 (centro)
    let opacity = 1 - (distance / maxDistance);
    opacity = Math.max(0.2, Math.min(1, opacity));
    item.style.opacity = opacity;
    // Simula o filter: brightness(1.2) no centro, igual ao CSS
    if (opacity > 0.95) {
      item.style.filter = 'brightness(1.2)';
    } else {
      item.style.filter = '';
    }
  });
}

// FINAL-SECTION: sempre visível ao chegar no final da página (funciona com touch/scroll)
function checkShowFinalSection() {
  const finalSection = document.getElementById('final-section');
  if (!finalSection) return;

  // Sempre mostra o final-section se o usuário chegou ao fim da página
  const scrollBottom = window.innerHeight + window.scrollY;
  const docHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );

  // Se está a menos de 50px do final, mostra o final-section
  if (scrollBottom >= docHeight - 50) {
    finalSection.classList.add('visible');
    // Garante que gif, contador e botão nunca sumam
    finalSection.querySelectorAll('.contador, img, .big-gif, .neon-btn').forEach(el => {
      el.style.display = 'block';
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  } else {
    finalSection.classList.remove('visible');
  }
}

let ticking = false;
function onScrollOrResize() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      fallbackScrollEffect();
      checkShowFinalSection();
      ticking = false;
    });
    ticking = true;
  }
}
document.addEventListener('scroll', onScrollOrResize, { passive: true });
window.addEventListener('resize', onScrollOrResize);
window.addEventListener('touchmove', onScrollOrResize, { passive: true });
document.addEventListener('DOMContentLoaded', () => {
  fallbackScrollEffect();
  checkShowFinalSection();
});

const btnFinal = document.getElementById('grande-final-btn');
if (btnFinal) {
  btnFinal.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'index3.html';
  });
}