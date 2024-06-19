# contend-cms
THIS IS JUST AN EXPERIMENT FOR NOW

The plan is to build a small Web-CMS that provides both a server-side rendered option as well as a headless api that returns json, allowing the user to enrich their website in certain spots via the CMS instead of building the entire site in the CMS.

conten(d) is not a typo, it is meant to evoke that the CMS allows you to be competitive and productive in the market.

## Frontend
We use web components to build small and highly compatible and performant frontend components that can be combined and nested within each other.

## Headless
The headless option offers the user the ability to integrate content from the CMS in parts of their website. All that is needed is a small base javascript file.
```html
<script src="./js/ContendCms.js" defer></script>
```
Then just place the web-component wherever you want to render cms content and provide the sourceUrl to the content you want to render, like so:

```html
<contend-cms-elements source-url="/cms/headless/home-page-header"></contend-cms-elements>
```

`contend-cms-elements` is the root element that fetches the content, loads needed Javascript and renders the elements.