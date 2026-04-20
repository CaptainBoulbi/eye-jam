type Coord = {
    x: number,
    y: number,
}
type Item = string

const grid_size: Coord = {x: 3, y: 10};
let grid_cap = grid_size.x * grid_size.y;
let grid = new Array(grid_cap);

let onchange_callback = () => {};

function grid_index(coord: Coord) {
    return parseInt(coord.y) * grid_size.x + parseInt(coord.x);
}

function grid_check(coord: Coord) {
    if (coord.x < 0) return false;
    if (coord.y < 0) return false;
    if (coord.x >= grid_size.x) return false;
    if (coord.y >= grid_size.y) return false;
    if (grid_index(coord) > grid_cap) return false;
    return true;
}

function get_item(coord: Coord) {
    if (!grid_check(coord)) return null;

    return grid[grid_index(coord)];
}

function set_item(coord: Coord, item: Item) {
    if (!grid_check(coord)) return null;
    return grid[grid_index(coord)] = item;
}

function move_item(from: Coord, to: Coord) {
    if (from.x == to.x && from.y == to.y) return;

    let from_item = get_item(from);
    if (!from_item) return false;

    let to_item = get_item(to);

    set_item(to, from_item);
    set_item(from, to_item);

    onchange_callback();

    return true;
}

// NOTE: pour les fonctions get_item, add_item, find_item, remove_item il faudra peut etre changer leur parametre item
//       pour l'instant c'est un strings donc ça passe, en fonction de comment on decide de structurer les items on 
//       devra passer en argument l'item json ou l'id de l'item

function add_item(item: Item) {
    for (let i = 0; i < grid_cap; i++) {
        if (!grid[i]) {
            grid[i] = item;
            break;
        }
    }

    onchange_callback();
}

function remove_item(item: Item) {
    for (let i = 0; i < grid_cap; i++) {
        if (!grid[i]) continue;
        if (grid[i] == item) {
            grid[i] = undefined;
            break;
        }
    }

    onchange_callback();
}

function find_item(item: Item) {
    if (!item) return false;

    for (let i = 0; i < grid_cap; i++) {
        // TODO: changer le ==, ça marche pour l'instant car les items sont des strings
        //       normallement c'est du json donc surement faire une fonction item_equal()
        //       a faire une fois qu'on ce sera mis d'accord sur la structure d'un item
        if (grid[i] == item) return true;
    }

    return false;
}

function set_onchange_callback(cb: (() => void)) {
    onchange_callback = cb;

    test_data();
}

function test_data() {
    // check if grid empty
    for (let i = 0; i < grid_cap; i++) {
        if (grid[i]) return;
    }

    ["carte", "pomme", "rat mort", "antidote"].forEach((item) => {
        let coord = null;
        do {
            coord = {
                x: Math.floor(Math.random() * grid_size.x),
                y: Math.floor(Math.random() * grid_size.y),
            };
        } while (get_item(coord));

        set_item(coord, item);
    });

    onchange_callback();
}

export default {
    grid_size,
    get: get_item,
    move: move_item,
    add: add_item,
    remove: remove_item,
    find: find_item,
    onchange: set_onchange_callback,
}
