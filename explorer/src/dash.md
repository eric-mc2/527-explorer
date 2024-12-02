---
theme: dashboard
title: App
toc: false
---

# App

```js
import {text, card} from "npm:@observablehq/inputs";
import {ForceGraph} from "./components/d3-force-graph.js";
import {appSearch, appGraph} from "./dash.js";
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
const addGuard = {guard: false};
```

```js
const addToGraph = view(Inputs.button("Add to graph",
    {disabled: searchTbl.length === 0,
    reduce: () => {addGuard.guard = true}}
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
```

```js
 // This cell re-runs when addToGraph is clicked
addToGraph;
if (addGuard.guard) {
    // Prevents pushing data when search executes, page loads, or when
    // user selects (or de-selects) table elements.
    for (var i = 0; i < searchTbl.length; i++) {
        graphData.add(searchTbl[i]);
    }
}
addGuard.guard = false;
// It's ok to just re-render this table.
const graphTbl = view(Inputs.table(graphData));
```

<!-- // const graph = await appGraph(data);
// const viz = ForceGraph(graph, {
//     nodeId: (d) => d.id, // node identifier, to match links
//     nodeGroup: (d) => d.role, // group identifier, for color
//     nodeTitle: (d) => `${d.name} (${d.role})`, // hover text
//     width: 500,
//     height: 520,
//     nodeStrength: -5,
//     invalidation // stop when the cell is re-run
// }); -->