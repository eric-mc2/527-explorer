import {type ContainerResponse, ContainerResponseSchema,
    type MatchesResponse, MatchResponseSchema,
} from './responseSchema.js';

/* 
Nodes They only expose IDs for tax filer nodes. Even though they cluster the contributors and expenditures, they don't expose IDs for that. They model each line-item with an ID and expose the name/address properties that they do clustering on.

Pages Therefore tax filer orgs and line items have dedicated RESTful pages.

Search Seems like search is even what they use to get all similar clustered dudes. But it can easily over-match on common words like "Blue".

Match Looks like I can walk the line items to get the groupings in this endpoint.

Top Contributors / Expenses Are returned in the HTML so I'd need to have a backend to get that.

Leadership FWIW there is also a board members search endpoint. But org board members are returned in the HTML.
*/

type Route = "match/expenditures"
    | "match/contributions"
    | "orgs/contributions"
    | "orgs/expenditures"
    | "search/contributors"
    | "search/expenditures"
    | "search/orgs";

const endpointUrl = (route: Route, params: Record<string,string>) => {
    switch(route) {
      case "orgs/contributions":
        return `https://projects.propublica.org/527-explorer/orgs/${params.id}/contribution_details`;
      case "orgs/expenditures":
        return `https://projects.propublica.org/527-explorer/orgs/${params.id}/expenditure_details`;
      case "match/expenditures":
        return `https://projects.propublica.org/527-explorer/expenditures/${params.id}/data`;
      case "match/contributions":
        return `https://projects.propublica.org/527-explorer/contributions/${params.id}/data`;
      case "search/contributors":
        return "https://projects.propublica.org/527-explorer/search/contributors_endpoint";
      case "search/expenditures":
        return "https://projects.propublica.org/527-explorer/search/recipients_endpoint";
      case "search/orgs":
        return "https://projects.propublica.org/527-explorer/search/orgs_endpoint";
      default:
        return "https://projects.propublica.org/527-explorer/search_options";
    }
}

const buildUrl = (route: Route, params: Record<string,string>) => {
    // TODO: Incorporate query filter params like contribution_amount[]&"1M and above"
    const corsProxy = "https://corsproxy.io/";
    const baseUrl = endpointUrl(route, params);
    const queryString = new URLSearchParams(params).toString();
    return `${corsProxy}?${baseUrl}?${queryString}`;
}

const injectKind = (route: Route, data: ContainerResponse | MatchesResponse) => {
    const kinds = {
        "orgs/contributions": "contribution",
        "search/contributors": "contribution",
        "orgs/expenditures": "expenditure",
        "search/expenditures": "expenditure",
        "search/orgs": "organization",
        "match/expenditures": undefined,
        "match/contributions": undefined  
    }
    const kind = kinds[route];
    const isContainer = (kind === "contribution") || (kind === "expenditure") || (kind === "organization");
    if ("data" in data && isContainer) {
        for (var i = 0; i < data.data.length; i++) {
            data.data[i]["kind"] = kind;
        }
    }
    return data;
}

const endpointSchema = {
    "match/expenditures": MatchResponseSchema,
    "match/contributions": MatchResponseSchema,
    "orgs/contributions": ContainerResponseSchema,
    "orgs/expenditures": ContainerResponseSchema,
    "search/contributors": ContainerResponseSchema,
    "search/expenditures": ContainerResponseSchema,
    "search/orgs": ContainerResponseSchema,
}

/*
This signature is saying get() returns a Container of type T,
where T is one of the AnyElem union types.
*/
export async function get(
    route: Route, 
    params: Record<string,string>
): Promise<ContainerResponse | MatchesResponse> {
    // TODO: Check that all callers properly try/catch Throws!
    const url = buildUrl(route, params);
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    data = injectKind(route, data);
    const schema = endpointSchema[route];
    const parsed = schema.parse(data);
    return parsed;
}

async function getAll(route: string, params: Record<string, string>) {
    // TODO: Handle pagination.
}