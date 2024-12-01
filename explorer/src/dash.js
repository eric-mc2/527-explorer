import {OrganizationElemSchema} from "./data/responseSchema.js";
import {get} from "./data/query.js";

export const appSearch = async (searchInput) => {
    const params = {search: searchInput, order: "asc", mode: "name", page: '1', active: '', has_8872: ''};
    let data;
    if (params.search !== '') {
        data = await get("search/orgs", params);
    } else {
        // This runs when page loads.
        data = [{"Placeholder": "Search to populate table."}];
    }
    return data;
}

