# Terminology

* **CTC format**: The [Chrome extension & Chrome app i18n format](https://developer.chrome.com/extensions/i18n-messages) with some minor changes. JSON with their specified model for declaring placeholders, examples, etc. Used as an interchange data format.
* **LHL syntax** (Lighthouse Localizable syntax): The ICU-friendly string syntax that is used to author `UIStrings` and is seen in the locale files in `i18n/locales/*.json`. Lighthouse has a custom syntax these strings combines many ICU message features along with some markdown.
* **ICU**: ICU (International Components for Unicode) is a localization project and standard defined by the Unicode consortium. In general, we refer to "ICU" as the [ICU message formatting](http://userguide.icu-project.org/formatparse/messages) syntax.

# The Lighthouse i18n pipeline

The translation pipeline has 3 distinct stages, the Collection done at build time, the Translation done in the Google TC pipeline, and the Replacement done at runtime.

The collection and translation pipeline:
```
 Source files:                                         Locale files:
+---------------------------+                         +----------------------------------------------
|                           ++                        | lighthouse-core/lib/i18n/locales/en-US.json |
| const UIStrings = { ... };|-+                 +---> | lighthouse-core/lib/i18n/locales/en-XL.json |
|                           |-|                 |     +----------------------------------------------+
+-----------------------------|                 |     |                                             ||
 +----------------------------|                 |     | lighthouse-core/lib/i18n/locales/*.json     |-<+
  +---------------------------+                 |     |                                             || |
                           |                    |     +----------------------------------------------| |
  $ yarn                   |                    |      +---------------------------------------------+ |
      i18n:collect-strings +--------------------+                                                      |
                           |                                                                           |
                           v                          ▐                       ▐    +---------------+   |
              +------------+------+                   ▐   Google TC Pipeline  ▐ +->|  *.ctc.json   |---+
              |  en-US.ctc.json   |  +--------------> ▐      (~2 weeks)       ▐    +---------------+
              +-------------------+  $ g3/import….sh  ▐                       ▐ $ g3/export….sh
```

#### String Collection workflow (build time)

To a typical developer, the pipeline looks like this:

* LH contributor makes any changes to strings.

```shell
# collect UIStrings and bake the en-US & en-XL locales
$ yarn i18n:collect-strings

# Test to see that the new translations are valid and apply to all strings
$ node lighthouse-core/scripts/build-report-for-autodeployment.js && open dist/xl-accented/index.html
```

Note: Why do `en-US` and `en-XL` get baked early?  We write all our strings in `en-US` by default, so they do not need to be translated, so it can be immediately baked without going to the translators.  Similarly, `en-XL` is a debugging language, it is an automated version of `en-US` that simply adds markers to `en` strings in order to make it obvious that something has or hasn't been translated.  So neither of these files need to go to translators to be used, and both can be used at develop-time to help developer i18n workflow.

#### String Translation in Google Translation Console

* Googler is ready to kick off the TC pipeline again.

```shell
# collect UIStrings (to make sure everything is up to date)
$ yarn i18n:collect-strings

# Extract the CTC format files to translation console
$ sh import-source-from-github.sh

# Submit CL. Wait ~2 weeks for translations

# Import the translated CTC format files to locales/ and bake them
$ sh export-tc-dump-to-github.sh
```

#### String Replacement (runtime)

See [Appendix A: How runtime string replacement works](#appendix)



# Writing UIStrings with LHL

We want to keep strings close to the code in which they are used so that developers can easily understand their context. We use `i18n.js` to extract the `UIStrings` strings from individual js files.

LHL strings in each module are defined in a `UIStrings` object with the strings as its properties. JSDoc is used to provide additional information about each string.

The LHL syntax is based primarily around the standardized [ICU message formatting](http://userguide.icu-project.org/formatparse/messages) syntax.


### Basic example

A simple string.

```javascript
const UIStrings = {
  /** Imperative title of a Lighthouse audit that ... */
  title: 'Minify CSS',
};
```

For proper translation, **all** strings must be accompanied by a description, written as a preceeding comment.


### Replacements and primitive formatting

Replacements (aka substitutions) include string replacements like `{some_name}` and number formatting like `{timeInMs, number, milliseconds}`.

#### Direct ICU replacement

`{some_name}` is called _Direct ICU_ since the replacement is a direct substitution of ICU with a variable and uses no custom formatting. This is simply a direct replacement of text into a string. Often used for proper nouns, code, or other text that is dynamic and added at runtime.

ICU replacements must use a JSDoc-like syntax to specify an example for direct ICU replacements:

*   To specify the description, use `@description …`:
    * `@description Label string used to…`
*   To specify an example for an ICU replacement, use `@example {…} …`:
    * `@example {This is an example ICU replacement} variableName`

```javascript
const UIStrings = {
    /**
      * @description Error message explaining ...
      * @example {NO_SPEEDLINE_FRAMES} errorCode
      */
    didntCollectScreenshots: `Chrome didn't .... ({errorCode})`,
};
```

#### Complex ICU replacement

`{timeInMs, number, milliseconds}` is called _Complex ICU_ since the replacement is for numbers and other complex replacements that use the custom formatters in Lighthouse. The supported complex ICU formats are: `milliseconds`, `seconds`, `bytes`, `percent`, and `extendedPercent`.

These complex ICU formats are automatically given @example values during `yarn i18n:collect-strings`.  Therefore, a normal description string can be used:

```javascript
const UIStrings = {
    /** Description of display value. */
    displayValueText: 'Interactive at {timeInMs, number, seconds} s',
};
```

### Ordinals (Numeric Selects), Plurals

An ordinal ICU message is used when the message contains "plurals", wherein a sub-message would need to be selected from a list of messages depending on the value of `itemCount` (in this example).  They are a flavor of "Selects" that have a unique syntax.

```javascript
displayValue: `{itemCount, plural,
  =1 {1 link found}
  other {# links found}
  }`,
```

Note: Why are direct ICU and complex ICU placeholdered out, but Ordinals are not?  Direct and complex ICU should not contain elements that need to be translated (Direct ICU replaces universal proper nouns, and Complex ICU replaces number formatting), while ordinals do need to be translated.  Ordinals and selects are therefore handled specially, and do not need to be placeholdered out.

### Selects

A select ICU message is used when the message should select a sub-message based on the value of a variable `pronoun` in this case. This is often used for gender based selections, but can be used for any enum.  Lighthouse does not use selects very often.

```javascript
displayValue: `{pronoun, select,
  male {He programmed the link.}
  female {She programmed the link.}
  other {They programmed the link.}
  }`,
```


### Markdown

Some strings, like audit descriptions, can also contain a subset of markdown. See [`audit.d.ts`](https://github.com/GoogleChrome/lighthouse/blob/5e52dcca72b35943d14cc7c27613517c425250b9/types/audit.d.ts) for which properties support markdown rendering and will be rendered in the report.

**Inline code blocks**

To format some text as code it should be contained in `backticks`. Any text within the backticks will not be translated. This should be used whenever code is non-translatable. Such as HTML tags or snippets of code. Also note that there is no escape character for using backticks as part of the string, so ONLY use backticks to define code blocks.

```javascript
const UIStrings = {
  title: 'Document has a `<title>` element',
};
```

**Links**

To convert a section of text into a link to another URL, enclose the text itself in [brackets] and then immediately include a link after it in (parentheses). Note that `[link text] (https://...)` is NOT VALID because of the space and will not be converted to a link.

```javascript
const UIStrings = {
  description: 'The value of ... [Learn More](https://google.com/)',
};
```


### Why do we call it LHL?

LHL is a name that is distinct and identifies this as the LightHouse Locale format. Since both LHL and CTC use `.json` files it is ambiguous, so LHL is the given name for the string format that `UIStrings` objects and `locale/*.json` files that are consumed by the Lighthouse i18n engine.

# CTC file format (CTC)

### Why do we use CTC as our i18n messages interchange format?

There are a few data formats used for holding messages for internationalization, including XMB and XLIFF.  We needed a JS-friendly format supported by Google's Translation Console (TC). This format is [somewhat well-specified](https://developer.chrome.com/extensions/i18n-messages) and defined in JSON rather than XML. ;)

### Why do we call it CTC?

CTC is a name that is distinct and identifies this as the Chrome translation format.  `messages.json` is ambiguous in our opinion and so throughout the docs we will refer to files that follow the `messages.json` format as being CTC files with a `.ctc.json` suffix.

### Parts of a CTC message

```json
{
  "name": {
    "message": "Message text, with optional placeholders.",
    "description": "Translator-aimed description of the message.",
    "meaning": "Description given when a message is duplicated, in order to give context to the message. Lighthouse uses a copy of the description for this.",
    "placeholders": {
      "placeholder_name": {
        "content": "A string to be placed within the message.",
        "example": "Translator-aimed example of the placeholder string."
      },
    }
  }
}
```

# Appendix

##  Appendix A: How runtime string replacement works

1.  String called in `.js` file, converted to `LH.IcuMessage` object.

1.  Message object is replaced with the localized string via
    `i18n.replaceIcuMessages` and `i18n.getFormatted`.

#### Example:

1.  string in `lighthouse-core/lib/file_with_uistrings.js`

    ```javascript
    // Declare UIStrings
    const UIStrings = {
      /** Used to summarize the total byte size of the page and.... */
      totalSize: 'Total size was {totalBytes, number, bytes} KiB',
    };

    // Init the strings in this file with the i18n system.
    const str_ = i18n.createIcuMessageFn(__filename, UIStrings);

    // Create an IcuMessage instance with a replacement value for our localizable string.
    const icuMessage = str_(UIStrings.totalSize, {totalBytes: 10240});
    ```

2.  `icuMessage` contains information to localize a message into available locales, including a default fallback created from the original (non-localized) string.

    ```javascript
    // icuMessage
    {
      i18nId: 'lighthouse-core/lib/file_with_uistrings.js | totalSize',
      values: {
        totalBytes: 10240
      },
      formattedDefault: 'Total size was 10 KiB'
    }
    ```

3.  Lookup in `i18n.replaceIcuMessages` and `i18n.getFormatted` will attempt to find the message in this order:

    1.  `locales/{locale}.json` The best result. `icuMessage.i18nId` is found in the target locale and the resulting string should appear correct.

    2.  `locales/en-US.json` _Okay_ result. `icuMessage.i18nId` was not found in the target locale, but it was in `en-US`, so the English string is used.

    3.  The fallback message in `icuMessage.formattedDefault`. This string will be in English, but the lookup is subtly different than the `en-US` lookup. An `IcuMessage` whose `i18nId` is not in `en-US` may be part of an old set of artifacts (or an old LHR passed into `swap-locale`) that contains a string that has since been removed from Lighthouse. The `formattedDefault` is the only option in that case.

    This is also the point at which ICU is replaced by values. So this...

    ```javascript
    totalSize = "Total size was {totalBytes, number, bytes} KiB"
    values = {totalBytes: 10240}
    ```

    Becomes...

    ```javascript
    message = "Total size was 10 KiB"
    ```
