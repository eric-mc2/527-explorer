import { z } from 'zod';

import {containerSchemaFactory, ContainerResponse,
    matchSchemaFactory, MatchesResponse,
    AnyElem,MatchElem
} from './responseSchema';

/* 
Nodes They only expose IDs for tax filer nodes. Even though they cluster the contributors and expenditures, they don't expose IDs for that. They model each line-item with an ID and expose the name/address properties that they do clustering on.

Pages Therefore tax filer orgs and line items have dedicated RESTful pages.

Search Seems like search is even what they use to get all similar clustered dudes. But it can easily over-match on common words like "Blue".

Match Looks like I can walk the line items to get the groupings in this endpoint.

Top Contributors / Expenses Are returned in the HTML so I'd need to have a backend to get that.

Leadership FWIW there is also a board members search endpoint. But org board members are returned in the HTML.
*/

const endpointUrl = (route: string, params: Record<string,string>) => {
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

const buildUrl = (route: string, params: Record<string,string>) => {
    // TODO: There are also query filters like contribution_amount[]&"1M and above"
    const corsProxy = "https://corsproxy.io/";
    const baseUrl = endpointUrl(route, params);
    const queryString = new URLSearchParams(params).toString();
    return `${corsProxy}?${baseUrl}?${queryString}`;
}

// export async function get<T extends keyof RouteToType>(route: T, params: Record<string,string>): Promise<RouteToType[T]> {
//     // TODO: Check that all callers properly try/catch Throws!
//     const url = buildUrl(route, params);
//     const response = await fetch(url, { method: "GET" });
//     if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const data = await response.json();
//     const parsed = RouteSchemas[route].parse(data);
//     // Filter and validate elements against the specific schema
//     return parsed;
// }

/*
This signature is saying get() returns a Container of type T,
where T is one of the AnyElem union types.
*/
export async function get<T extends AnyElem>(
    route: string, 
    schema: z.ZodType<T>,
    params: Record<string,string>
): Promise<ContainerResponse<T>> {
    // TODO: Check that all callers properly try/catch Throws!
    const url = buildUrl(route, params);
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const parsed = containerSchemaFactory(schema).parse(data);
    return parsed;
}

export async function getMatch<T extends MatchElem>(
    // TODO: How to combine this with the get()
    route: string, 
    schema: z.ZodType<T>,
    params: Record<string,string>
): Promise<MatchesResponse<T>> {
    // TODO: Check that all callers properly try/catch Throws!
    const url = buildUrl(route, params);
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const parsed = matchSchemaFactory(schema).parse(data);
    return parsed;
}

async function getAll(route: string, params: Record<string, string>) {
    // TODO: Handle pagination.
}