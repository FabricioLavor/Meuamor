document.addEventListener("DOMContentLoaded", function () {
  const intro = document.getElementById('intro');
  const photo = document.getElementById('photo');
  const carouselView = document.getElementById('carouselView');
  const headline = document.getElementById('headline');
  const albumTitle = document.getElementById('albumTitle');

  // Som PLIM
  const plimAudio = new Audio('assets/bereal.mp3');

  // Disco atrás da foto: mostrar inteiro ao passar mouse/touch
  function showVinyl() {
    intro.classList.add('show-vinyl');
  }
  function hideVinyl() {
    intro.classList.remove('show-vinyl');
  }
  photo.addEventListener("mouseenter", showVinyl);
  photo.addEventListener("mouseleave", hideVinyl);
  photo.addEventListener("touchstart", showVinyl);
  photo.addEventListener("touchend", hideVinyl);

  // Ao clicar na foto, some o título e mostra o carrossel e toca o som PLIM imediatamente
  photo.addEventListener("click", () => {
    plimAudio.currentTime = 0;
    plimAudio.play();
    intro.style.display = 'none';
    carouselView.style.display = 'flex';
    albumTitle.style.opacity = '0';
    setTimeout(() => albumTitle.style.display = 'none', 400);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Efeito clique na frase principal (opcional)
  headline.addEventListener("click", () => {
    headline.classList.add('clicked');
    setTimeout(() => headline.classList.remove('clicked'), 600);
  });

  // Música e disco girando
  const music = document.getElementById('backgroundMusic');
  const btn = document.getElementById('toggleMusic');
  const vinyl = document.getElementById('mainVinyl');
  const musicIcon = btn.querySelector('.music-icon');
  const musicLabel = btn.querySelector('.music-label');
  let playing = false;

  btn.onclick = function () {
    if (!playing) {
      music.play();
      musicIcon.textContent = "🔇";
      musicLabel.textContent = "Pausar música";
      vinyl.classList.add('spin');
      startParticles();
    } else {
      music.pause();
      musicIcon.textContent = "🔊";
      musicLabel.textContent = "Tocar música";
      vinyl.classList.remove('spin');
      clearParticles();
    }
    playing = !playing;
  };

  // Carrossel
  const carousel = document.getElementById('carouselExampleControls');
  const inner = carousel.querySelector('.carousel-inner');
  const items = inner.querySelectorAll('.carousel-item');
  let idx = 0;

  // Muitas cores para o carrossel e disco
  const cores = [
    ['#e81cff', '#40c9ff'],
    ['#fc00ff', '#00dbde'],
    ['#ff6a00', '#ee0979'],
    ['#00ffb3', '#1e3c72'],
    ['#ff0080', '#7928ca'],
    ['#f7971e', '#ffd200'],
    ['#00c3ff', '#ffff1c'],
    ['#f953c6', '#b91d73'],
    ['#43cea2', '#185a9d'],
    ['#ffaf7b', '#d76d77'],
    ['#c471f5', '#fa71cd'],
    ['#30cfd0', '#330867'],
    ['#f7797d', '#FBD786'],
    ['#a8ff78', '#78ffd6'],
    ['#f857a6', '#ff5858'],
  ];

  function atualizarGradientes(index) {
    const [c1, c2] = cores[index % cores.length];
    document.querySelectorAll('.card-effect').forEach(item => {
      item.style.setProperty('--c1', c1);
      item.style.setProperty('--c2', c2);
    });
    vinyl.style.setProperty('--c1', c1);
    vinyl.style.setProperty('--c2', c2);
    vinyl.style.background = "#181818";
    vinyl.style.boxShadow = `0 0 24px 4px ${c1}80`;
  }

  function showItem(i) {
    items.forEach((item, j) => item.classList.toggle('active', i === j));
    atualizarGradientes(i);
  }

  carousel.addEventListener('click', () => {
    idx = (idx + 1) % items.length;
    showItem(idx);
  });

  setInterval(() => {
    idx = (idx + 1) % items.length;
    showItem(idx);
  }, 8000);

  showItem(idx);

  // Partículas
  function startParticles() {
    const field = document.getElementById('particleField');
    clearParticles();
    for (let i = 0; i < 100; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.setProperty('--x', `${Math.random() * 200 - 100}px`);
      p.style.setProperty('--y', `${Math.random() * 200 - 100}px`);
      p.style.animation = `particleFloat ${1 + Math.random() * 3}s infinite`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      field.appendChild(p);
    }
  }

  function clearParticles() {
    const field = document.getElementById('particleField');
    field.innerHTML = '';
  }

  // Arrastar e soltar disco (carrossel)
  vinyl.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', null);
  });

  vinyl.addEventListener('dragend', (e) => {
    vinyl.style.transform = 'translate(0, 0)';
  });

  vinyl.addEventListener('mouseover', () => {
    vinyl.style.transform = 'scale(1.05)';
  });

  vinyl.addEventListener('mouseout', () => {
    vinyl.style.transform = 'scale(1)';
  });
});