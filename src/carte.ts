import cartes from "./data/cartes.json"
import cartes_imp from "./data/cartes-importante.json"

import salle from "./salle.ts"
import stat from "./stat.ts"
import inventaire from "./inventaire.ts"

let no_carte_left_loser = {
    "id": "vitality_regain",
    "name": "Vitality Regain",
    "content": "You pause, breathe, and recover enough strength to continue.",
    "reference": null,
    "salle": [
        "morgue",
        "rest_room",
        "lab",
        "office",
        "isolation"
    ],
    "go": false,
    "stats": {
        "sante": -999,
        "lucide": -999,
        "stress": -999
    },
    "deal": [
        {
            "sante": 1,
            "lucide": 1,
            "stress": 1,
            "description": "Center yourself"
        },
        {
            "sante": 1,
            "lucide": 1,
            "stress": 1,
            "description": "Take one steady breath"
        }
    ],
    "ingredients": [],
    "craft": [
        null,
        null
    ],
    "consume": [
        null,
        null
    ],
    "image": "assets/innexistant.png"
};

let first_carte = {
        "id": "morgue_wake",
        "name": "Cold Awakening",
        "content": "You wake in the morgue with blood on both hands. You are alone.",
        "reference": null,
        "salle": [
            "morgue"
        ],
        "stats": {
            "sante": 0,
            "lucide": 0,
            "stress": 0
        },
        "deal": [
            {
                "sante": 0,
                "lucide": 1,
                "stress": 1,
                "description": "Steady your breath and check your body"
            },
            {
                "sante": -1,
                "lucide": -1,
                "stress": 2,
                "description": "Panic and scrub blood from your hands"
            }
        ],
        "ingredients": [],
        "craft": [
            null,
            null
        ],
        "consume": [
            null,
            null
        ],
        "image": "assets/innexistant.png",
        "go": false

};

let onchange_callback = () => {};

let carte_actuel = get_carte(first_carte.id);
let used_carte = [];
let used_imp_carte = [];

let carte_counter = 0;
const carte_event_at = 5;

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

    if (carte_actuel.go) salle.go(choice);

    if (carte_counter % carte_event_at) {
        let access = get_accessible_carte(cartes, used_carte);
        if (access.length <= 0) {
            used_carte = [];
            access = get_accessible_carte(cartes, used_carte);
            if (access.length <= 0) {
                access.push(no_carte_left_loser.id);
            }
        }
        let carte_id = access[parseInt(Math.random() * access.length)];
        carte_actuel = get_carte(carte_id);
        used_carte.push(carte_id);
    }
    else {
        let access = get_accessible_carte(cartes_imp, used_imp_carte);
        if (access.length > 0) {
            let carte_id = access[parseInt(Math.random() * access.length)];
            carte_actuel = get_carte(carte_id);
            used_imp_carte.push(carte_id);
        }
        else {
            access = get_accessible_carte(cartes, used_carte);
            if (access.length > 0) {
                let carte_id = access[parseInt(Math.random() * access.length)];
                carte_actuel = get_carte(carte_id);
                used_carte.push(carte_id);
            } else {
                carte_actuel = get_carte(no_carte_left_loser.id);
            }
        }
    }

    carte_counter++;
    onchange_callback();
    return carte_actuel;
}

function get_accessible_carte(cartes_from, used_carte_from) {
    let access = [];

    Object.keys(cartes_from).forEach((carte_id) => {
        let carte = cartes_from[carte_id];

        if (carte.salle.indexOf(salle.current().id) < 0) return;

        let nb_stat_satisfied = 0;
        stat.types().forEach((type) => {
            if (carte.stats[type] < stat.get(type)) nb_stat_satisfied++;
        })
        if (nb_stat_satisfied != stat.types().length) return;

        if (carte.reference && used_carte_from.indexOf(carte.reference) < 0) return 0;

        let nb_item_found = 0;
        carte.ingredients.forEach((item_id) => {
            if (inventaire.find(item_id)) nb_item_found++;
        })
        if (nb_item_found != carte.ingredients.length) return;

        if (used_carte_from.indexOf(carte_id) >= 0) return;

        access.push(carte.id);
    })

    return access;
}

function get_carte(id) {
    if (id == no_carte_left_loser.id) return no_carte_left_loser;
    if (id == first_carte.id) return first_carte;
    if (!id || (!cartes[id] && !cartes_imp[id])) {
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
    return cartes[id] ? cartes[id] : cartes_imp[id];
}

function carte_clear() {
    carte_actuel = get_carte(first_carte.id);
    used_carte = [];
    used_imp_carte = [];
    carte_counter = 0;

    onchange_callback();
}

export default {
    carte: get_carte,
    current: current_carte,
    next: next_carte,
    onchange: set_onchange_callback,
    clear: carte_clear,
}
