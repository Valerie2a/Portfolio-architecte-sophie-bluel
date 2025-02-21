// Fonction pour générer les travaux et les afficher dans la galerie et la modale
function genererWorks(works, galleryElement, modalWrapperElement = null) {
  // Réinitialisation de la galerie
  galleryElement.innerHTML = "";

  if (modalWrapperElement) {
    let thumbnailsContainer = modalWrapperElement.querySelector(
      ".thumbnails-container"
    );
    if (thumbnailsContainer) {
      thumbnailsContainer.innerHTML = ""; // On vide uniquement le contenu des vignettes
    }
  }

  // Parcourt la liste des travaux et génère le HTML pour chaque élément
  works.forEach((work) => {
    // Création des éléments HTML pour la galerie principale
    const figureElement = document.createElement("figure");
    const imgElement = document.createElement("img");
    const figcaptionElement = document.createElement("figcaption");

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
      const modalFigure = document.createElement("figure");
      const modalImg = document.createElement("img");
      const trashIcon = document.createElement("i");

      modalImg.src = work.imageUrl;
      modalImg.alt = work.title;
      modalImg.classList.add("thumbnail");
      modalImg.dataset.id = work.id; // Stocke l'ID pour la suppression

      // Ajout d'une icône de suppression avec FontAwesome
      trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");
      trashIcon.dataset.id = work.id; // Stocke aussi l'ID pour la suppression

      // Ajout des éléments à la modale
      modalFigure.appendChild(modalImg);
      modalFigure.appendChild(trashIcon);

      modalWrapperElement
        .querySelector(".thumbnails-container")
        .appendChild(modalFigure);
    }
  });
}

// Fonction pour filtrer les travaux selon la catégorie
function ajouterFiltres(works, galleryElement) {
  const buttons = document.querySelectorAll(".bouton button"); // Sélectionne tous les boutons de filtre

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const selectedClass = this.classList[0]; // Récupère la classe du bouton cliqué
      let filteredWorks;

      if (selectedClass === "btn-all") {
        filteredWorks = works; // Affiche tous les travaux
      } else {
        const categoryNumber = selectedClass.replace("btn-cat", ""); // Extrait l'ID de la catégorie
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
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("trash-icon")) {
      // Vérifie si l'élément cliqué est une icône de poubelle
      const workId = event.target.dataset.id; // Récupère l'ID du travail
      if (!workId) return; // Si aucun ID, on ne fait rien

      // Envoi de la requête DELETE à l'API
      fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Token d'authentification
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Échec de la suppression !");
          }
          return response.text(); // Pas de JSON en retour, donc on utilise .text()
        })
        .then(() => {
          event.target.parentElement.remove(); // Supprime l'élément du DOM après suppression réussie
        })
        .catch((error) =>
          console.error("Erreur lors de la suppression :", error)
        );
    }
  });
}

// Récupération des travaux depuis l'API et initialisation des fonctionnalités
fetch("http://localhost:5678/api/works")
  .then((response) => response.json()) // Conversion de la réponse en JSON
  .then((works) => {
    console.log("Travaux récupérés :", works); // Affiche les données dans la console
    const galleryElement = document.querySelector(".gallery");
    const modalWrapperElement = document.querySelector(".modal-wrapper");

    genererWorks(works, galleryElement, modalWrapperElement); // Génère les travaux dans la galerie et la modale
    ajouterFiltres(works, galleryElement); // Ajoute les filtres
    ajouterSuppressionTravaux(); // Active la suppression des travaux
  })
  .catch((error) =>
    console.error("Erreur lors du chargement des travaux :", error)
  );
