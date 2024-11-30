import { Graph } from "./graphSchema";
import { get, getMatch } from "./query";
import { filter, map } from 'd3-array';
import {ContainerResponse, ContributionsElem,
    ExpendituresElem, OrganizationElem,
    ContributionElemSchema, 
    ExpenditureElemSchema,
    ContributionMatchSchema,
    ExpenditureMatchSchema,
    MatchesResponse,
    ContributionMatchElem,
    ExpenditureMatchElem,
    } from "./responseSchema";

export const contribsToGraph = (contribs: ContainerResponse<ContributionsElem>): Graph => {
  const nonnull = filter(contribs.data, d => d.contributor)
  const role = "C" as "O" | "C" | "R"; // Please type checker
  const nodes = map(nonnull, d => ({id: d.contributor!, name: d.name, role: role}));
  const links = map(nonnull, d => ({source: d.contributor!, target: d.ein, value: d.amt}));
  return new Graph(nodes, links);
};

export const expendToGraph = (expends: ContainerResponse<ExpendituresElem>): Graph => {
  const nonnull = filter(expends.data, d => d.recipient)
  const role = "R" as "O" | "C" | "R"; // Please type checker
  const nodes = map(nonnull, d => ({id: d.recipient!, name: d.name, role: role}));
  const links = map(nonnull, d => ({source: d.ein, target: d.recipient!, value: d.amt}));
  return new Graph(nodes, links);
};

export const orgsToGraph = (orgs: ContainerResponse<OrganizationElem>): Graph => {
  const nonnull = filter(orgs.data, d => d.ein)
  const role = "O" as "O" | "C" | "R"; // Please type checker
  const nodes = map(nonnull, d => ({id: d.ein, name: d.org_name, role: role}));
  return new Graph(nodes, []);
  // TODO: push parsing typecheck up to object creation
};

export const walkOrg = async (org: OrganizationElem) => {
    const params = {id: org.id.toString(), search: '', ein: org?.ein.toString(), 
                    order: 'desc', mode: 'date', page: '1'};
    // TODO: These links are kinda like stubs 
    const contrib = await get("orgs/contributions", ContributionElemSchema, params);
    const expend = await get("orgs/expenditures", ExpenditureElemSchema, params);
    // TODO: For now dont convert to graphs yet bc we still have to follow links?
    return {contributions: contrib, expenditures: expend}
    // return new Graph([org], []).union(contribsToGraph(contrib)).union(expendToGraph(expend));
};

export const walkContrib = async (c: ContributionsElem): Promise<MatchesResponse<ContributionMatchElem>> => {
    // TODO: Not really sure if this function is needed, since not sure if need to use match endpoints for anything.
    const params = {id: c.link.toString(), page: '0'};
    const cx = await getMatch("match/contributions", ContributionMatchSchema, params);
    // TODO: Filter on confidence or on c.contributor == C.contributor?
    return cx;
};

export const walkExpend = async (e: ExpendituresElem): Promise<MatchesResponse<ExpenditureMatchElem>>=> {
    // TODO: Not really sure if this function is needed, since not sure if need to use match endpoints for anything.
    const params = {id: e.link.toString(), page: '0'};
    const ex = await getMatch("match/expenditures", ExpenditureMatchSchema, params);
    // TODO: Filter on confidence or on e.recipient == E.recipient?
    return ex;
};

const walkToGraph = async (org: OrganizationElem): Promise<Graph> => {
    // TODO: start here fixing types!
    // TODO: I think I may want to combine this with walkOrg
    //      or this should be the top-level walk function.
    const walkedOrg = await walkOrg(org);
    const orgGraph = orgsToGraph({count: 1, data: [org]});
    const contribGraph = contribsToGraph(walkedOrg.contributions);
    return contribGraph;
    const expendGraph = expendToGraph(walkedOrg.expenditures);
    const graph = orgGraph.union(contribGraph).union(expendGraph);
    return graph
}