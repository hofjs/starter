import { HofHtmlElement } from "@hofjs/hofjs/lib/esm/hof";

// ChildComponent must be in its own file that must not include
// other custom elements because otherwise not all custom element
// changes are detected by hmr function
export class ChildComponent extends HofHtmlElement {
    test = null;
    value = null;

    constructor() {
        super();
    }

    valueBeforeChanged(newValue, oldValue) {
        console.log(`ChildComponent.valueBeforeChanged: ${oldValue} -> ${newValue}`);
        if (newValue % 2 == 0)
            return true;
        else
            return false;
    }

    valueAfterChanged(newValue, oldValue) {
        console.log(`ChildComponent.valueAfterChanged: ${oldValue} -> ${newValue}`);
    }

    testBeforeChanged(newValue, oldValue) {
        console.log(`ChildComponent.testBeforePropertyChanged: ${oldValue} -> ${newValue}`);
        if (newValue % 3 == 0)
            return true;
        else
            return false;
    }

    templates = [
        () => `Value: ${this.value}, ${this.test}`
    ];
}
customElements.define("child-component", ChildComponent)