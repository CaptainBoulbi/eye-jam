import items from "./data/items.json"

export default {
    get: (id) => {
        let item = items[id];
        if (!item) {
            item = {};
            Object.getOwnPropertyNames(items[Object.keys(items)[0]]).forEach((id) => {
                item[id] = "";
            })
        }
        return item;
    },
    exist: (id) => {
        return Object.keys(items).indexOf(id) >= 0;
    },
    keys: () => { return Object.keys(items) },
    // peut etre utile d'avoir des fonction de search
}
