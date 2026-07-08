/* const apiJSON = "https://data.loire-atlantique.fr/api/explore/v2.1/catalog/datasets/793866443_fetes-et-manifestations-en-loire-atlantique/records?limit=-1"; */

import { constructionURLIFrame, extraireCategorie, filtreCategorie } from "./utils.js";


//export qui permet de supprimer la limite de 100 éléments -> du coup ma carte affiche le bon nombre d'éléments par rapport à mes cartes, sans ça j'avais trois éléments ciné, mais beaucoup plus sur la carte, c'est perturbant.
const apiJSON = "https://data.loire-atlantique.fr/api/explore/v2.1/catalog/datasets/793866443_fetes-et-manifestations-en-loire-atlantique/exports/json";

const sectionCartes = document.getElementById("sectionCartes");
const navBarre = document.getElementById("navBarre");
const map = document.getElementById("map");
const menu = document.getElementById("spanMenu");

const createMenu = (categoriesUniques, mesDonnees) => {
    let i = 0;
    navBarre.innerHTML=`<p class="buttonCategorie" id="all">Afficher tous les évènements</p>`;
    document.getElementById("all").onclick = () => {
                navBarre.classList.add("cache")
                afficherMap("9,47.29786,-1.69739", "codepostal")
                createCard(mesDonnees);
            }
    categoriesUniques.forEach((categorie) => {
        if(categorie != null){
            const liste = `<p class="buttonCategorie" id="${i}">${categorie}</p>`;
            navBarre.insertAdjacentHTML("beforeend", liste)
            document.getElementById(i).onclick = () => {
                navBarre.classList.add("cache")
                afficherMap("9,47.29786,-1.69739", "codepostal", categorie)
                createCard(mesDonnees, categorie);
            }
            i++;
        }
        
    })
}

const createCard = (mesDonnees, categorie) => {
    let i = 0;
    sectionCartes.innerHTML = "";
    let donneesAAfficher = mesDonnees;

    if (categorie != undefined) {
        donneesAAfficher = filtreCategorie(mesDonnees, categorie);
    }

    donneesAAfficher.forEach(event => {
        const card =   `<article class="card" id="card_${i}">
                            <p class="categorie"> ${event.categorie}</p>
                            <h3 class="titreEvent"> ${event.nomoffre} </h3>
                            <p class="lieu">${event.codepostal} ${event.commune}</p>
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

const afficherMap = (coordonates, tri, categorie) => {
    map.innerHTML="";
    map.insertAdjacentHTML("beforeend", constructionURLIFrame(coordonates, tri, categorie));
}

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



const fetchData = async () => {
  try {
    // Récupérer les données de l'API -> fetch
    const response = await fetch(apiJSON)
    // Transformer en json -> .json()
    const mesDonnees  = await response.json()
    //console.log(mesDonnees)
    
    
   
    //itération des données, pour récupérer tous ce dont on a besoin
    
    //création du menu
    createMenu(extraireCategorie(mesDonnees), mesDonnees);
    
    //création des cartes        
    createCard(mesDonnees)

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

