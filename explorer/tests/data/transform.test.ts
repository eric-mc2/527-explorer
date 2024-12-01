import {orgsToGraph, contribsToGraph, expendToGraph,
    walkOrg, walkPayment, walkToGraph,
} from "../../src/data/transform";

const orgsResponse = `{"count":1,"data":[{"id":113753369,"org_name":"The Presidential Coalition, LLC","ein":113753369,"total_contrib":77160915,"total_exp":84991865,"active":true,"purpose":"Organized to directly or indirectly accept contributions and/or make expenditures to influence the selection, nomination, election or appointment of individuals to federal, state or local public office, or office in a political organization"}]}`;
const contribResponse = `{"count":10000,"data":[{"id":119113809,"agg_contrib_ytd":1678,"date":"2024-10-16","amt":25,"link":111334533,"contributor":85940,"certainty":1,"name":"WEIS, JUDITH","org_name":"ActBlue Non-Federal","ein":202517748,"form8872_data_id":9748228},{"id":119114952,"agg_contrib_ytd":240,"date":"2024-10-16","amt":50,"link":111335676,"contributor":89140,"certainty":1,"name":"WOLFE, TERRY","org_name":"ActBlue Non-Federal","ein":202517748,"form8872_data_id":9748228},{"id":119114033,"agg_contrib_ytd":264,"date":"2024-10-16","amt":1,"link":111334757,"contributor":98385,"certainty":1,"name":"WESTERLUND, TRINA","org_name":"ActBlue Non-Federal","ein":202517748,"form8872_data_id":9748228},{"id":119115029,"agg_contrib_ytd":1724,"date":"2024-10-16","amt":5,"link":111335753,"contributor":142860,"certainty":1,"name":"WOOD, DAVID","org_name":"ActBlue Non-Federal","ein":202517748,"form8872_data_id":9748228},{"id":119113680,"agg_contrib_ytd":250,"date":"2024-10-16","amt":25,"link":111334404,"contributor":150136,"certainty":1,"name":"WEIHS, KAREN","org_name":"ActBlue Non-Federal","ein":202517748,"form8872_data_id":9748228},{"id":119114652,"agg_contrib_ytd":283,"date":"2024-10-16","amt":29,"link":111335376,"contributor":159096,"certainty":1,"name":"WILSON, SARAH S","org_name":"ActBlue Non-Federal","ein":202517748,"form8872_data_id":9748228},{"id":119112888,"agg_contrib_ytd":572,"date":"2024-10-16","amt":16,"link":111333612,"contributor":169238,"certainty":1,"name":"WAIN, CYNTHIA","org_name":"ActBlue Non-Federal","ein":202517748,"form8872_data_id":9748228},{"id":119115168,"agg_contrib_ytd":277,"date":"2024-10-16","amt":35,"link":111335892,"contributor":178149,"certainty":1,"name":"WORKMAN, ROSS","org_name":"ActBlue Non-Federal","ein":202517748,"form8872_data_id":9748228},{"id":119115344,"agg_contrib_ytd":225,"date":"2024-10-16","amt":3,"link":111336068,"contributor":290612,"certainty":1,"name":"YANCY, MAX","org_name":"ActBlue Non-Federal","ein":202517748,"form8872_data_id":9748228},{"id":119113402,"agg_contrib_ytd":1370,"date":"2024-10-16","amt":180,"link":111334126,"contributor":318142,"certainty":1,"name":"WATERS, PHILIP","org_name":"ActBlue Non-Federal","ein":202517748,"form8872_data_id":9748228}]}`;
const expendResponse = `{"count":10000,"data":[{"id":99222541,"amt":5514,"date":"2024-10-16","is_political_contribution":true,"link":111350106,"org_name":"ActBlue Non-Federal","ein":202517748,"name":"DLCC VICTORY FUND","certainty":0.843659585732248,"recipient":5050},{"id":99222526,"amt":173,"date":"2024-10-16","is_political_contribution":true,"link":111350091,"org_name":"ActBlue Non-Federal","ein":202517748,"name":"DGA VICTORY FUND","certainty":0.8513996426444312,"recipient":5050},{"id":99222524,"amt":1047,"date":"2024-10-16","is_political_contribution":true,"link":111350089,"org_name":"ActBlue Non-Federal","ein":202517748,"name":"DGA - EVERY STATE EVERY VOTE","certainty":1,"recipient":5052},{"id":99221746,"amt":298,"date":"2024-10-16","is_political_contribution":true,"link":111349311,"org_name":"ActBlue Non-Federal","ein":202517748,"name":"DEMOCRATIC GOVERNORS ASSOCIATION","certainty":0.9390059347828501,"recipient":5053},{"id":99221751,"amt":44995,"date":"2024-10-16","is_political_contribution":true,"link":111349316,"org_name":"ActBlue Non-Federal","ein":202517748,"name":"DEMOCRATIC GOVERNORS ASSOCIATION","certainty":0.9390059347828501,"recipient":5053},{"id":99221753,"amt":125,"date":"2024-10-16","is_political_contribution":true,"link":111349318,"org_name":"ActBlue Non-Federal","ein":202517748,"name":"DEMOCRATIC GOVERNORS ASSOCIATION - MAJOR DONOR","certainty":0.8106745934493305,"recipient":5053},{"id":99221760,"amt":331,"date":"2024-10-16","is_political_contribution":true,"link":111349325,"org_name":"ActBlue Non-Federal","ein":202517748,"name":"DEMOCRATIC GOVERNORS ASSOCIATION CCAH","certainty":0.9069119921988241,"recipient":5053},{"id":99221768,"amt":73732,"date":"2024-10-16","is_political_contribution":true,"link":111349333,"org_name":"ActBlue Non-Federal","ein":202517748,"name":"DEMOCRATIC LEGISLATIVE CAMPAIGN COMMITTEE","certainty":0.9999809200358704,"recipient":5054},{"id":99221732,"amt":25,"date":"2024-10-16","is_political_contribution":true,"link":111349297,"org_name":"ActBlue Non-Federal","ein":202517748,"name":"DEMOCRATIC COMMITTEE FOR MISSOURI 32ND SENATORIAL","certainty":1,"recipient":6923},{"id":99221736,"amt":25,"date":"2024-10-16","is_political_contribution":true,"link":111349301,"org_name":"ActBlue Non-Federal","ein":202517748,"name":"DEMOCRATIC COMMITTEE FOR MISSOURI 32ND SENATORIAL","certainty":1,"recipient":6923}]}`;

