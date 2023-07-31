function isAtEndOfScroll() {
  // Obtenemos la altura total del contenido (altura del documento completo).
  const contentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );

  // Obtenemos la altura visible del viewport.
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  // Obtenemos la posición actual del scroll (cuántos píxeles se han desplazado).
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

  // Calculamos la diferencia entre la altura total del contenido y la altura visible del viewport.
  const scrollDifference = contentHeight - viewportHeight;

  // Comparamos la posición actual del scroll con la diferencia calculada.
  return scrollPosition >= scrollDifference;
}

function smoothScroll(targetY, duration) {
  const startY = window.scrollY || window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(timestamp) {
    const currentTime = timestamp || performance.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeOutQuart(progress);
    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// Función de interpolación para una animación más suave
function easeOutQuart(t) {
  return 1 - (--t) * t * t * t;
}

function convertToCSV(data, filename) {
  const csvContent = "data:text/csv;charset=utf-8," + data.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename + ".csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Uso: Desplazarse suavemente a 1000 píxeles desde la parte superior en 1000 milisegundos.
// smoothScroll(1000, 1000);

selector = 'a.css-4rbku5.css-18t94o4.css-1dbjc4n.r-1loqt21.r-1wbh5a2.r-dnmrzs.r-1ny4l3l'
const enlaces = [];
i = '0'

function checkScroll() {
  // Si no hemos llegado al final de la página, realizamos el desplazamiento suave.
  if (!isAtEndOfScroll()) {
    const elementos = document.querySelectorAll(selector);
    enlaces.push(...elementos);
    i++
    page = i + '000'
    smoothScroll(page, 1000);
  }
}

// Intervalo de tiempo para verificar el scroll cada 100 milisegundos.
const scrollCheckInterval = setInterval(checkScroll, 1000);

// Evento para detener el intervalo cuando se llegue al final de la página.
window.addEventListener('scroll', () => {
  if (isAtEndOfScroll()) {
    clearInterval(scrollCheckInterval);
    const enlacesConArroba = Array.from(enlaces).filter((enlace) => enlace.innerText.includes('@'));
    const enlacesSinDuplicados = Array.from(enlacesConArroba);
    const enlacesUnicosSet = new Set(enlacesSinDuplicados);

    exportToCSV(enlacesUnicosSet, 'followers');
  }
});