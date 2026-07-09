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

        if(maDate[3] == "" || maDate[3] == undefined){
            monRetour += "";
        }
        else if(maDate[2] == maDate[3] && maDate[2] != ""){
            monRetour += `à ${maDate[2]} `;
        }else{
            monRetour += `de ${maDate[2]} à ${maDate[3]}`;
        }
        monRetour += "</span><br>";
    })

    monRetour += "</details>";


    return monRetour;
}

export const retirerAccents = (texte) => {
   return texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const extraireCategorie = (mesDonnees) => {
    const mesCategories = new Set(mesDonnees.map(item => item.categorie))

    return Array.from(mesCategories);

}

export const filtreCategorie = (mesDonnees, categorie) => {
    return mesDonnees.filter((filtre) => filtre.categorie === categorie);
    
}

export const constructionURLIFrame = (coordonates, tri, categorie) => {
    let parametre = "";
    if(categorie != undefined){
        parametre = `refine.categorie=${categorie}&`;
    }

    return `<iframe src="https://data.loire-atlantique.fr/explore/embed/dataset/793866443_fetes-et-manifestations-en-loire-atlantique/map/?disjunctive.commune&sort=${tri}&location=${coordonates}&${parametre}basemap=jawg.streets&static=false&datasetcard=false&scrollWheelZoom=true" frameborder="0"></iframe>`
}


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

export const obtenirIcone = (categorie) => iconesCategories[categorie] ?? "📍";