test('orgsToGraph', async () => {
    const data = orgsToGraph(JSON.parse(orgsResponse));
    expect(data).toBeDefined();
    expect(data.nodes).toHaveLength(1);
    expect(data.links).toHaveLength(0);
});

test('contribsToGraph', async () => {
    const data = contribsToGraph(JSON.parse(contribResponse));
    expect(data).toBeDefined();
    expect(data.nodes).toHaveLength(10);
    expect(data.links).toHaveLength(10);
});

test('expendToGraph', async () => {
    const data = expendToGraph(JSON.parse(expendResponse));
    expect(data).toBeDefined();
    expect(data.nodes).toHaveLength(10);
    expect(data.links).toHaveLength(10);
});

test('union', async () => {
    const orgs = orgsToGraph(JSON.parse(orgsResponse));
    const contrib = contribsToGraph(JSON.parse(contribResponse));
    const expend = expendToGraph(JSON.parse(expendResponse));
    const data = orgs.union(contrib).union(expend);
    expect(data).toBeDefined();
    expect(data.nodes).toHaveLength(21);
    expect(data.links).toHaveLength(20);
});

test('walkOrg', async () => {
    const orgs = JSON.parse(orgsResponse);
    const data = await walkOrg(orgs.data[0]);
    expect(data).toBeDefined();
    expect(data.contributions).toHaveLength(10);
    expect(data.expenditures).toHaveLength(10);
});

test('walkContrib', async () => {
    const contrib = JSON.parse(contribResponse);
    const data = await walkPayment(contrib.data[2]);
    expect(data).toBeDefined();
    expect(data.linked).toHaveLength(1000);
    expect(data.possible).toHaveLength(0);
});

test('walkExpend', async () => {
    const expend = JSON.parse(expendResponse);
    const data = await walkPayment(expend.data[2]);
    expect(data).toBeDefined();
    expect(data.linked).toHaveLength(239);
    expect(data.possible).toHaveLength(0);
});

test('walkGraph', async () => {
    const orgs = JSON.parse(orgsResponse);
    const data = await walkToGraph(orgs.data[0]);
    expect(data).toBeDefined();
    expect(data.nodes).toHaveLength(20);
    expect(data.links).toHaveLength(19);
});