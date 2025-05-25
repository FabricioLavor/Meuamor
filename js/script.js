document.addEventListener('DOMContentLoaded', function() {
  console.clear();

  const select = e => document.querySelector(e);
  const selectAll = e => document.querySelectorAll(e);

  const style = getComputedStyle(document.body);
  const stage = select('.stage');
  const weightInit = parseFloat(style.getPropertyValue('--fw'));
  const weightTarget = 400; // 100-800
  const weightDiff = weightInit - weightTarget;
  const stretchInit = parseFloat(style.getPropertyValue('--fs'));
  const stretchTarget = 80; // 10-200
  const stretchDiff = stretchInit - stretchTarget;
  const maxYScale = 2.5;
  const body = document.body;

  let chars = selectAll('.char');
  let txt = select('.txt');

  let numChars = chars.length;
  let isMouseDown = false;
  let mouseInitialY = 0;
  let mouseFinalY = 0;
  let distY = 0;
  let charIndexSelected = 0;
  let charH = 0;
  let elasticDropOff = 0.8;
  let dragYScale = 0;
  let charSelected = null;

  function resize() {
    charH = txt.offsetHeight;
  }

  function animInTxt() {
    let elem = chars[0];
    let rect = elem.getBoundingClientRect();
    gsap.from(chars, {
      y: () => -1 * (rect.y + charH + 500),
      fontWeight: weightTarget,
      fontStretch: stretchTarget,
      scaleY: 2,
      ease: "elastic(0.2, 0.1)",
      duration: 1.5,
      delay: 0.5,
      stagger: {
        each: 0.05,
        from: 'random'
      },
      onComplete: initEvents
    });
  }

  function calcDist() {
    let maxYDragDist = charH * (maxYScale - 1);
    distY = mouseInitialY - mouseFinalY;
    dragYScale = distY / maxYDragDist;
    if (dragYScale > (maxYScale - 1)) dragYScale = maxYScale - 1;
    else if (dragYScale < -0.5) dragYScale = -0.5;
  }

  function calcfracDispersion(index) {
    let dispersion = 1 - (Math.abs(index - charIndexSelected) / (numChars * elasticDropOff));
    return dispersion * dragYScale;
  }

  function setFontDragDimensions() {
    gsap.to(chars, {
      y: (index) => {
        let fracDispersion = calcfracDispersion(index);
        return fracDispersion * -50;
      },
      fontWeight: (index) => {
        let fracDispersion = calcfracDispersion(index);
        return (weightInit - (fracDispersion * weightDiff));
      },
      fontStretch: (index) => {
        let fracDispersion = calcfracDispersion(index);
        return (stretchInit - (fracDispersion * stretchDiff));
      },
      scaleY: (index) => {
        let fracDispersion = calcfracDispersion(index);
        let scaleY = 1 + fracDispersion;
        if (scaleY < 0.5) scaleY = 0.5;
        return scaleY;
      },
      ease: "power4",
      duration: 0.6
    });
  }

  function snapBackText() {
    gsap.to(chars, {
      y: 0,
      fontWeight: weightInit,
      fontStretch: stretchInit,
      scale: 1,
      ease: "elastic(0.35, 0.1)",
      duration: 1,
      stagger: {
        each: 0.02,
        from: charIndexSelected
      }
    });
  }

  function initEvents() {
    // Mouse events
    body.onmouseup = function(e) {
      if (isMouseDown) {
        mouseFinalY = e.clientY;
        isMouseDown = false;
        snapBackText();
        body.classList.remove("grab");
      }
    };
    body.onmousemove = function(e) {
      if (isMouseDown) {
        mouseFinalY = e.clientY;
        calcDist();
        setFontDragDimensions();
      }
    };
    body.addEventListener("mouseleave", (event) => {
      if (event.clientY <= 0 || event.clientX <= 0 || (event.clientX >= window.innerWidth || event.clientY >= window.innerHeight)) {
        snapBackText();
        isMouseDown = false;
      }
    });
    chars.forEach((char, index) => {
      char.addEventListener("mousedown", function(e) {
        mouseInitialY = e.clientY;
        charIndexSelected = index;
        charSelected = e.target;
        isMouseDown = true;
        body.classList.add("grab");
        console.clear();
      });
      // Touch events para mobile
      char.addEventListener("touchstart", function(e) {
        if (e.touches.length === 1) {
          mouseInitialY = e.touches[0].clientY;
          charIndexSelected = index;
          charSelected = e.target;
          isMouseDown = true;
          body.classList.add("grab");
          console.clear();
        }
      });
    });
    // Touch move e end globais
    body.addEventListener("touchmove", function(e) {
      if (isMouseDown && e.touches.length === 1) {
        mouseFinalY = e.touches[0].clientY;
        calcDist();
        setFontDragDimensions();
      }
    }, { passive: false });
    body.addEventListener("touchend", function(e) {
      if (isMouseDown) {
        isMouseDown = false;
        snapBackText();
        body.classList.remove("grab");
      }
    });
  }

  // Corações animados (chuva e espalhados)
  function criarCoracaoRain() {
    const coracao = document.createElement('div');
    coracao.className = 'coracao-rain';
    coracao.style.left = Math.random() * 100 + 'vw';
    coracao.style.animationDuration = (1.8 + Math.random() * 1.5) + 's';
    coracao.style.fontSize = (10 + Math.random() * 12) + 'px';
    coracao.style.opacity = 0.7 + Math.random() * 0.3;
    coracao.innerHTML = '❤️';
    document.getElementById('coracoes-bg').appendChild(coracao);
    setTimeout(() => coracao.remove(), 2500);
  }
  function criarCoracaoRandom() {
    const coracao = document.createElement('div');
    coracao.className = 'coracao-random';
    coracao.style.left = Math.random() * 100 + 'vw';
    coracao.style.top = Math.random() * 100 + 'vh';
    coracao.style.fontSize = (10 + Math.random() * 14) + 'px';
    coracao.style.opacity = 0.5 + Math.random() * 0.5;
    coracao.innerHTML = '❤️';
    document.getElementById('coracoes-bg').appendChild(coracao);
    setTimeout(() => coracao.remove(), 4000);
  }
  setInterval(criarCoracaoRain, 180);
  setInterval(criarCoracaoRandom, 350);
  for (let i = 0; i < 20; i++) criarCoracaoRandom();

  // Garante que a música toque ao clicar/tocar em qualquer lugar (compatível com celulares)
  function habilitarMusicaComInteracao() {
    const audio = document.getElementById('musica-fundo');
    if (!audio) return;
    const tocar = () => {
      audio.load();
      audio.play().catch(() => { });
      document.removeEventListener('click', tocar);
      document.removeEventListener('touchstart', tocar);
    };
    document.addEventListener('click', tocar, { once: true });
    document.addEventListener('touchstart', tocar, { once: true });
  }

  function init() {
    resize();
    gsap.set(stage, { autoAlpha: 1 });
    gsap.set(chars, { transformOrigin: 'center bottom' });
    animInTxt();
  }

  // Inicialização
  setTimeout(() => {
    document.body.classList.remove("not-loaded");
  }, 1000);
  init();
  habilitarMusicaComInteracao();

  window.onresize = () => {
    resize();
  };
});
