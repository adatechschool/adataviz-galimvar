import {
    searchFunct,
    formaterDate,
    retirerAccents,
    extraireCategorie,
    filtreCategorie,
    constructionURLIFrame,
    obtenirIcone,
} from "./utils.js";

import { describe, expect, test } from "vitest";

describe("searchFunct", () => {
    const data = [
        { nomoffre: "Cinéma" },
        { nomoffre: "Cine" },
        { nomoffre: "Sinécure" },
        { nomoffre: "Alpine" },
    ];

    test("devrait trouver les éléments correspondants (insensible à la casse et aux accents)", () => {
        const resultat = searchFunct(data, "cine");
        // "Cinéma" (Ciné), "Cine" (Cine), "Sinécure" (Ciné) correspondent
        expect(resultat).toEqual([
            { nomoffre: "Cinéma" },
            { nomoffre: "Cine" },
        ]);
    });

    test("devrait retourner tous les éléments si la recherche est vide", () => {
        expect(searchFunct(data, "  ")).toEqual(data);
    });

    test("devrait retourner un tableau vide si aucune correspondance", () => {
        expect(searchFunct(data, "Zzzzz")).toEqual([]);
    });
});

describe("retirerAccents", () => {
    test("devrait supprimer les accents", () => {
        expect(retirerAccents("éàçôî")).toBe("eacoi");
    });
});

describe("extraireCategorie", () => {
    test("devrait extraire les catégories uniques", () => {
        const data = [
            { categorie: "Concert" },
            { categorie: "Cinéma" },
            { categorie: "Concert" },
        ];
        const resultat = extraireCategorie(data);
        expect(resultat).toEqual(["Concert", "Cinéma"]);
        expect(resultat.length).toBe(2);
    });
});

describe("filtreCategorie", () => {
    test("devrait filtrer par catégorie", () => {
        const data = [{ categorie: "Concert" }, { categorie: "Cinéma" }];
        expect(filtreCategorie(data, "Cinéma")).toEqual([
            { categorie: "Cinéma" },
        ]);
    });
});

describe("obtenirIcone", () => {
    test("devrait retourner l'icône correspondante", () => {
        expect(obtenirIcone("Cinéma")).toBe("🎬");
    });

    test("devrait retourner l'icône par défaut si catégorie inconnue", () => {
        expect(obtenirIcone("Inconnu")).toBe("📍");
    });
});




describe("constructionURLIFrame", () => {
    test("devrait un iframe complet", () => {
        expect(
            constructionURLIFrame(
                "9,47.29786,-1.69739",
                "codepostal",
                "Cinéma",
            ),
        ).toBe(
            `<iframe src="https://data.loire-atlantique.fr/explore/embed/dataset/793866443_fetes-et-manifestations-en-loire-atlantique/map/?disjunctive.commune&sort=codepostal&location=9,47.29786,-1.69739&refine.categorie=Cinéma&basemap=jawg.streets&static=false&datasetcard=false&scrollWheelZoom=true" frameborder="0"></iframe>`,
        );
    });

    test("devrait retourner un iframe sans refine", () => {
        expect(constructionURLIFrame("9,47.29786,-1.69739", "codepostal")).toBe(
            `<iframe src="https://data.loire-atlantique.fr/explore/embed/dataset/793866443_fetes-et-manifestations-en-loire-atlantique/map/?disjunctive.commune&sort=codepostal&location=9,47.29786,-1.69739&basemap=jawg.streets&static=false&datasetcard=false&scrollWheelZoom=true" frameborder="0"></iframe>`,
        );
    });
});



describe("formaterDate", () => {
//========================================================
//=====================  TODO ============================
//========================================================

});
