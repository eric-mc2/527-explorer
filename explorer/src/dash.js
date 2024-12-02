import {get} from "./data/query.js";
import {walkToGraph} from "./data/transform.js";

const _placeholderData = [{"Placeholder": "Search to populate table."}];
const _placeholderGraph = {nodes: [], links: []};

export const appSearch = async (searchInput) => {
    const params = {search: searchInput, order: "asc", mode: "name", page: '1', active: '', has_8872: ''};
    let data;
    if (params.search !== '') {
        const resp = await get("search/orgs", params);
        data = resp.data;
    } else {
        // This runs when page loads.
        data = _placeholderData;
    }
    return data;
}

export const appGraph = async (data) => {
    if (data !== _placeholderData) {
        return await walkToGraph(data[0]);
    } else {
        return _placeholderGraph;
    }
}
