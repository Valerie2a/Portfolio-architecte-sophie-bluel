function genererWorks(works) {
// Sélectionne la zone où les travaux doivent être affichés
    const galleryElement=document.querySelector(".gallery");
// Réinitialise le contenu avant de générer les travaux
    galleryElement.innerHTML = "";
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
    }
}
// Fonction pour filtrer les travaux
/*function ajouterFiltres (works) {
    const boutonTous=document.querySelector(".btn-all");
    const boutonCategorie1=document.querySelector(".btn-cat1");
    const boutonCategorie2=document.querySelector(".btn-cat2");
    const boutonCategorie3=document.querySelector(".btn-cat3");
 // Ajoute un événement pour afficher tous les travaux
    boutonTous.addEventListener("click",function () {
        genererWorks(works);
    });  
// Ajoute un événement pour afficher les travaux de catégorie 1
    boutonCategorie1.addEventListener("click",function () {
        const filteredWorks = works.filter(function (work) {
            return work.categoryId===1;
        });  
        genererWorks (filteredWorks);
    });  
// Ajoute un événement pour afficher les travaux de catégorie 2     
    boutonCategorie2.addEventListener("click",function () {
        const filteredWorks = works.filter(function (work) {
            return work.categoryId===2;
        });  
        genererWorks (filteredWorks);
    });  
// Ajoute un événement pour afficher les travaux de catégorie 3  
    boutonCategorie3.addEventListener("click",function () {
        const filteredWorks = works.filter(function (work) {
            return work.categoryId===3;
        });  
        genererWorks (filteredWorks);
    });    
}*/
function ajouterFiltres(works) {
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
            genererWorks(filteredWorks);
        });
    });
}
   
// Récupère les travaux via l'API 
    fetch("http://localhost:5678/api/works")
.then((response) => response.json())
.then ((works)=> {
    genererWorks(works);// Génère tous les travaux au chargement initial
    ajouterFiltres(works);// Ajoute les filtres aux boutons
})  
.catch((error) => {
    console.error("Erreur : ", error);
  });
