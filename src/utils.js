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