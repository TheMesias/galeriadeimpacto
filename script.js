const pixelGrid = document.getElementById("pixelGrid");
const modal = document.getElementById("formModal");
const modalContent = document.getElementById("modalContent");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const storyInput = document.getElementById("story");
const modalTitle = document.getElementById("modalTitle");
const inputGroup = document.getElementById("inputGroup");
const submitBtn = document.getElementById("submitButton");

let selectedKey = "";
const stories = JSON.parse(localStorage.getItem("stories") || "{}");

// Crear grid 25 x 20
for (let row = 0; row < 20; row++) {
  for (let col = 0; col < 25; col++) {
    const key = `tile_${row}_${col}`;
    const tile = document.createElement("div");
    tile.classList.add("pixel");
    tile.dataset.key = key;

    const img = document.createElement("img");
    img.src = `tiles/${key}.png`;
    tile.appendChild(img);

    if (stories[key]) {
      tile.classList.add("revealed");
    }

    tile.onclick = () => {
      selectedKey = key;

      if (stories[key]) {
        // Mostrar historia existente
        const nombre = stories[key].name?.trim() || "";
        const titulo = nombre !== "" ? `Historia de ${nombre}` : "Historia de Anónimo";
        modalTitle.innerHTML = `<strong>${titulo}</strong>`;

        // Sólo rellenamos el textarea
        storyInput.value = stories[key].story;

        // Ocultamos nombre y correo
        inputGroup.style.display = 'none';
        // Deshabilitamos textarea
        storyInput.disabled = true;
        // Ocultamos botón de enviar
        submitBtn.style.display = 'none';
        // Aplicamos estilo readonly
        modalContent.classList.add("story-readonly");

        // Mostramos los botones de redes
        const prevButtons = document.querySelector(".social-buttons");
        if (prevButtons) prevButtons.remove();
        mostrarBotonesRedes(stories[key].story);

      } else {
        // Nuevo envío
        modalTitle.textContent = "Comparte tu historia";

        // Limpiamos y habilitamos campos
        nameInput.value = "";
        emailInput.value = "";
        storyInput.value = "";
        nameInput.disabled = false;
        emailInput.disabled = false;
        storyInput.disabled = false;

        // Volvemos a mostrar inputs y botón
        inputGroup.style.display = 'flex';  // o 'block'
        submitBtn.style.display = 'block';
        modalContent.classList.remove("story-readonly");

        // Quitamos botones de redes si existían
        const prevButtons = document.querySelector(".social-buttons");
        if (prevButtons) prevButtons.remove();
      }

      // Abrimos modal
      modal.style.display = "flex";
    };

    pixelGrid.appendChild(tile);
  }
}


// Guardar historia nueva
function submitStory() {
  if (!emailInput.value || !storyInput.value) {
    alert("Por favor, ingresa tu correo e historia.");
    return;
  }

  const data = {
    name: nameInput.value || "Anónimo",
    email: emailInput.value,
    story: storyInput.value
  };

  stories[selectedKey] = data;
  localStorage.setItem("stories", JSON.stringify(stories));

  document.querySelector(`[data-key="${selectedKey}"]`).classList.add("revealed");
  modal.style.display = "none";

  // Mostrar el modal de donación
  const donationModal = document.getElementById("donationModal");
  donationModal.style.display = "flex";

  // Cerrar donación al hacer clic fuera
  window.onclick = function (e) {
    if (e.target === donationModal) {
      donationModal.style.display = "none";
    }
  };
}

// Cerrar modal si se hace clic fuera
tile.onclick = () => {
  selectedKey = key;

  const modalContent = document.getElementById("modalContent");
  const inputGroup = document.getElementById("inputGroup");
  const submitBtn = document.getElementById("submitButton");

  if (stories[key]) {
    const nombre = stories[key].name?.trim() || "";
    const titulo = nombre !== "" ? `Historia de ${nombre}` : "Historia de Anónimo";
    modalTitle.innerHTML = `<strong>${titulo}</strong>`;

    nameInput.value = stories[key].name;
    emailInput.value = stories[key].email;
    storyInput.value = stories[key].story;

    nameInput.disabled = false;
    emailInput.disabled = true;
    inputGroup.style.display = "none";       // 👈 Ocultar campos
    submitBtn.style.display = "none";        // 👈 Ocultar botón

    storyInput.disabled = true;
    modalContent.classList.add("story-readonly");

    const prevButtons = document.querySelector(".social-buttons");
    if (prevButtons) prevButtons.remove();

    mostrarBotonesRedes(stories[key].story);
  } else {
    modalTitle.textContent = "Comparte tu historia";

    nameInput.value = "";
    emailInput.value = "";
    storyInput.value = "";

    inputGroup.style.display = "block";       // 👈 Mostrar campos
    submitBtn.style.display = "block";        // 👈 Mostrar botón

    nameInput.disabled = false;
    emailInput.disabled = false;
    storyInput.disabled = false;

    modalContent.classList.remove("story-readonly");

    const prevButtons = document.querySelector(".social-buttons");
    if (prevButtons) prevButtons.remove();
  }

  modal.style.display = "flex";
};

// Acordeón para categorías
function toggleCategory(element) {
  const content = element.nextElementSibling;
  const isVisible = content.style.display === "block";
  content.style.display = isVisible ? "none" : "block";
}

// Agregar botones de compartir en redes
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
      link: `https://www.instagram.com/`, // No permite compartir directo con texto
    },
    {
      src: "./imagenes/linkedin.jpg",
      alt: "LinkedIn",
      link: `https://www.tiktok.com/upload`, // Upload manual
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

function cerrarModalDonacion() {
  document.getElementById("donationModal").style.display = "none";
}
