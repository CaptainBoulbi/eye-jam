const stat_full_val = 15;

let stat_value = {
    sante: stat_full_val,
    lucide: stat_full_val,
    stress: stat_full_val,
};

let stat_onchange_callback = (type) => {};
let stat_ondeath_callback = () => {};

function stat_set_onchange_callback(cb: ((type) => void)) {
    stat_onchange_callback = cb;
}

function stat_set_ondeath_callback(cb: (() => void)) {
    stat_ondeath_callback = cb;
}

function stat_types() {
    return Object.keys(stat_value);
}

function get_stat(type) {
    if (type && stat_types().indexOf(type) >= 0) return stat_value[type];
    return stat_value;
}

function stat_add(type, value) {
    if (!type) return -1;
    if (stat_types().indexOf(type) < 0) return -1;
    stat_value[type] = Math.min(Math.max(stat_value[type] + parseInt(value), 0), stat_full_val);
    stat_onchange_callback(type);
    if (stat_value.sante <= 0) stat_ondeath_callback();
}

export default {
    get: get_stat,
    add: stat_add,
    types: stat_types,
    onchange: stat_set_onchange_callback,
    ondeath: stat_set_ondeath_callback,
}
