import item from "./item.ts"

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
    return coord.y * grid_size.x + coord.x;
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

    let id = grid[grid_index(coord)];

    return item.get(id);
}

function set_item(coord: Coord, id: Item) {
    if (!grid_check(coord)) return null;
    if (!item.exist(id) && id != "") return null;
    return grid[grid_index(coord)] = id;
}

function move_item(from: Coord, to: Coord) {
    if (from.x == to.x && from.y == to.y) return;

    let from_item = get_item(from);
    if (!from_item.id) return false;

    let to_item = get_item(to);

    set_item(to, from_item.id);
    set_item(from, to_item.id);

    onchange_callback({action: 'move', from, to, from_item, to_item});

    return true;
}

function add_item(id: Item) {
    if (!item.exist(id)) return false;

    for (let i = 0; i < grid_cap; i++) {
        if (!grid[i]) {
            grid[i] = id;
            break;
        }
    }

    onchange_callback({'action': 'add', id});
}

function remove_item(id: Item) {
    for (let i = 0; i < grid_cap; i++) {
        if (!grid[i]) continue;
        if (grid[i] == id) {
            grid[i] = undefined;
            break;
        }
    }

    onchange_callback({action: 'remove', id});
}

function find_item(id: Item) {
    if (!id) return false;

    for (let i = 0; i < grid_cap; i++) {
        if (grid[i] == id) return true;
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

    for (let i = 0; i < 3; i++) {
        let items_idx = parseInt(Math.random() * item.keys().length);
        let coord = null;
        let max = 50;
        do {
            coord = {
                x: Math.floor(Math.random() * grid_size.x),
                y: Math.floor(Math.random() * grid_size.y),
            };
            max--
        } while (get_item(coord) && max > 0);

        let ret = set_item(coord, item.keys()[items_idx]);
    };

    onchange_callback();
}


function inventaire_clear() {
    grid = new Array(grid_cap);

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
    clear: inventaire_clear,
}
