import cartes from "./data/cartes.json"

import salle from "./salle.ts"
import stat from "./stat.ts"
import inventaire from "./inventaire.ts"

let no_carte_left_loser = {
    id: "no_carte_left_loser",
    name: "Nothing to see, take that candy",
    content: "You can't do much, exept staring at the ceiling, and swallow that candy",
    reference: null,
    salle: ["morgue", "rest_room", "lab", "office", "isolation"],
    stats: {
        sante: 0,
        lucide: 0,
        stress: 0
    },
    deal: [
        {
            sante: 2,
            lucide: 1,
            stress: 1
        },
        {
            sante: 1,
            lucide: 1,
            stress: 2
        }
    ],
    ingredients: [],
    craft: [null, null],
    consume: [null, null],
    image: "assets/innexistant.png"
};

let first_carte = {
    id: "first",
    name: "Welcome to the lab",
    content: "Welcome to the lab",
    reference: null,
    salle: ["morgue", "rest_room", "lab", "office", "isolation"],
    stats: {
        sante: 0,
        lucide: 0,
        stress: 0
    },
    deal: [
        {
            sante: 0,
            lucide: 0,
            stress: 0
        },
        {
            sante: 0,
            lucide: 0,
            stress: 0
        }
    ],
    ingredients: [],
    craft: [null, null],
    consume: ["log_d1", "log_d45"],
    image: "assets/innexistant.png"
};

let onchange_callback = () => {};

let carte_actuel = get_carte(first_carte.id);
let used_carte = [];

function set_onchange_callback(cb: (() => void)) {
    onchange_callback = cb;
}

function current_carte() {
    return carte_actuel;
}

function next_carte(choice) {
    if (choice != 0 && choice != 1) return carte_actuel;

    stat.types().forEach((type) => {
        stat.add(type, carte_actuel.deal[choice][type]);
    })
    inventaire.add(carte_actuel.craft[choice]);
    inventaire.remove(carte_actuel.consume[choice]);

    let access = get_accessible_carte();
    if (access.length <= 0) {
        used_carte = [];
        access = get_accessible_carte();
        if (access.length <= 0) {
            access.push(no_carte_left_loser.id);
        }
    }
    let carte_id = access[parseInt(Math.random() * access.length)];
    carte_actuel = get_carte(carte_id);
    used_carte.push(carte_id);

    onchange_callback();
    return carte_actuel;
}

function get_accessible_carte() {
    let access = [];

    Object.keys(cartes).forEach((carte_id) => {
        let carte = cartes[carte_id];

        if (carte.salle.indexOf(salle.current().id) < 0) return;

        let nb_stat_satisfied = 0;
        stat.types().forEach((type) => {
            if (carte.stats[type] < stat.get(type)) nb_stat_satisfied++;
        })
        if (nb_stat_satisfied != stat.types().length) return;

        if (carte.reference && used_carte.indexOf(carte.reference) < 0) return 0;

        let nb_item_found = 0;
        carte.ingredients.forEach((item_id) => {
            if (inventaire.find(item_id)) nb_item_found++;
        })
        if (nb_item_found != carte.ingredients.length) return;

        if (used_carte.indexOf(carte_id) >= 0) return;

        access.push(carte.id);
    })

    return access;
}

function get_carte(id) {
    if (id == no_carte_left_loser.id) return no_carte_left_loser;
    if (id == first_carte.id) return first_carte;
    if (!id || !cartes[id]) {
        let empty_carte = {}
        Object.getOwnPropertyNames(cartes[Object.keys(cartes)[0]]).forEach((cid) => {
            empty_carte[cid] = "";
            if (cid == 'deal') {
                let empty_deal = {sante: 0, lucide: 0, stress: 0};
                empty_carte[cid] = [empty_deal, empty_deal];
            }
            else if (cid == 'stat') empty_carte[cid] = {sante: 0, lucide: 0, stress: 0};
            else if (cid == 'ingredients') empty_carte[cid] = [];
        })
        return empty_carte;
    }
    return cartes[id];
}

export default {
    debug: get_accessible_carte,
    carte: get_carte,
    current: current_carte,
    next: next_carte,
    onchange: set_onchange_callback,
}
