import { get } from '../../src/data/query';
import {ContributionElemSchema, OrganizationElemSchema, ExpenditureElemSchema} from "../../src/data/responseSchema";

test('search/exp', async () => {
    const params = {search:"Bloomberg", ein:"", order:"desc", mode:"date", page:"1"};
    const data = await get("search/expenditures", ExpenditureElemSchema, params);
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});

test('search/orgs', async () => {
    const params = {search:"113753369", order: "asc", mode: "ein", page: '1', active: '', has_8872: ''};
    const data = await get("search/orgs", OrganizationElemSchema, params);
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});

test('search/cont', async () => {
    const params = {search:"Bloomberg", ein:"", order:"desc", mode:"date", page:'1'};
    const data = await get("search/contributors", ContributionElemSchema, params);
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});

// test('match/exp', async () => {
//     const params = {id: '106374129', page: "0"};
//     const data = await get("match/expenditures", ExpenditureMatchSchema, params);
//     expect(data).toBeDefined();
//     expect(data).toHaveProperty('linked');
// });

// test('match/cont', async () => {
//     const params = {id: '99514683', page: "0"};
//     const data = await get("match/contributions", ContributionMatchSchema, params);
//     expect(data).toBeDefined();
//     expect(data).toHaveProperty('linked');
// });
  
test('orgs/exp', async () => {
    const params = {id: '202517748', search: '', ein: '202517748', order: 'desc', mode: 'date', page: "1"};
    const data = await get("orgs/expenditures", ExpenditureElemSchema, params);
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});

test('orgs/cont', async () => {
    const params = {id: '202517748', search: '', ein: '202517748', order: 'desc', mode: 'date', page: "1"};
    const data = await get("orgs/contributions", ContributionElemSchema, params);
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});
