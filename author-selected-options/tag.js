class AuthorSelectedOptionsElement extends HTMLElement {
  constructor () {
    super()

    this.UTIL.defineProperties({
      contentsElement: {
        readonly: true,
        private: true,
        default: this.shadowRoot.getElementById('contents')
      },

      options: {
        private: true,
        default: []
      }
    })

    this.UTIL.definePrivateMethods({
      appendCaret: () => {
        let xmlns = 'http://www.w3.org/2000/svg'
        let width = 24
        let height = 24

        let caret = document.createElementNS(xmlns, 'svg')
        caret.slot = 'beforeend'
        caret.setAttributeNS(null, 'width', width)
        caret.setAttributeNS(null, 'height', height)
        caret.setAttributeNS(null, 'viewBox', `0 0 ${width} ${height}`)
        caret.setAttributeNS(null, 'fill', 'none')
        caret.setAttributeNS(null, 'stroke', 'currentColor')
        caret.setAttributeNS(null, 'stroke-width', '3')
        caret.setAttributeNS(null, 'stroke-linecap', 'square')
        caret.setAttributeNS(null, 'stroke-linejoin', 'miter')

        let shape = document.createElementNS(xmlns, 'polyline')
        shape.setAttributeNS(null, 'points', '6 9 12 15 18 9')

        caret.appendChild(shape)
        this.appendChild(caret)
      },

      optionSelectionHandler: evt => {
        evt.stopPropagation()

        this.clear(evt.detail.length === 0)
        evt.detail.forEach((option, index) => this.add(option, index === evt.detail.length - 1))
      },

      parentStateChangeHandler: evt => {
        let { name, value } = evt.detail

        switch (name) {
          case 'multiple':
            if (!value) {
              return this.on('mousedown', this.PRIVATE.mousedownHandler)
            }

            return this.off('mousedown', this.PRIVATE.mousedownHandler)

          default: return
        }
      },

      mousedownHandler: evt => this.emit('toggle', null, this.parentNode)
    })

    this.UTIL.registerListeners(this, {
      connected: () => {
        this.PRIVATE.appendCaret()
        this.update()
        this.parentNode.on('state.change', this.PRIVATE.parentStateChangeHandler)
      },

      disconnected: () => {
        this.parentNode.off('state.change', this.PRIVATE.parentStateChangeHandler)
      },

      mousedown: this.PRIVATE.mousedownHandler,
      'options.selected': this.PRIVATE.optionSelectionHandler
    })
  }

  get list () {
    return this.PRIVATE.options.map(option => option.displayElement.text).join(', ')
  }

  add (option, update = true) {
    this.PRIVATE.options.push(option)
    update && this.update()
  }

  clear (update = true) {
    this.PRIVATE.options = []
    update && this.update()
  }

  remove (option, update = true) {
    this.PRIVATE.options.splice(this.PRIVATE.options.indexOf(option), 1)
    update && this.update()
  }

  update (options = this.PRIVATE.options) {
    if (options !== this.PRIVATE.options) {
      this.PRIVATE.options = options
    }

    this.PRIVATE.contentsElement.innerHTML = options.length > 0
      ? this.list
      : this.parentNode.placeholder || ''
  }
}

customElements.define('author-selected-options', AuthorSelectedOptionsElement)
