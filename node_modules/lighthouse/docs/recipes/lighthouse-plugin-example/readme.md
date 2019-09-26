# Lighthouse plugin recipe

## Contents
- `package.json` - declares the plugin's entry point (`plugin.js`)
- `plugin.js` - instructs Lighthouse to run the plugin's own `preload-as.js` audit; describes the new category and its details for the report
- `audits/preload-as.js` - the new audit to run in addition to Lighthouse's default audits
 
## To run

1. Install `lighthouse` v5 or later.
2. Install the plugin as a (peer) dependency, parallel to `lighthouse`.
3. Run `npx -p lighthouse lighthouse https://example.com --plugins=lighthouse-plugin-example --view`

The input to `--plugins` will be loaded from `node_modules/`.

## Result

![Screenshot of report with plugin results](./plugin-recipe-screenshot.png)
