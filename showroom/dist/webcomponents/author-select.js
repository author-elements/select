// Copyright (c) 2019 Author.io. MIT licensed.
// @author.io/element-select v1.0.7 available at github.com/author-elements/select
// Last Build: 3/26/2019, 11:45:17 PM
var AuthorSelectElement = (function () {
  'use strict';

  if (!window.hasOwnProperty('AuthorBaseElement')) {
              console.error('[ERROR] <author-select> Required dependency "AuthorBaseElement" not found.');
              console.info('AuthorBaseElement is available at https://github.com/author-elements/base');
            }
          (function () {
            let missingDependencies = Array.from(new Set(['author-selected-options','author-options','author-option','author-optgroup','author-optgroup-label'])).filter(dep => !customElements.get(dep));
            if (missingDependencies.length > 0) {
              console.error(`[ERROR] <author-select> Required dependenc${missingDependencies.length !== 1 ? 'ies' : 'y'} not found: ${missingDependencies.map(d => `<${d}>`).join(', ').replace(', ' + missingDependencies[missingDependencies.length - 1], ' and ' + missingDependencies[missingDependencies.length - 1])}`);
              missingDependencies.forEach((dep, i) => console.info(`${i+1}. <${dep}> is available at ${'https://github.com/author-elements/select'.replace('select', dep.replace('author-', ''))}`));
            }
          })();
          class AuthorSelectElement extends AuthorMenuElement {
    constructor () {
      super(`<template><style>@charset "UTF-8"; :host{display:inline-block;max-width:100%}:host *,:host :after,:host :before{box-sizing:border-box}author-select{display:inline-block;max-width:100%}author-select *,author-select :after,author-select :before{box-sizing:border-box}</style><slot name="afterbegin"></slot><slot name="beforeselectedoptions"></slot><slot name="selectedoptions"></slot><slot name="afterselectedoptions"></slot><slot name="beforeoptions"></slot><slot name="options"></slot><slot name="afteroptions"></slot><slot name="beforeend"></slot></template>`);

      this.UTIL.defineProperties({
        middleware: {
          private: true,
          default: {
            beforeChange: null,
            afterChange: null
          }
        },

        selectedOptionsElement: {
          readonly: true,
          get: () => this.querySelector('author-selected-options')
        },

        type: {
          readonly: true,
          get: () => this.multiple ? 'select-multiple' : 'select-one'
        }
      });

      this.UTIL.definePrivateMethods({

      });

      this.UTIL.registerListeners(this, {
        'attribute.change': evt => {
          let { attribute, oldValue, newValue } = evt.detail;

          if (newValue === oldValue) {
            return
          }

          if (attribute === 'multiple') {
            return this.emit('state.change', {
              name: 'multiple',
              value: this.multiple
            })
          }
        },

        'options.selected': evt => this.emit('options.selected', evt.detail.options, this.selectedOptionsElement)
      });
    }

    static get observedAttributes () {
      return ['autofocus', 'disabled', 'multiple', 'name', 'open', 'placeholder', 'tabindex', 'size']
    }

    // get afterChange () {
    //   return this.PRIVATE.middleware.afterChange
    // }
    //
    // set afterChange (func) {
    //   this.PRIVATE.middleware.afterChange = func.bind(this)
    // }
    //
    // get beforeChange () {
    //   return this.PRIVATE.middleware.beforeChange
    // }
    //
    // set beforeChange (func) {
    //   this.PRIVATE.middleware.beforeChange = func.bind(this)
    // }

    clear () {
      super.clear();
      this.selectedOptionsElement.clear();
    }
  }

  customElements.define('author-select', AuthorSelectElement);

  return AuthorSelectElement;

}());
//# sourceMappingURL=author-select.js.map
