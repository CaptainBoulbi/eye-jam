import salles from "./data/salles.json"

let salle_in = Object.keys(salles)[0];

let onchange_callback = () => {};

function get_current() {
    return salles[salle_in];
}

function get_link(id) {
    let salle = salles[salle_in];
    if (id == 0 || id == 1) return salles[salle.links[id]];

    let links = [
        salles[salle.links[0]],
        salles[salle.links[1]],
    ];
    return links;
}

function salle_go(id) {
    if (!(id == 0 || id == 1)) return false;

    salle_in = salles[salle_in].links[id];

    onchange_callback();
}

function set_onchange_callback(cb: (() => void)) {
    onchange_callback = cb;
}

export default {
    current: get_current,
    link: get_link,
    go: salle_go,
    onchange: set_onchange_callback,
}
