const pixelGrid = document.getElementById("pixelGrid");
const modal = document.getElementById("formModal");
const modalContent = document.getElementById("modalContent");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const storyInput = document.getElementById("story");
const modalTitle = document.getElementById("modalTitle");
const inputGroup = document.getElementById("inputGroup");
const submitBtn = document.getElementById("submitButton");

const JSONBIN_API_KEY = '$2b$10$S9mIWcrd3Tm3KYY7nI0L1ufod9JArMsVG.S8LYwSh.TqbjpplH.Si'; // ⚠️ Solo para pruebas
const BIN_ID = '61466bc34a82881d6c519a27';
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let stories = {};
let selectedKey = "";

// Cargar historias desde JSONBin y renderizar el grid
async function cargarHistorias() {
  try {
    const res = await fetch(`${API_URL}/latest`, {
      headers: { 'X-Master-Key': JSONBIN_API_KEY }
    });
    const data = await res.json();
    stories = data.record || {};
    renderGrid();
  } catch (error) {
    alert("Error al cargar historias desde la nube.");
  }
}

// Construir el grid 25x20 y marcar los revelados
function renderGrid() {
  pixelGrid.innerHTML = "";

  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 25; col++) {
      const key = `tile_${row}_${col}`;
      const tile = document.createElement("div");
      tile.classList.add("pixel");
      tile.dataset.key = key;

      const img = document.createElement("img");
      img.src = `tiles/${key}.png`;
      tile.appendChild(img);

      if (stories[key]) tile.classList.add("revealed");

      tile.onclick = () => abrirModalHistoria(key);
      pixelGrid.appendChild(tile);
    }
  }
}

// Abrir modal: nuevo o historia guardada
function abrirModalHistoria(key) {
  selectedKey = key;

  if (stories[key]) {
    const nombre = stories[key].name?.trim() || "";
    const titulo = nombre !== "" ? `Historia de ${nombre}` : "Historia de Anónimo";
    modalTitle.innerHTML = `<strong>${titulo}</strong>`;
    storyInput.value = stories[key].story;
    inputGroup.style.display = 'none';
    storyInput.disabled = true;
    submitBtn.style.display = 'none';
    modalContent.classList.add("story-readonly");

    const prevButtons = document.querySelector(".social-buttons");
    if (prevButtons) prevButtons.remove();
    mostrarBotonesRedes(stories[key].story);

  } else {
    modalTitle.textContent = "Comparte tu historia";
    nameInput.value = "";
    emailInput.value = "";
    storyInput.value = "";
    nameInput.disabled = false;
    emailInput.disabled = false;
    storyInput.disabled = false;
    inputGroup.style.display = 'flex';
    submitBtn.style.display = 'block';
    modalContent.classList.remove("story-readonly");

    const prevButtons = document.querySelector(".social-buttons");
    if (prevButtons) prevButtons.remove();
  }

  modal.style.display = "flex";
}

// Enviar historia a JSONBin
async function submitStory() {
  if (!emailInput.value || !storyInput.value) {
    alert("Por favor, ingresa tu correo e historia.");
    return;
  }

  const nuevaHistoria = {
    name: nameInput.value || "Anónimo",
    email: emailInput.value,
    story: storyInput.value
  };

  stories[selectedKey] = nuevaHistoria;

  try {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify(stories)
    });

    if (res.ok) {
      document.querySelector(`[data-key="${selectedKey}"]`).classList.add("revealed");
      modal.style.display = "none";
      document.getElementById("donationModal").style.display = "flex";
    } else {
      throw new Error("No se pudo guardar.");
    }
  } catch (error) {
    alert("Error al guardar la historia en la nube.");
  }
}

// Compartir en redes
function mostrarBotonesRedes(texto) {
  const container = document.createElement("div");
  container.className = "social-buttons";

  const redes = [
    {
      src: "./imagenes/whatsapp.jpg",
      alt: "WhatsApp",
      link: `https://wa.me/?text=${encodeURIComponent(texto)}`
    },
    {
      src: "./imagenes/facebook.jpg",
      alt: "Facebook",
      link: `https://www.facebook.com/sharer/sharer.php?u=https://ejemplo.com&quote=${encodeURIComponent(texto)}`
    },
    {
      src: "./imagenes/twitter.png",
      alt: "Twitter",
      link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}`
    },
    {
      src: "./imagenes/linkedin.jpg",
      alt: "LinkedIn",
      link: `https://www.linkedin.com/sharing/share-offsite/?url=https://ejemplo.com`
    }
  ];

  redes.forEach(({ src, alt, link }) => {
    const btn = document.createElement("img");
    btn.src = src;
    btn.alt = alt;
    btn.title = `Compartir en ${alt}`;
    btn.onclick = () => window.open(link, "_blank");
    container.appendChild(btn);
  });

  modalContent.appendChild(container);
}

// Acordeón de categorías
function toggleCategory(element) {
  const content = element.nextElementSibling;
  content.style.display = content.style.display === "block" ? "none" : "block";
}

// Cerrar modales
function cerrarModalDonacion() {
  document.getElementById("donationModal").style.display = "none";
}
function cerrarModalFormulario() {
  modal.style.display = "none";
}

// Ejecutar
cargarHistorias();
