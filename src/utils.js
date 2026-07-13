/**
 * Retourne une date au format américain, pour utilisation des fonctions de dates de JS
 * 
 * @param {String} dateNonParse //format 25/12/2026 
 * @returns {Date} //format 12/25/2026
 */
export const parseDate = (dateNonParse) =>{
    const tabDate = dateNonParse.split('/');

    const dateValide = `${tabDate[1]}/${tabDate[0]}/${tabDate[2]}`;

    return new Date(dateValide);
}

/**
 * Retourne une date au format FR 
 * 
 * 
 * @param {String} dateNonParse //format 10/07/2026||10/07/2026||20:00||20:00||||,11/07/2026||11/07/2026||20:00||20:00||||,12/07/2026||12/07/2026||18:00||18:00||||
 * @returns {String} //format 10/07/2026
 */
export  const obtenirPremiereDate = (dateNonParse) => {
    let tabDate = dateNonParse.split(",");
    tabDate = tabDate[0].split("||");

    return parseDate(tabDate[0]);
}

/**
 * Retourne un tableau d'objet, trié par date
 * 
 * 
 * @param {Array[Object]} mesDonnees 
 * @returns {Array[Object]}
 */
export const trierParDate = (mesDonnees) => {
    const maCopieDonnees = [...mesDonnees];
    return maCopieDonnees.sort((a , b) => obtenirPremiereDate(a.ouverturegranule) - obtenirPremiereDate(b.ouverturegranule));
    
}

/**
 * Retourn un tableau d'objet, trié par nom
 * 
 * 
 * @param {Array[Object]} mesDonnees 
 * @returns {Array[Object]}
 */
export const trierParNom = (mesDonnees) => {
    const maCopieDonnees = [...mesDonnees];
    return maCopieDonnees.sort((a , b) => a.nomoffre.localeCompare(b.nomoffre, "fr", { ignorePunctuation: true }));
}

/**
 * Retourne un tableau d'objet, dont les noms contiennent la chaine passsée en paramètres
 * 
 * 
 * @param {Array[Object]} data 
 * @param {String} string 
 * @returns {Array[Object]}
 */
export const searchFunct = (data, string) => {
    if (string.trim() === "") {
        return data;
    }

    const rechercheNettoyee = retirerAccents(string.toLowerCase());
    const maRecherche = [];
    console.log(data)
    data.forEach(element => {
        const titreNettoye = retirerAccents(element.nomoffre.toLowerCase());
        if (titreNettoye.includes(rechercheNettoyee)) {
            maRecherche.push(element);
        }
    });
    
    return maRecherche;
};


/**
 * Retourne une chaine de caractères pour une insertion HTML, à partir d'une chaine de dates non-formatée 
 * 
 * @param {String} dates //format 10/07/2026||10/07/2026||20:00||20:00||||,11/07/2026||11/07/2026||20:00||20:00||||,12/07/2026||12/07/2026||18:00||18:00||||
 * @returns {String}
 */
export const formaterDate = (dates) =>{
    let monRetour = "<details class='heure'><summary>Voir dates et heures</summary>";

    dates.split(",").forEach((date) => {
        monRetour += "<span class = 'heure'>";
        const maDate = date.split("||");

        if(maDate[1] == "" || maDate[1] == undefined){
            monRetour += "";
        }
        else if(maDate[1] == maDate[0]){
            monRetour += `Le ${maDate[0]} `;
        }else{
            monRetour += `Du ${maDate[0]} au ${maDate[1]} `;
        }

        if(maDate[2] == "" || maDate[2] == undefined){
            monRetour += "";
        }
        else if(maDate[2] == maDate[3]){
            monRetour += `à ${maDate[2]} `;
        }else if(maDate[3] == ""){
            monRetour += `dès ${maDate[2]} `;
        }else {
            monRetour += `de ${maDate[2]} à ${maDate[3]}`;
        }
        monRetour += "</span><br>";
    })

    monRetour += "</details>";


    return monRetour;
}


/**
 * Reçoit une chaine de caractères avec accent, et la retourne sans accents (aidée de l'IA)
 * 
 * 
 * @param {String} texte 
 * @returns {String}
 */
export const retirerAccents = (texte) => {
   return texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


/**
 * Retourne un tableau contenant les différentes catégories, sans doublons
 * 
 * @param {Array[Object]} mesDonnees 
 * @returns {Array[Object]}
 */
export const extraireCategorie = (mesDonnees) => {
    const mesCategories = new Set(mesDonnees.map(item => item.categorie))

    return Array.from(mesCategories);

}

/**
 * Filtre un tableau de données et retourne celles contenant uniquement la bonne catégorie
 * 
 * @param {Array[Object]} mesDonnees 
 * @param {String} categorie 
 * @returns 
 */
export const filtreCategorie = (mesDonnees, categorie) => {
    return mesDonnees.filter((filtre) => filtre.categorie === categorie);
    
}


/**
 * Retourne un iframme injectable en HTML pour affichage d'une map grâce aux coordonnées, la catégorie, et un tri
 * 
 * 
 * @param {String} coordonates 
 * @param {String} tri 
 * @param {String} categorie 
 * @returns 
 */
export const constructionURLIFrame = (coordonates, tri, categorie) => {
    let parametre = "";
    if(categorie != undefined){
        parametre = `refine.categorie=${categorie}&`;
    }

    return `<iframe src="https://data.loire-atlantique.fr/explore/embed/dataset/793866443_fetes-et-manifestations-en-loire-atlantique/map/?disjunctive.commune&sort=${tri}&location=${coordonates}&${parametre}basemap=jawg.streets&static=false&datasetcard=false&scrollWheelZoom=true" frameborder="0"></iframe>`
}

//objet
const iconesCategories = {
  "Stages-Atelier-Jeux": "🛠️",
  "Concert": "🎵",
  "Manifestation sportive": "⚽",
  "Foire ou salon": "🎡",
  "Contes et lectures": "📖",
  "Exposition": "🖼️",
  "Randonnée": "🥾",
  "Spectacle": "✨",
  "Cinéma": "🎬",
  "Fêtes populaires": "🎉",
  "Sortie nature / environnement": "🌳",
  "Visites et sorties à thèmes": "🧭",
  "Théâtre": "🎭",
  "Brocantes & vide-greniers": "🧺",
  "Manifestation Nationale": "🇫🇷",
  "Festival": "🎪",
  "Danse (spectacle)": "💃",
  "Feux d'artifice": "🎆",
  "Marché": "🛒",
  "Animations de Noël": "🎄",
  "Conférence": "🎤",
  "Rallye": "🏁",
  "Cirque": "🤹"
};

/**
 * Reçoit une chaine de caractère et renvoie l'icône correspondant
 * 
 * @param {String} categorie 
 * @returns 
 */
export const obtenirIcone = (categorie) => iconesCategories[categorie] ?? "📍";