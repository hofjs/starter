import { querySelectorAllDeep } from "query-selector-shadow-dom";

// Source for custom element proxy
// https://codepen.io/stiggler/pen/XPJjyp

export function enableHofHmr(...rootComponents) {
    customElements.rootComponents = rootComponents;
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
            // Apply new prototype
            Object.setPrototypeOf(node, clazz.prototype);

            // Make methods object properties
            for (const name of Object.getOwnPropertyNames(clazz.prototype))
              node[name] = clazz.prototype[name].bind(node);

            // Copy templates and styles
            const newInstance = document.createElement(name);
            node.templates = newInstance.templates;
            node.styles = newInstance.styles;

            // Rerender
            node._root.innerHTML = "";
            node.render();
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

// Needs to be executed at import because otherwise the other
// component imports already call customElements.define
// before this hook is installed
setupHofHmr();