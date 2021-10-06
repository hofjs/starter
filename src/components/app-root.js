import { component } from "@hofjs/hofjs/lib/esm/hof";
import "./counter-component";

console.dir(component)
export const AppRoot = component("app-root", {
    render() {
      return () => `
        <h1>Counter app (function style)</h1>
        <counter-component></counter-component>
        <counter-component count="10"></counter-component>`;
    }
  });