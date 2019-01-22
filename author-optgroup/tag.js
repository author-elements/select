class AuthorOptgroupElement extends HTMLElement {
  constructor () {
    super()

    this.UTIL.definePrivateMethods({
      optionSelectionHandler: evt => this.emit('option.selected', evt.detail, this.parentNode),
      parentStateChangeHandler: evt => this.emit('state.change', evt.detail)
    })

    this.UTIL.registerListeners(this, {
      connected: () => {
        this.parentNode.on('state.change', this.PRIVATE.parentStateChangeHandler)
      },

      disconnected: () => {
        this.parentNode.off('state.change', this.PRIVATE.parentStateChangeHandler)
      },

      'option.selected': this.PRIVATE.optionSelectionHandler
    })
  }

  get options () {
    return this.parentNode.options
  }

  get multiple () {
    return this.parentNode.multiple
  }
}

customElements.define('author-optgroup', AuthorOptgroupElement)
