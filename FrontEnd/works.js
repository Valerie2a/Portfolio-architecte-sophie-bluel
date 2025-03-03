// Fonction pour générer les travaux et les afficher dans la galerie et la modale
function genererWorks(works, galleryElement, modalWrapperElement = null) {
  // Réinitialisation de la galerie
  galleryElement.innerHTML = '';

  if (modalWrapperElement) {
    let thumbnailsContainer = modalWrapperElement.querySelector(
      '.thumbnails-container'
    );
    if (thumbnailsContainer) {
      thumbnailsContainer.innerHTML = ''; // On vide uniquement le contenu des vignettes
    }
  }

  // Parcourt la liste des travaux et génère le HTML pour chaque élément
  works.forEach((work) => {
    // Création des éléments HTML pour la galerie principale
    const figureElement = document.createElement('figure');
    const imgElement = document.createElement('img');
    const figcaptionElement = document.createElement('figcaption');

    // Assignation des propriétés (image et texte)
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;
    figcaptionElement.textContent = work.title;

    // Ajout des éléments dans la figure
    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);

    // Ajout de la figure à la galerie principale
    galleryElement.appendChild(figureElement);

    // Si une modale est fournie, on y ajoute aussi l'image et l'icône de suppression
    if (modalWrapperElement) {
      const modalFigure = document.createElement('figure');
      const modalImg = document.createElement('img');
      const trashIcon = document.createElement('i');

      modalImg.src = work.imageUrl;
      modalImg.alt = work.title;
      modalImg.classList.add('thumbnail');
      modalImg.dataset.id = work.id; // Stocke l'ID pour la suppression

      // Ajout d'une icône de suppression avec FontAwesome
      trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash-icon');
      trashIcon.dataset.id = work.id; // Stocke aussi l'ID pour la suppression

      // Ajout des éléments à la modale
      modalFigure.appendChild(modalImg);
      modalFigure.appendChild(trashIcon);

      modalWrapperElement
        .querySelector('.thumbnails-container')
        .appendChild(modalFigure);
    }
  });
}

// Fonction pour filtrer les travaux selon la catégorie
function ajouterFiltres(works, galleryElement) {
  const buttons = document.querySelectorAll('.bouton button'); // Sélectionne tous les boutons de filtre

  buttons.forEach((button) => {
    button.addEventListener('click', function () {
      const selectedClass = this.classList[0]; // Récupère la classe du bouton cliqué
      let filteredWorks;

      if (selectedClass === 'btn-all') {
        filteredWorks = works; // Affiche tous les travaux
      } else {
        const categoryNumber = selectedClass.replace('btn-cat', ''); // Extrait l'ID de la catégorie
        filteredWorks = works.filter(
          (work) => work.categoryId == categoryNumber
        ); // Filtrage
      }
      genererWorks(filteredWorks, galleryElement); // Réaffichage des travaux filtrés
    });
  });
}

// Fonction pour gérer la suppression des travaux dans la modale
function ajouterSuppressionTravaux() {
  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('trash-icon')) {
      // Vérifie si l'élément cliqué est une icône de poubelle
      const workId = event.target.dataset.id; // Récupère l'ID du travail
      if (!workId) return; // Si aucun ID, on ne fait rien
      const token = localStorage.getItem('authToken');

      // Envoi de la requête DELETE à l'API
      fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Token d'authentification
        },
      })
        .then((response) => {
          if (!response.ok) {
            console.warn(
              "Échec de la suppression, mais l'application continue normalement."
            );
            return null; // Évite une erreur bloquante
          }
          return response.text(); // Pas de JSON en retour, donc on utilise .text()
        })
        .then(() => {
          event.target.parentElement.remove(); // Supprime l'élément du DOM après suppression réussie
          // Supprimer aussi de la galerie principale
          document
            .querySelectorAll(
              `.gallery img[src="${event.target.previousElementSibling.src}"]`
            )
            .forEach((img) => img.parentElement.remove());
        })
        .catch(() => {});
    }
  });
}

