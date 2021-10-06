import { querySelectorAllDeep } from "query-selector-shadow-dom";
import { HofHtmlElement } from "@hofjs/hofjs/lib/esm/hof";

// Source for custom element proxy
// https://codepen.io/stiggler/pen/XPJjyp

export function enableHofHmr(...rootComponents) {
    customElements.rootComponents = rootComponents.map(c => c.componentName);
}

function setupHofHmr() {
    const configs = {};
    const define = window.customElements.define.bind(window.customElements);
    
    window.customElements.define = (name, clazz) => {
      const config = configs[name] = configs[name] || {};

      if (!customElements.get(name)) {
        config.clazz = clazz;
        define(name, createConstructor(config));
      }
      else {
        if (module.hot.data) {
            // Clean module.hot.data, if customElements.define
            // was only called because of hmr component bubble up
            if (customElements.rootComponents.includes(name))
                module.hot.data = undefined;

            // Do nothing because we are in hmr component bubble up
            return;
        }

        config.clazz = clazz;

        // Apply new class to current instances of custom element
        querySelectorAllDeep(name).forEach((node) => {
            Object.setPrototypeOf(node, clazz.prototype)

            // Rerender
            node.connectedCallback();
        });

        // Log processed element to detect hmr component bubble up
        // (next call to customElements.define from higher module)
        if (!customElements.rootComponents.includes(name))
            module.hot.data = name;
      }
    }
    
    function createConstructor(config) {
      const proxyPrototype = new Proxy({}, {
        get(target, trapName, receiver) {
          return function (...args) {
              if (config.clazz.prototype[trapName])
                return config.clazz.prototype[trapName].apply(this, args);
          }
        }
      });
    
      Object.setPrototypeOf(CustomElementConstructor.prototype, proxyPrototype);

      function CustomElementConstructor(...args) {
        assignPrototype(CustomElementConstructor, config.clazz);
        return Reflect.construct(config.clazz, args, CustomElementConstructor);
      };
        
      return CustomElementConstructor;
    }
    
    function assignPrototype(target, source) {
      Object.setPrototypeOf(target.prototype, source.prototype);
      Object.setPrototypeOf(target, source);  
    }
}

if (HofHtmlElement)
  HofHtmlElement.prototype._forEachPropertyOfObjectAndPrototype = function(func) {
    for (const name of Object.getOwnPropertyNames(this).filter(this.PROPS_FILTER))
        func(name, this);
    const prototype = Object.getPrototypeOf(this);
    for (const name of Object.getOwnPropertyNames(prototype).filter(this.PROPS_FILTER))
        func(name, prototype);

    if (Object.getPrototypeOf(this).constructor.name == "CustomElementConstructor") {
        const prototype = Object.getPrototypeOf(Object.getPrototypeOf(this));
        for (const name of Object.getOwnPropertyNames(prototype).filter(this.PROPS_FILTER))
            func(name, prototype);    
    }
  }

// Needs to be executed at import because otherwise the other
// component imports already call customElements.define
// before this hook is installed
setupHofHmr();