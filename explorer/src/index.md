---
theme: dashboard
title: 527 Explorer
toc: false
---

# 527 Explorer

I like networks so here's a visualization of ProPublica's [527 Explorer](https://projects.propublica.org/527-explorer/).

```js
import {text, card} from "npm:@observablehq/inputs";
import {ForceGraph} from "./components/d3-force-graph.js";
import {appSearch} from "./dash.js";
import {walkToGraph} from "./data/transform.js";
import {Graph} from "./data/graphSchema.js";
```

Search for orgs here:
```js
// Put this in its own box so other code doesn't execute on page load.
const searchBox = view(Inputs.text({label: "Search:", submit: true}));
```

```js
// This executes on searchBox changes.
const searchData = await appSearch(searchBox);
const searchTbl = view(Inputs.table(searchData, {required: false}));
let guard = {fetch: false}; // Must be mutable. Doesn't work with var bool.
```

```js
const addToGraph = view(Inputs.button(`Add to graph (${searchTbl.length}/${searchData.length})`,
    {disabled: searchTbl.length === 0,
    reduce: () => {guard.fetch = true}}
));
```

Data in your graph:
```js
// Must be in its own cell because clicking it doesn't re-execute definition cell.
const clearGraph = view(Inputs.button("Clear Graph"));
```

```js
// This cell re-runs when clearGraph is clicked
clearGraph;
let graphData = new Set([]);
let graph = new Graph();
```

```js
 // This cell re-runs when addToGraph is clicked
addToGraph;
if (guard.fetch) {
    // Prevents pushing data when search executes, page loads, or when
    // user selects (or de-selects) table elements.
    for (var i = 0; i < searchTbl.length; i++) {
        graphData.add(searchTbl[i]);
        graph.mutatingUnion(await walkToGraph(searchTbl[i]));
    }
}
guard.fetch = false;
// It's ok to just re-render the table.
const graphTbl = view(Inputs.table(graphData));
const render = view(Inputs.button("Render viz (hack)"));
```

```js
render;
const viz = view(ForceGraph(graph, {
    nodeId: (d) => d.id, // node identifier, to match links
    nodeGroup: (d) => d.role, // group identifier, for color
    nodeTitle: (d) => `${d.name} (${d.role})`, // hover text
    height: 520,
    nodeStrength: -5, // Keep this < 0 or else things run off page.
    invalidation // stop when the cell is re-run
}));
```