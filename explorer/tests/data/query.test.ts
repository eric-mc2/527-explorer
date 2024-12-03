import { get, getAll } from '../../src/data/query';
import { ContainerResponse } from '../../src/data/responseSchema';

// TODO: Add Jest config (or maybe actually singleton limiter) limit concurrent gets.
// Also, just copy to clipboard and cache all testing data to files.
// Just to make them unit tests instead of actually depending on the live system.
// But more importantly to not get booted from API.

test('search/exp', async () => {
    const params = {search:"Bloomberg", ein:"", order:"desc", mode:"date", page:"1"};
    const data = await get("search/expenditures", params);
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
});

test('search/expAll', async () => {
    const params = {search:"\"health care\"", ein:"", order:"desc", mode:"date", page:"1"};
    const data = await getAll("search/expenditures", params) as ContainerResponse;
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveLength(data.count);
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
