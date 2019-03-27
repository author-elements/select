class AuthorSelectElement extends AuthorMenuElement {
  constructor () {
    super(`{{TEMPLATE-STRING}}`)

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
    })

    this.UTIL.definePrivateMethods({

    })

    this.UTIL.registerListeners(this, {
      'attribute.change': evt => {
        let { attribute, oldValue, newValue } = evt.detail

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
    })
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
    super.clear()
    this.selectedOptionsElement.clear()
  }
}

customElements.define('author-select', AuthorSelectElement)

export default AuthorSelectElement
