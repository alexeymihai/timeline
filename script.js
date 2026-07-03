/* ================================================================
   👉 CÓMO AÑADIR UN NUEVO MOMENTO 👈

   Añade un objeto nuevo a la lista "momentos". No hace falta tocar
   nada más del código: la tarjeta a pantalla completa, su punto en
   la línea lateral y la transición se generan solas.

   Cada momento se ve así:

   {
     fecha: "14 Febrero 2025",
     titulo: "Cómo nos conocimos",
     texto: "Aquí cuentas qué pasó, con el detalle que quieras...",
     imagen: "URL_DE_LA_IMAGEN"   // opcional — bórrala si no hay foto
   }

   NOTAS:
   - El orden de la lista es el orden en que aparecen al bajar.
   - Sin imagen: borra la línea "imagen: ..." (o deja imagen: "").
   - Fotos propias: súbelas a una carpeta junto a este archivo, por
     ejemplo "fotos/", y pon imagen: "fotos/playa.jpg".
   - No olvides la coma "," al final de cada objeto, menos el último.
   ================================================================ */

const momentos = [
  {
    fecha: "29 de Junio 2026",
    titulo: "Floración",
    texto: "Una noche, en mitad del cansancio, tomamos la dura decision de que, a pesar de la distancia, queríamos estar juntos. Y así empezó todo. Realmente empezo por una conversacion dias atras sobre Molekula, pero bueno, eso es otra historia.",
    imagen: "lotus_flower.png"
  },
  {
    fecha: "Entre 29 de Junio y 3 de Julio 2026 (no me acuerdo las fechas exactas)",
    titulo: "Cosas que pasamos",
    texto: "Creamos playlist con las canciones preferidad del otro y comenzamos a recomendarnos diariamente una. Te puse de apodo Venni y tu a mi Alex. Me presentaste a tu grupo de amigos de Valencia. Por los jajas te saque la localizacion con solo una foto desde tu balcón. Compartimos bibliotecas de Steam. Lograste hacerme romper algunos de mis principios, ya sabes cuales. ;]",
    imagen: "gato.jpg"
  },
    {
    fecha: "1 de Julio 2026",
    titulo: "La carta",
    texto: "Aburrido y con ganas de hacer algo lindo, te escribí una carta y me fui junto a Guille a Almeria capital de misión secundaria hasta la oficina de correos para mandarla a tu casa. Me senti super nervioso pero feliz... Luego me quede sin bateria en el movil y Guille y yo nos perdimos, al final logramos volver a casa.",
    imagen: "carta.png"
  },
  {
    fecha: "3 de Julio 2026",
    titulo: "Detallito",
    texto: "Decidi crear esta página para recordar todos los momentos que hemos vivido y viviremos juntos.",
    imagen: "corazon.jpg"
  },

  // Añade momentos copiando este formato:
  // {
  //   fecha: "",
  //   titulo: "",
  //   texto: "",
  //   imagen: ""
  // },

];

/* ================================================================
   A partir de aquí es la lógica que construye la página.
   ================================================================ */

const container = document.getElementById('momentsContainer');

momentos.forEach((momento) => {
  const section = document.createElement('section');
  section.className = 'moment';
  section.setAttribute('data-moment', '');

  const imageHTML = momento.imagen
    ? `<div class="moment-image"><img src="${momento.imagen}" alt="${momento.titulo}" loading="lazy"></div>`
    : '';

  section.innerHTML = `
    <div class="moment-content">
      <div class="moment-text">
        <div class="moment-date">${momento.fecha}</div>
        <div class="moment-title">${momento.titulo}</div>
        <div class="moment-body">${momento.texto}</div>
      </div>
      ${imageHTML}
    </div>
  `;
  container.appendChild(section);
});

// Todas las secciones de la presentación (portada + momentos + cierre)
const allMoments = Array.from(document.querySelectorAll('[data-moment]'));

// Construye los puntos de la línea lateral, uno por sección
const sideTrack = document.getElementById('sideTrack');
const dotEls = allMoments.map((el, i) => {
  const dot = document.createElement('div');
  dot.className = 'side-dot';
  dot.addEventListener('click', () => el.scrollIntoView({ behavior:'smooth' }));
  sideTrack.appendChild(dot);
  return dot;
});

function layoutSideNav(){
  const gap = Math.min(56, Math.max(28, (window.innerHeight - 200) / Math.max(allMoments.length - 1, 1)));
  const totalHeight = gap * (allMoments.length - 1);
  sideTrack.style.height = totalHeight + 'px';
  dotEls.forEach((dot, i) => { dot.style.top = (gap * i) + 'px'; });
}
layoutSideNav();
window.addEventListener('resize', layoutSideNav);

const sideFill = document.getElementById('sideFill');

// Controla, para cada sección: cuál está activa (pantalla completa),
// cuál es la anterior (se encoge y sube), y el relleno de la línea.
let activeIndex = 0;

function setActive(index){
  if (index === activeIndex) return;
  allMoments[activeIndex].classList.remove('is-active');
  allMoments[activeIndex].classList.add('is-prev');
  allMoments[index].classList.remove('is-prev');
  allMoments[index].classList.add('is-active');
  activeIndex = index;

  dotEls.forEach((dot, i) => dot.classList.toggle('active', i === index));
  const percent = allMoments.length > 1 ? (index / (allMoments.length - 1)) * 100 : 0;
  sideFill.style.height = percent + '%';
}

// primer punto activo desde el inicio
allMoments[0].classList.add('is-active');
dotEls[0].classList.add('active');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.55){
      const idx = allMoments.indexOf(entry.target);
      if (idx !== -1) setActive(idx);
    }
  });
}, { threshold: [0.55] });

allMoments.forEach(el => observer.observe(el));

// =====================
// Snapping al usar la rueda
// =====================
let isScrollingByWheel = false;
let scrollTimeout = null;

function onWheel(e){
  const delta = e.deltaY;
  if (Math.abs(delta) < 10) return; // ignora pequeños movimientos
  // queremos controlar el scroll para hacer "snap", así que prevenimos el default
  e.preventDefault();
  if (isScrollingByWheel) return;

  if (delta > 0 && activeIndex < allMoments.length - 1){
    allMoments[activeIndex + 1].scrollIntoView({ behavior: 'smooth' });
  } else if (delta < 0 && activeIndex > 0){
    allMoments[activeIndex - 1].scrollIntoView({ behavior: 'smooth' });
  }

  isScrollingByWheel = true;
  clearTimeout(scrollTimeout);
  // Liberar bloqueo después de la animación
  scrollTimeout = setTimeout(() => { isScrollingByWheel = false; }, 900);
}

window.addEventListener('wheel', onWheel, { passive: false });
