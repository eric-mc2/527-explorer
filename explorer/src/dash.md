---
theme: dashboard
title: App
toc: false
---

# App

```js
import {text} from "npm:@observablehq/inputs";
import {OrganizationElemSchema, ContainerResponse} from "./data/responseSchema.js";
import {get} from "./data/query.js";
```

```js
const search = view(Inputs.text({label: "Search:"}));
```

```js
// const params = {search: search, order: "asc", mode: "name", page: '1', active: '', has_8872: ''};
// const data = await get("search/orgs", OrganizationElemSchema, params);
// data
```