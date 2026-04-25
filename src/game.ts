import inventaire from "./inventaire.ts"
window.inventaire = inventaire;

import salle from "./salle.ts"
window.salle = salle;

import item from "./item.ts"
window.item = item;

import carte from "./carte.ts"
window.carte = carte;

import stat from "./stat.ts"
window.stat = stat;

window.recommencer = () => {
    stat.clear();
    inventaire.clear();
    salle.clear();
    carte.clear();
    scene_show('presentation');
}
