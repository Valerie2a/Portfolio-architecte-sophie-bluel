function genererWorks(works, galleryElement, modalWrapperElement= null) {
    
// Réinitialise le contenu avant de générer les travaux
    galleryElement.innerHTML = "";
    if (modalWrapperElement) {
        let thumbnailsContainer = modalWrapperElement.querySelector(".thumbnails-container");
        
        if (!thumbnailsContainer) {
            thumbnailsContainer = document.createElement("div");
            thumbnailsContainer.classList.add("thumbnails-container");
            modalWrapperElement.appendChild(thumbnailsContainer);
        } else {
            thumbnailsContainer.innerHTML = ""; // vide le contenu du contenair des vignettes, conserve les autres elements
        }
    }

// Parcourt la liste des travaux et génère le HTML pour chaque travail
    for (let i = 0; i < works.length; i++) {
    const work = works[i];
//Création des elements HTML
    const figureElement = document.createElement("figure");
    const imgElement = document.createElement("img");
    const figcaptionElement = document.createElement("figcaption");
// Ajout des propriétés des éléments
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;
    figcaptionElement.textContent = work.title;
// Ajout des enfants à l'element figure
    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
// Ajout des enfants element figure à l'element gallery
    galleryElement.appendChild(figureElement);
// Ajout des elements de la modale 
if (modalWrapperElement) {
    const modalFigure = document.createElement("figure");
    const modalImg = document.createElement("img");

    modalImg.src = work.imageUrl;
    modalImg.alt = work.title;
    modalImg.classList.add("thumbnail"); // Ajout de la class vignette

    modalFigure.appendChild(modalImg);
    // Ajout dans le conteneur des vignettes
    modalWrapperElement.querySelector(".thumbnails-container").appendChild(modalFigure);
    }
    }
} 
function ajouterFiltres(works, galleryElement) {
    const buttons = document.querySelectorAll(".bouton button");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const selectedClass = this.classList[0]; // Récupère la classe du bouton cliqué

            let filteredWorks;
            if (selectedClass === "btn-all") {
                filteredWorks = works; // Affiche tous les travaux
            } else {
                // Extrait le numéro de la catégorie depuis la classe (ex: "btn-cat1" -> 1)
                const categoryNumber = selectedClass.replace("btn-cat", ""); 
                filteredWorks = works.filter(function(work) {
                    return work.categoryId == categoryNumber;
                });
            }
            genererWorks(filteredWorks, galleryElement);
        });
    });
}
   
// Récupère les travaux via l'API 
    fetch("http://localhost:5678/api/works")
.then((response) => response.json())
.then ((works)=> {
    const galleryElement = document.querySelector(".gallery");
    const modalWrapperElement = document.querySelector(".modal-wrapper");

    genererWorks(works, galleryElement, modalWrapperElement);// Génère tous les travaux au chargement initial
    ajouterFiltres(works, galleryElement);// Ajoute les filtres aux boutons
})  
.catch((error) => {
    console.error("Erreur : ", error);
  });
