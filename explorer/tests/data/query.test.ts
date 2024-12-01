import { get } from '../../src/data/query';

test('search/exp', async () => {
    const params = {search:"Bloomberg", ein:"", order:"desc", mode:"date", page:"1"};
    const data = await get("search/expenditures", params);
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});

test('search/orgs', async () => {
    const params = {search:"113753369", order: "asc", mode: "ein", page: '1', active: '', has_8872: ''};
    const data = await get("search/orgs", params);
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});

test('search/cont', async () => {
    const params = {search:"Bloomberg", ein:"", order:"desc", mode:"date", page:'1'};
    const data = await get("search/contributors", params);
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});

test('match/exp', async () => {
    const params = {id: '106374129', page: "0"};
    const data = await get("match/expenditures", params);
    expect(data).toBeDefined();
    expect(data).toHaveProperty('linked');
});

test('match/cont', async () => {
    const params = {id: '99514683', page: "0"};
    const data = await get("match/contributions", params);
    expect(data).toBeDefined();
    expect(data).toHaveProperty('linked');
});
  
test('orgs/exp', async () => {
    const params = {id: '202517748', search: '', ein: '202517748', order: 'desc', mode: 'date', page: "1"};
    const data = await get("orgs/expenditures", params);
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});

test('orgs/cont', async () => {
    const params = {id: '202517748', search: '', ein: '202517748', order: 'desc', mode: 'date', page: "1"};
    const data = await get("orgs/contributions", params);
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});
