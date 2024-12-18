import { filter, map } from 'd3-array';
import { Graph } from "./graphSchema.js";
import { get, getAll } from "./query.js";
import {type ContributionsElem, type ExpendituresElem, type OrganizationElem,
    type MatchesResponse, type ContainerResponse,
} from "./responseSchema.js";

export const contribsToGraph = (contribs: ContributionsElem[]): Graph => {
  const nonnull = filter(contribs, d => d.contributor)
  const role = "C" as "O" | "C" | "R"; // Please type checker
  const nodes = map(nonnull, d => ({id: d.contributor!, name: d.name, role: role}));
  const links = map(nonnull, d => ({source: d.contributor!, target: d.ein, value: d.amt}));
  return new Graph(nodes, links);
};

export const expendToGraph = (expends: ExpendituresElem[]): Graph => {
  const nonnull = filter(expends, d => d.recipient)
  const role = "R" as "O" | "C" | "R"; // Please type checker
  const nodes = map(nonnull, d => ({id: d.recipient!, name: d.name, role: role}));
  const links = map(nonnull, d => ({source: d.ein, target: d.recipient!, value: d.amt}));
  return new Graph(nodes, links);
};

export const orgsToGraph = (orgs: OrganizationElem[]): Graph => {
  const nonnull = filter(orgs, d => d.ein)
  const role = "O" as "O" | "C" | "R"; // Please type checker
  const nodes = map(nonnull, d => ({id: d.ein, name: d.org_name, role: role}));
  return new Graph(nodes, []);
};

export const dataToGraph = (
    orgs: OrganizationElem[], 
    contribs: ContributionsElem[], 
    expends: ExpendituresElem[]) => {
    return orgsToGraph(orgs).union(contribsToGraph(contribs)).union(expendToGraph(expends));
}

export const walkOrg = async (org: OrganizationElem) => {
    const params = {id: org.id.toString(), search: '', ein: org?.ein.toString(), 
                    order: 'desc', mode: 'date', page: '0'};
    // TODO: These links are kinda like stubs 
    const contrib = await getAll("orgs/contributions", params);
    const expend = await getAll("orgs/expenditures", params);
    // TODO: For now dont convert to graphs yet bc we still have to follow links?
    const contribData = ((contrib as ContainerResponse).data as ContributionsElem[]);
    const expendData = ((expend as ContainerResponse).data as ExpendituresElem[]);
    return {contributions: contribData, expenditures: expendData}
    // return new Graph([org], []).union(contribsToGraph(contrib)).union(expendToGraph(expend));
};

export const walkPayment = async (x: ContributionsElem | ExpendituresElem): Promise<MatchesResponse> => {
    // TODO: Not really sure if this function is needed, since not sure if need to use match endpoints for anything.
    const params = {id: x.link.toString(), page: '0'};
    let xs;
    if (x.kind === "contribution") {
        xs = await get("match/contributions", params);
    } else {
        xs = await get("match/expenditures", params);
    }
    // TODO: Filter on confidence or on c.contributor == C.contributor or e.recipient == E.recipient?
    return xs as MatchesResponse;
};

export const walkToGraph = async (org: OrganizationElem): Promise<Graph> => {
    // TODO: I think I may want to combine this with walkOrg
    //      or this should be the top-level walk function.
    const walkedOrg = await walkOrg(org);
    const orgGraph = orgsToGraph([org]);
    const contribGraph = contribsToGraph(walkedOrg.contributions);
    const expendGraph = expendToGraph(walkedOrg.expenditures);
    const graph = orgGraph.union(contribGraph).union(expendGraph);
    return graph
}

const walksToGraph = async (orgs: OrganizationElem[]): Promise<Graph> => {
    const graphs = [new Graph()];
    for (let org of orgs) {
        graphs.push(await walkToGraph(org));
    }
    const graph = graphs.reduce((acc, val, _) => acc.union(val))
    return graph;
}
