class AuthorOptionElement extends HTMLElement {
  constructor () {
    super()

    this.UTIL.defineAttributes({
      disabled: false,
      hover: false,
      id: '',
      label: '',
      selected: false,
      value: ''
    })

    this.UTIL.defineProperties({
      defaultSelected: false,

      form: {
        readonly: true,
        private: true
      },

      index: {
        readonly: true,
        get: () => this.parentNode.options.findIndex(option => option.displayElement === this)
      }
    })

    this.UTIL.definePrivateMethods({
      mouseButtonDown: evt => {
        let code = evt.buttons !== undefined ? evt.buttons : evt.nativeEvent.which
        return code >= 1
      },

      mousemoveHandler: evt => this.emit('option.hovered', this.index),

      mouseoutHandler: evt => this.hover = false,

      mouseoverHandler: evt => {
        let mousedown = this.PRIVATE.mouseButtonDown(evt)

        if (!(this.parentNode.multiple && mousedown)) {
          this.hover = true
          return
        }

        let { shiftKey, metaKey, ctrlKey } = evt
        this.PRIVATE.select(shiftKey, metaKey, ctrlKey, mousedown)
      },

      parentStateChangeHandler: evt => {
        let { name, value } = evt.detail

        switch (name) {
          case 'multiple':
            if (value) {
              this.removeEventListener('mouseup', this.PRIVATE.selectionHandler)
              this.addEventListener('mousedown', this.PRIVATE.selectionHandler)
            } else {
              this.addEventListener('mouseup', this.PRIVATE.selectionHandler)
              this.removeEventListener('mousedown', this.PRIVATE.selectionHandler)
            }
            break
        }
      },

      select: (shiftKey = false, metaKey = false, ctrlKey = false, mousedown = false) => {
        let { index } = this
        this.emit('option.selected', {index, shiftKey, metaKey, ctrlKey, mousedown}, this.parentNode)
      },

      selectionHandler: evt => {
        let { shiftKey, metaKey, ctrlKey } = evt
        this.PRIVATE.select(shiftKey, metaKey, ctrlKey)
      }
    })

    this.UTIL.registerListeners(this, {
      connected: () => {
        this.parentNode.on('state.change', this.PRIVATE.parentStateChangeHandler)
      },

      disconnected: () => {
        this.off('mousedown', this.PRIVATE.selectionHandler)
        this.parentNode.off('state.change', this.PRIVATE.parentStateChangeHandler)
      },

      mouseover: this.PRIVATE.mouseoverHandler,
      mousemove: this.PRIVATE.mousemoveHandler,
      mouseout: this.PRIVATE.mouseoutHandler,
      mouseup: this.PRIVATE.selectionHandler
    })
  }

  static get observedAttributes () {
    return ['disabled', 'hover', 'label', 'selected', 'value']
  }

  get text () {
    return this.innerHTML
  }

  set text (content) {
    this.innerHTML = content
  }

  /**
   * @method remove
   * Remove this option from the DOM.
   * @override
   */
  remove () {
    this.parentNode.options.splice(this.index, 1)
    super.remove()
  }
}

customElements.define('author-option', AuthorOptionElement)
