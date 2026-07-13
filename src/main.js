/* const apiJSON = "https://data.loire-atlantique.fr/api/explore/v2.1/catalog/datasets/793866443_fetes-et-manifestations-en-loire-atlantique/records?limit=-1"; */

import { constructionURLIFrame, extraireCategorie, filtreCategorie, formaterDate, obtenirIcone, searchFunct, trierParDate, trierParNom } from "./utils.js";


//export qui permet de supprimer la limite de 100 éléments -> du coup ma carte affiche le bon nombre d'éléments par rapport à mes cartes, sans ça j'avais trois éléments ciné, mais beaucoup plus sur la carte, c'est perturbant.
const apiJSON = "https://data.loire-atlantique.fr/api/explore/v2.1/catalog/datasets/793866443_fetes-et-manifestations-en-loire-atlantique/exports/json";

let mesDonnees;


//objet permettant de sauvegarder les différents filtres de l'utilisateur
let etatFiltres = {
    categorie: undefined,
    dateDebut: undefined,
    dateFin: undefined,
    tri: "date"
};


const sectionCartes = document.getElementById("sectionCartes");
const navBarre = document.getElementById("navBarre");
const map = document.getElementById("map");
const menu = document.getElementById("spanMenu");
const inputSearch = document.getElementById("inputSearch");
const monTri = document.getElementById("monTri");



/**
 * Affiche un menu, en fonction des catégories de l'API, et l'insère en HTML
 * @param {Array[Object]} categoriesUniques 
 * @param {Array[Object]} mesDonnees 
 */
const createMenu = (categoriesUniques, mesDonnees) => {
    let i = 0;
    navBarre.innerHTML=`<p class="buttonCategorie boutonTous" id="all"><span class="icone">🗺️</span><span class="nom">Tous les évènements</span></p>`;
    document.getElementById("all").onclick = () => {
                navBarre.classList.add("cache")
                afficherMap("9,47.29786,-1.69739", "codepostal")
                createCard(mesDonnees);
            }
    categoriesUniques.forEach((categorie) => {
        if(categorie != null){
            const liste = `<p class="buttonCategorie" id="${i}"><span class="icone">${obtenirIcone(categorie)}</span><span class="nom">${categorie}</span></p>`;
            navBarre.insertAdjacentHTML("beforeend", liste)
            document.getElementById(i).onclick = () => {
                etatFiltres.categorie = categorie;
                navBarre.classList.add("cache")
                afficherMap("9,47.29786,-1.69739", "codepostal", categorie)
                rafraichirPage(etatFiltres);
            }
            i++;
        }
        
    })
}


/**
 * Créé et affiche les cartes correspondantes en fonction de la catégorie depuis les données de l'API
 * 
 * 
 * @param {Array[Object]} mesDonnees 
 * @param {String} categorie 
 */
const createCard = (mesDonnees, categorie) => {
    let i = 0;
    sectionCartes.innerHTML = "";
    let donneesAAfficher = mesDonnees;

    if (categorie != undefined) {
        donneesAAfficher = filtreCategorie(mesDonnees, categorie);
    }

    donneesAAfficher.forEach(event => {
        const card =   `<article class="card" id="card_${i}">
                            <p class="categorie"> ${obtenirIcone(event.categorie)}</p>
                            <h3 class="titreEvent"> ${event.nomoffre} </h3>
                            <p class="lieu">${event.codepostal} ${event.commune}</p><p>${formaterDate(event.ouverturegranule)}</p>
                        </article>`;
        sectionCartes.insertAdjacentHTML("beforeend", card);
        document.getElementById(`card_${i}`).onclick = () => {
            afficherMap(`20,${event.latitude},${event.longitude}`, event.nomoffre);
        }; 
        i++;
    });  
    sectionCartes.insertAdjacentHTML("afterbegin", `<h2>Nombre d'évènements : ${i}</h2>`)
    const allCategorie = document.querySelectorAll(".card");
    allCategorie.forEach((el) => observer.observe(el))
}


/**
 * Affiche dynamiquement la map iframe
 * 
 * @param {String} coordonates 
 * @param {String} tri 
 * @param {String} categorie 
 */
const afficherMap = (coordonates, tri, categorie) => {
    map.innerHTML="";
    map.insertAdjacentHTML("beforeend", constructionURLIFrame(coordonates, tri, categorie));
}


/**
 * Renvoie les données correspondantes aux filtres
 * 
 * @param {Object} filtre 
 */
const rafraichirPage = (filtre) => {
    let donneesFiltrees = [...mesDonnees];
    if(etatFiltres.categorie != undefined){
        donneesFiltrees =  filtreCategorie(mesDonnees, etatFiltres.categorie);
    } 
    

    if(etatFiltres.tri == "Nom"){
        donneesFiltrees = trierParNom(donneesFiltrees);
    } else if(etatFiltres.tri == "Date"){
        donneesFiltrees = trierParDate(donneesFiltrees);
    }

    createCard(donneesFiltrees);
}

//Ajoute ou remove la classe quand un élément entre dans l'écran
const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) =>{
            if(entry.isIntersecting){
                entry.target.classList.add("show")
            }
            else{
                entry.target.classList.remove("show")
            }
        })
    }, {})


//récupération données de l'API, appelle les fonctions générant la page
const fetchData = async () => {
  try {
    // Récupérer les données de l'API -> fetch
    const response = await fetch(apiJSON)
    // Transformer en json -> .json()
    mesDonnees  = await response.json()
    //console.log(mesDonnees)
    
    
   
    //itération des données, pour récupérer tous ce dont on a besoin
    
    //création du menu
    createMenu(extraireCategorie(mesDonnees), mesDonnees);
    
    //création des cartes        
    createCard(trierParDate(mesDonnees))

    //affichage dynamique de la carte
    afficherMap("9,47.29786,-1.69739", "codepostal");
  } catch (erreur) {
    console.error(erreur.message)
  }
}

fetchData();

menu.addEventListener("click", () => {
    navBarre.classList.toggle("cache");
})

inputSearch.addEventListener("input", () => {
    const maRecherche = searchFunct(mesDonnees, inputSearch.value);
    createCard(maRecherche);

})

monTri.addEventListener("change", () => {
    etatFiltres.tri = monTri.value;
    console.log(monTri.value)
    rafraichirPage(etatFiltres);
    
})
