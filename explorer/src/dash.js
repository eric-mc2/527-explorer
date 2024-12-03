import {getAll} from "./data/query.js";

const _placeholderData = [{"Placeholder": "Search to populate table."}];

export const appSearch = async (searchInput) => {
    const params = {search: searchInput, order: "asc", mode: "name", page: '1', active: '', has_8872: ''};
    let data;
    if (params.search !== '') {
        const resp = await getAll("search/orgs", params);
        data = resp.data;
    } else {
        // This runs when page loads.
        data = _placeholderData;
    }
    return data;
}