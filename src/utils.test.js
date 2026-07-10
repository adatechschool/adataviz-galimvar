import {
    searchFunct,
    formaterDate,
    retirerAccents,
    extraireCategorie,
    filtreCategorie,
    constructionURLIFrame,
    obtenirIcone,
    trierParDate,
    trierParNom,
    parseDate,
    obtenirPremiereDate,
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



describe('formaterDate', () => {

    test("affiche 'Le' quand la date de début et de fin sont identiques", () => {
        const input = "20/07/2026||20/07/2026||17:00||18:00||||";
        const resultat = formaterDate(input);
        expect(resultat).toContain('Le 20/07/2026');
    });

    test("affiche 'Du...au' quand les dates de début et de fin sont différentes", () => {
        const input = "20/07/2026||25/07/2026||17:00||18:00||||";
        const resultat = formaterDate(input);
        expect(resultat).toContain('Du 20/07/2026 au 25/07/2026');
    });

    test("affiche 'à' quand l'heure de début et de fin sont identiques", () => {
        const input = "22/07/2026||22/07/2026||19:00||19:00||||";
        const resultat = formaterDate(input);
        expect(resultat).toContain('à 19:00');
    });

    test("affiche 'de...à' quand les heures de début et de fin sont différentes", () => {
        const input = "20/07/2026||20/07/2026||17:00||18:00||||";
        const resultat = formaterDate(input);
        expect(resultat).toContain('de 17:00 à 18:00');
    });

    test("n'affiche rien pour l'heure quand il n'y a aucune heure renseignée", () => {
        const input = "03/10/2026||03/10/2026||||||||";
        let resultat = formaterDate(input);
        expect(resultat).not.toContain('à undefined');
        resultat = resultat.split(' ');
        expect(resultat).not.toContain('de');
    });

    test("affiche l'heure de début seule quand l'heure de fin est absente", () => {
        const input = "22/07/2026||22/07/2026||19:00||||||";
        const resultat = formaterDate(input);
        expect(resultat).toContain('19:00');
    });

    test("gère plusieurs occurrences séparées par une virgule", () => {
        const input = "10/07/2026||10/07/2026||20:00||20:00||||,11/07/2026||11/07/2026||20:00||20:00||||,12/07/2026||12/07/2026||18:00||18:00||||";
        const resultat = formaterDate(input);
        expect(resultat).toContain('10/07/2026');
        expect(resultat).toContain('11/07/2026');
        expect(resultat).toContain('12/07/2026');
    });


});


describe("trierParNom", () => {
    test("devrait trier les objets par nomoffre par ordre alphabétique", () => {
        const data = [{ nomoffre: "Zèbre" }, { nomoffre: "Albatros" }];
        const resultat = trierParNom(data);
        expect(resultat[0].nomoffre).toBe("Albatros");
        expect(resultat[1].nomoffre).toBe("Zèbre");
    });
});

describe("trierParDate", () => {
    test("devrait trier les objets par date croissante", () => {
        const data = [
            { nomoffre: "Ancien", ouverturegranule: "01/01/2026||01/01/2026||10:00||12:00" },
            { nomoffre: "Récent", ouverturegranule: "01/02/2026||01/02/2026||10:00||12:00" }
        ];
        const resultat = trierParDate(data);
        expect(resultat[0].nomoffre).toBe("Ancien");
        expect(resultat[1].nomoffre).toBe("Récent");
    });
});

describe("parseDate", () => {
    test("devrait transformer une chaîne DD/MM/YYYY en objet Date valide", () => {
        const resultat = parseDate("25/12/2026");
        expect(resultat.getFullYear()).toBe(2026);
        expect(resultat.getMonth()).toBe(11);
        expect(resultat.getDate()).toBe(25);
    });
});

describe("obtenirPremiereDate", () => {
    test("devrait extraire et parser la première date d'une chaîne complexe", () => {
        const dateString = "15/07/2026||16/07/2026||09:00||18:00";
        const resultat = obtenirPremiereDate(dateString);
        
        expect(resultat.getFullYear()).toBe(2026);
        expect(resultat.getMonth()).toBe(6);
        expect(resultat.getDate()).toBe(15);
    });

    test("devrait gérer une chaîne contenant plusieurs événements séparés par des virgules", () => {
        const dateString = "10/01/2026||10/01/2026||10:00||12:00,12/01/2026||12/01/2026||14:00||16:00";
        const resultat = obtenirPremiereDate(dateString);
        
        expect(resultat.getDate()).toBe(10);
        expect(resultat.getMonth()).toBe(0);
    });
});