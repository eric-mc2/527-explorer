import { get } from '../../src/data/query';

test('search/exp', async () => {
    const data = await get("search/expenditures", {search:"Bloomberg", ein:"", order:"desc", mode:"date", page:"1"});
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});

test('search/orgs', async () => {
    const data = await get("search/orgs", {search:"113753369", order: "asc", mode: "ein", page: '1', active: '', has_8872: ''})
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});

test('search/cont', async () => {
    const data = await get("search/contributors", {search:"Bloomberg", ein:"", order:"desc", mode:"date", page:'1'});
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});

test('match/exp', async () => {
    const data = await get("match/expenditures", {id: '106374129', page: "0"})
    expect(data).toBeDefined();
    expect(data).toHaveProperty('linked');
});

test('match/cont', async () => {
    const data = await get("match/contributions", {id: '99514683', page: "0"})
    expect(data).toBeDefined();
    expect(data).toHaveProperty('linked');
});
  
test('orgs/exp', async () => {
    const data = await get("orgs/expenditures", {id: '202517748', search: '', ein: '202517748', order: 'desc', mode: 'date', page: "1"})
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});

test('orgs/cont', async () => {
    const data = await get("orgs/contributions", {id: '202517748', search: '', ein: '202517748', order: 'desc', mode: 'date', page: "1"})
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});
