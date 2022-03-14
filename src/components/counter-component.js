import { HofHtmlElement } from "@hofjs/hofjs/lib/esm/hof";
import { counterStore } from "../data/counter-store";
import "./child-component";

// CounterComponent must be in its own file that must not include
// other custom elements because otherwise not all custom element
// changes are detected by hmr function
export class CounterComponent extends HofHtmlElement {
    counterStore = counterStore;

    counterStoreBeforeChanged(newValue, oldValue) {
        console.log(`CounterComponent.counterStore.counterStoreBeforeChanged: ${oldValue} -> ${newValue}`);
    }

    counterStoreBeforePropertyChanged(prop, newValue, oldValue) {
        console.log(`CounterComponent.counterStore.counterStoreBeforePropertyChanged: Property ${prop}: ${oldValue} -> ${newValue}`);
    }

    counterStoreAfterPropertyChanged(prop, newValue, oldValue) {
        console.log(`CounterComponent.counterStore.counterStoreAfterPropertyChanged: Property ${prop}: ${oldValue} -> ${newValue}`);
    }
    
    templates = [
        () => `
            <div>First rendered: ${new Date()}</div>
            <button onclick="${this.counterStore.increment}">++</button>
            <button onclick="${() => this.counterStore.count--}">--</button>

            <ul>
                <li>Count: ${this.counterStore.count}</li>
                <li>Inverted (updated): ${this.counterStore.inverted}</li>
                <li>Doubled + 1 (not updated): ${this.counterStore.doubled() + 1}</li>
            </ul>

            <child-component test="${this.counterStore.count}" value="${this.counterStore.count}"></child-component>
        `
    ];
}
customElements.define("counter-component", CounterComponent)