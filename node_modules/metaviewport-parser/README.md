[![devDependency Status](https://david-dm.org/dontcallmedom/metaviewport-parser/dev-status.svg)](https://david-dm.org/dontcallmedom/metaviewport-parser#info=devDependencies)

# Meta viewport parser

This library uses the algorithm described in the [W3C CSS Device Adaption specification](http://dev.w3.org/csswg/css-device-adapt/#viewport-meta) to parse and interpret the content of a meta viewport declaration.

## Attribute parser

The function parseMetaViewPortContent() takes the content of the `content` attribute of a meta viewport declaration, and parses it into an object separating valid properties (key `validProperties`), unknown properties (key `unknownProperties`), and known properties with invalid values (key `invalidValues`).

```html
<meta name=viewport content="width=device-width">
```

```javascript
// contentAttr contains "width=device-width";

var metaparser = require('metaviewport-parser');
console.log(metaparser.parseMetaViewPortContent(contentAttr));
// { validProperties: {width: 'device-width'},
//   unknownProperties: {},
//   invalidValues: {}
// }
```

```html
<meta name=viewport content="width=foo,initial-scale=1">
```

```javascript
var metaparser = require('metaviewport-parser');
console.log(metaparser.parseMetaViewPortContent(contentAttr));
// { validProperties: {'initial-scale': 1},
//   unknownProperties: {},
//   invalidValues: {'width': 'foo'}
// }
```


```html
<meta name=viewport content="width=foo,initial-scale=1">
```

```javascript
var metaparser = require('metaviewport-parser');
console.log(metaparser.parseMetaViewPortContent(contentAttr));
// { validProperties: {'initial-scale': 1},
//   unknownProperties: {},
//   invalidValues: {'width': 'foo'}
// }
```

## Viewport properties interpreter

The function getRenderingDataFromViewport() takes an object with valid properties of a viewport (`width`, `height`, `initial-scale`, `maximum-scale`, `minimum-scale`, `user-scalable`), and parameters describing the browser dimensions, and returns an object describing the inital width, height and zoom used to render a page with such a viewport, and whether the user can zoom or not (property `userZoom` with values `zoom` or `fixed`).

The following examples assume a browser with a `device-width` of 320, a `device-height` of 480, a maximum zoom of 4 and minimum zoom of 0.25.

The `zoom` key is set to null when the value is interpreted as "auto".

```html
<meta name=viewport content="width=device-width">
```

```javascript
// contentAttr contains "width=device-width";

var metaparser = require('metaviewport-parser');
var viewport = metaparser.parseMetaViewPortContent(contentAttr);
var renderingData = metaparser.getRenderingDataFromViewport(viewport.validProperties);
console.log(renderingData);
// { zoom: null, width: 320, height: 480, userZoom: "zoom" }
```

```html
<meta name=viewport content="initial-scale=1">
```

```javascript
var metaparser = require('metaviewport-parser');
var viewport = metaparser.parseMetaViewPortContent(contentAttr);
var renderingData = metaparser.getRenderingDataFromViewport(viewport.validProperties);
console.log(renderingData);
// { zoom: 1, width: 320, height: 480, userZoom: "zoom" }
```

```html
<meta name=viewport content="initial-scale=2.0,height=device-width">
```

```javascript
var metaparser = require('metaviewport-parser');
var viewport = metaparser.parseMetaViewPortContent(contentAttr);
var renderingData = metaparser.getRenderingDataFromViewport(viewport.validProperties);
console.log(renderingData);
// { zoom: 2, width: 213, height: 320, userZoom: "zoom" }
```

```html
<meta name=viewport content="initial-scale=1,user-scalable=no">
```

```javascript
var metaparser = require('metaviewport-parser');
var viewport = metaparser.parseMetaViewPortContent(contentAttr);
var renderingData = metaparser.getRenderingDataFromViewport(viewport.validProperties);
console.log(renderingData);
// { zoom: 1, width: 320, height: 480, userZoom: "fixed" }
```

