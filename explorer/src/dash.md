---
theme: dashboard
title: App
toc: false
---

# App

```js
import {text} from "npm:@observablehq/inputs";
import {appSearch} from "./dash.js";
```

```js
const search = view(Inputs.text({label: "Search:", submit: true}));
```

```js
const data = await appSearch(search);
const tbl = view(Inputs.table(data.data));
```