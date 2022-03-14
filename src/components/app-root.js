import { HofHtmlElement } from "@hofjs/hofjs/lib/esm/hof";
import "./counter-component";

export class AppRoot extends HofHtmlElement {
  templates = [() => `
    <h1>Counter app (function style)</h1>
    <counter-component></counter-component>
    <counter-component count="10"></counter-component>`
  ];
}

customElements.define("app-root", AppRoot);