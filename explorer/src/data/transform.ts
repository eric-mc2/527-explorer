import {Graph} from "./graphSchema";
import { filter, map } from 'd3-array';
import {ContributionsResponse,
    ExpendituresResponse,
    OrganizationsResponse
    } from "./responseSchema";

export const contribsToGraph = (contribs: ContributionsResponse): Graph => {
  const nonnull = filter(contribs.data, d => d.contributor)
  const role = "C" as "O" | "C" | "R"; // Please type checker
  const nodes = map(nonnull, d => ({id: d.contributor!, name: d.name, role: role}));
  const links = map(nonnull, d => ({source: d.contributor!, target: d.ein, value: d.amt}));
  return new Graph(nodes, links);
};

export const expendToGraph = (expends: ExpendituresResponse): Graph => {
  const nonnull = filter(expends.data, d => d.recipient)
  const role = "R" as "O" | "C" | "R"; // Please type checker
  const nodes = map(nonnull, d => ({id: d.recipient!, name: d.name, role: role}));
  const links = map(nonnull, d => ({source: d.ein, target: d.recipient!, value: d.amt}));
  return new Graph(nodes, links);
};

export const orgsToGraph = (orgs: OrganizationsResponse): Graph => {
  const nonnull = filter(orgs.data, d => d.ein)
  const role = "O" as "O" | "C" | "R"; // Please type checker
  const nodes = map(nonnull, d => ({id: d.ein, name: d.org_name, role: role}));
  return new Graph(nodes, []);
  // TODO: push parsing typecheck up to object creation
};