// Récupération des travaux depuis l'API et initialisation des fonctionnalités
fetch('http://localhost:5678/api/works')
  .then((response) => response.json()) // Conversion de la réponse en JSON
  .then((works) => {
    const galleryElement = document.querySelector('.gallery');
    const modalWrapperElement = document.querySelector('.modal-wrapper');

    genererWorks(works, galleryElement, modalWrapperElement); // Génère les travaux dans la galerie et la modale
    ajouterFiltres(works, galleryElement); // Ajoute les filtres
    ajouterSuppressionTravaux(); // Active la suppression des travaux
  })
  .catch(() => {});

const fileInput = document.getElementById('fileElem');
const photoButton = document.getElementById('fileSelect');
const validateButton = document.getElementById('photo');
const photoContainer = document.querySelector('.photo');
const modal2 = document.getElementById('modal2');

// Sauvegarde du contenu d'origine du formulaire
const originalPhotoContent = photoContainer.innerHTML;

// Fonction pour réinitialiser le formulaire
function resetPhotoForm() {
  setTimeout(() => {
    fileInput.value = ''; // Réinitialise l'input file
    photoContainer.innerHTML = originalPhotoContent; // Remet le contenu d'origine

    // Réattribuer l'événement au bouton "Ajouter une photo"
    document
      .getElementById('fileSelect')
      .addEventListener('click', () => fileInput.click());
  }, 300); // Un léger délai pour éviter un bug visuel
}

// Ouvrir le sélecteur de fichiers
photoButton.addEventListener('click', () => fileInput.click());

// Afficher la vignette immédiatement après sélection
fileInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    photoContainer.innerHTML = `
        <img src="${e.target.result}" alt="Image sélectionnée" style="max-width: 100%; height: auto;">
      `;
  };
  reader.readAsDataURL(file);
});

// Validation et ajout de l'image
validateButton.addEventListener('click', function () {
  const titre = document.getElementById('title').value.trim();
  const categorie = Number(document.getElementById('category').value);
  const image = fileInput.files[0];

  if (!titre || isNaN(categorie)) {
    return;
  }

  const token = localStorage.getItem('authToken');
  if (!token) {
    return;
  }

  const formData = new FormData();
  formData.append('image', image);
  formData.append('title', titre);
  formData.append('category', categorie);

  fetch('http://127.0.0.1:5678/api/works', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        return;
      }
      return response.json();
    })
    .then((newWork) => {
      if (!newWork) return;

      // Met à jour la galerie immédiatement
      updateGallery(newWork);

      // Réinitialise le formulaire
      resetPhotoForm();

      closeModal2();
    })
    .catch(() => {});

  // Fonction pour fermer la modale 2
  function closeModal2() {
    if (!modal2) return;
    modal2.classList.remove('modal-active');
    modal2.setAttribute('aria-hidden', 'true');
    modal2.removeAttribute('aria-modal');
    document.body.classList.remove('modal-open');
  }

  // Fonction pour mettre à jour la galerie
  function updateGallery(newWork) {
    const gallery = document.querySelector('.gallery');
    const modalThumbnailsContainer = document.querySelector(
      '.thumbnails-container'
    );

    const figure = document.createElement('figure');
    figure.innerHTML = `
      <img src="${newWork.imageUrl}" alt="${newWork.title}">
      <figcaption>${newWork.title}</figcaption>
    `;
    gallery.appendChild(figure);

    // Ajoute l'image dans la modale avec l'icône de suppression
    const modalFigure = document.createElement('figure');
    const modalImg = document.createElement('img');
    const trashIcon = document.createElement('i');

    modalImg.src = newWork.imageUrl;
    modalImg.alt = newWork.title;
    modalImg.classList.add('thumbnail');
    modalImg.dataset.id = newWork.id;

    trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash-icon');
    trashIcon.dataset.id = newWork.id;

    modalFigure.appendChild(modalImg);
    modalFigure.appendChild(trashIcon);

    modalThumbnailsContainer.appendChild(modalFigure);
  }
});
