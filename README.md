# DEPRECATED

For accessibility and UX reasons, it is better to simply use default `<select>` elements and style them manually.

# AuthorSelectElement [![](https://data.jsdelivr.com/v1/package/npm/@author.io/element-select/badge)](https://www.jsdelivr.com/package/npm/@author.io/element-select?path=dist) [![Build Status](https://travis-ci.org/author-elements/select.svg?branch=master&style=for-the-badge)](https://travis-ci.org/author-elements/select)

`author-select` is a fully-stylable select menu component. It is designed to match the functionality of browser default select menus while providing flexibility for customization if desired.

`author-select` is broken down into several components:

- `author-selected-options`
- `author-options`
- `author-option`
- `author-optgroup-label`
- `author-optgroup`

This allows each part of the component to be styled directly. Each of these components can also be used standalone in other applications as well.

![Source Size](https://img.shields.io/github/size/author-elements/select/src/element.js.svg?colorB=%23333333&label=Source&logo=JavaScript&logoColor=%23aaaaaa&style=for-the-badge) ![Deliverable Size](https://img.shields.io/bundlephobia/minzip/@author.io/element-select.svg?colorB=%23333333&label=Minified-Gzipped&logo=JavaScript&style=for-the-badge) ![npm](https://img.shields.io/npm/v/@author.io/element-select.svg?colorB=%23333&label=%40author.io%2Felement-select&logo=npm&style=for-the-badge)

We're using BrowserStack to make sure these components work on the browsers developers care about.

<a href="https://browserstack.com"><img src="https://github.com/author-elements/select/raw/master/browserstack.png" height="30px"/></a>

## Usage

There are 4 versions of this element:

1. *author-select.min.js* (ES6 Minified for Production)
1. _author-select.js_ (ES6 Unminified for Debugging)
1. *author-select.es5.min.js* (ES5 Minified for Production)
1. _author-select.es5.js_ (ES5 Unminified for Debugging)

You only need to choose one of these files. If you need to support Internet Explorer, older versions of Chrome/Firefox/Safari, then you likely need the ES5 version. Each version has it's own source map, so it's always possible to trace activity back to a specific code block in the source.

The simplest way to use `author-select` is in combination with [author-control](https://github.com/author-elements/control). This combination makes it simple to create totally stylable single or multiple-select menus. Placing a `select` tag inside an `author-control` will automatically generate a fully-functional `author-select` menu and pair it with a label if provided.

*Via Global CDN*

```html
<html>
  <head>
    <script src="https://cdn.author.io/author-elements/base/1.0.0/author-base.min.js"></script>
    <script src="https://cdn.author.io/author-elements/select/x.x.x/author-select.min.js"></script>
  </head>
</html>
```

*Via npm*

1. If the [base class](https://github.com/author-elements/base) is not yet installed, install it:

`npm install @author.io/element-base -S`

2. Next, install the select module locally:

`npm install @author.io/element-select -S`

3. If using with [`author-control`](https://github.com/author-elements/control)

`npm install @author.io/element-control -S`

4. Then include the components in your HTML:

```html
<html>
  <head>
    <script src="./node_modules/@author.io/element-base/dist/author-base.min.js"></script>
    <script src="./node_modules/@author.io/element-base/dist/author-control.min.js"></script>
    <script src="./node_modules/@author.io/element-select/dist/author-select.min.js"></script>
  </head>

  <body>
    <author-control>
      <label>Select Menu</label>
      <select [placeholder="Select an Option"] [multiple]>
        <option value="Option 1">Option 1</option>
        <option value="Option 2">Option 2</option>
        <option value="Option 3">Option 3</option>

        <optgroup label="Grouped Options">
          <option value="Grouped Option 1">Grouped Option 1</option>
          <option value="Grouped Option 2">Grouped Option 2</option>
          <option value="Grouped Option 3">Grouped Option 3</option>
        </optgroup>
      </select>
    </author-control>
  </body>
</html>
```

If using without `author-control`, lay out `author-select` manually using the following markup:

```html
<author-select>
  <!-- <slot name="afterbegin"></slot> -->

  <!-- <slot name="beforeselectedoptions"></slot> -->
  <author-selected-options slot="selectedoptions"></author-selected-options>
  <!-- <slot name="afterselectedoptions"></slot> -->

  <!-- <slot name="beforeoptions"></slot> -->
  <author-options slot="options">
    <author-option value="Option 1">Option 1</author-option>
    <author-option value="Option 2">Option 2</author-option>
    <author-option value="Option 3">Option 3</author-option>

    <author-optgroup-label>OPTGROUP LABEL</author-optgroup-label>
    <author-optgroup>
      <author-option value="Grouped Option 1">Grouped Option 1</author-option>
      <author-option value="Grouped Option 2">Grouped Option 2</author-option>
      <author-option value="Grouped Option 3">Grouped Option 3</author-option>
    </author-optgroup>
  </author-options>
  <!-- <slot name="afteroptions"></slot> -->

  <!-- <slot name="beforeend"></slot> -->
</author-select>
```

Additional elements can be added to the various slots within the markup if desired.

## Customization and Styling
`author-select` is optimized for use with [NGN Chassis](https://github.com/ngn-chassis), a PostCSS-powered CSS Framework and Preprocessor. If using `author-select` separately, it and all its child elements can be styled directly with CSS. For a quick start, download the <a href="#">default theme</a>.

The child elements of `author-select` can also be used independently to create customized UI components. See also [author-datalist](https://github.com/author-elements/datalist).
