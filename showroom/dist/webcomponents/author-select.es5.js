// Copyright (c) 2019 Author.io. MIT licensed.
// @author.io/element-select v1.0.7 available at github.com/author-elements/select
// Last Build: 3/26/2019, 11:45:17 PM
var AuthorSelectElement = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  if (!window.hasOwnProperty('AuthorBaseElement')) {
    console.error('[ERROR] <author-select> Required dependency "AuthorBaseElement" not found.');
    console.info('AuthorBaseElement is available at https://github.com/author-elements/base');
  }

  (function () {
    var missingDependencies = Array.from(new Set(['author-selected-options', 'author-options', 'author-option', 'author-optgroup', 'author-optgroup-label'])).filter(function (dep) {
      return !customElements.get(dep);
    });

    if (missingDependencies.length > 0) {
      console.error("[ERROR] <author-select> Required dependenc".concat(missingDependencies.length !== 1 ? 'ies' : 'y', " not found: ").concat(missingDependencies.map(function (d) {
        return "<".concat(d, ">");
      }).join(', ').replace(', ' + missingDependencies[missingDependencies.length - 1], ' and ' + missingDependencies[missingDependencies.length - 1])));
      missingDependencies.forEach(function (dep, i) {
        return console.info("".concat(i + 1, ". <").concat(dep, "> is available at ").concat('https://github.com/author-elements/select'.replace('select', dep.replace('author-', ''))));
      });
    }
  })();

  var AuthorSelectElement =
  /*#__PURE__*/
  function (_AuthorMenuElement) {
    _inherits(AuthorSelectElement, _AuthorMenuElement);

    function AuthorSelectElement() {
      var _this;

      _classCallCheck(this, AuthorSelectElement);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AuthorSelectElement).call(this, "<template><style>@charset \"UTF-8\"; :host{display:inline-block;max-width:100%}:host *,:host :after,:host :before{box-sizing:border-box}author-select{display:inline-block;max-width:100%}author-select *,author-select :after,author-select :before{box-sizing:border-box}</style><slot name=\"afterbegin\"></slot><slot name=\"beforeselectedoptions\"></slot><slot name=\"selectedoptions\"></slot><slot name=\"afterselectedoptions\"></slot><slot name=\"beforeoptions\"></slot><slot name=\"options\"></slot><slot name=\"afteroptions\"></slot><slot name=\"beforeend\"></slot></template>"));

      _this.UTIL.defineProperties({
        middleware: {
          private: true,
          default: {
            beforeChange: null,
            afterChange: null
          }
        },
        selectedOptionsElement: {
          readonly: true,
          get: function get() {
            return _this.querySelector('author-selected-options');
          }
        },
        type: {
          readonly: true,
          get: function get() {
            return _this.multiple ? 'select-multiple' : 'select-one';
          }
        }
      });

      _this.UTIL.definePrivateMethods({});

      _this.UTIL.registerListeners(_assertThisInitialized(_this), {
        'attribute.change': function attributeChange(evt) {
          var _evt$detail = evt.detail,
              attribute = _evt$detail.attribute,
              oldValue = _evt$detail.oldValue,
              newValue = _evt$detail.newValue;

          if (newValue === oldValue) {
            return;
          }

          if (attribute === 'multiple') {
            return _this.emit('state.change', {
              name: 'multiple',
              value: _this.multiple
            });
          }
        },
        'options.selected': function optionsSelected(evt) {
          return _this.emit('options.selected', evt.detail.options, _this.selectedOptionsElement);
        }
      });

      return _this;
    }

    _createClass(AuthorSelectElement, [{
      key: "clear",
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
      value: function clear() {
        _get(_getPrototypeOf(AuthorSelectElement.prototype), "clear", this).call(this);

        this.selectedOptionsElement.clear();
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['autofocus', 'disabled', 'multiple', 'name', 'open', 'placeholder', 'tabindex', 'size'];
      }
    }]);

    return AuthorSelectElement;
  }(AuthorMenuElement);

  customElements.define('author-select', AuthorSelectElement);

  return AuthorSelectElement;

}());
//# sourceMappingURL=author-select.es5.js.map
