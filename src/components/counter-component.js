import { component } from "@hofjs/hofjs/lib/esm/hof";

const counterStore = {
    value: 10,
  
    valueBeforeChanged(newValue, oldValue) {
        if (newValue <= 20)
            return true;
        else
            return false;
    },
  
    valueAfterChanged(newValue, oldValue) {
        console.log(newValue);
    },
  
    increment() { this.value++; }, 
    decrement() { this.value--; },
  
    test() { return this.value; },
  
    // Live update
    doubled: function() { return this.value * 2 },
  
    // doubled() {
    //     return this.value * 2;
    // },
  };

export const CounterComponent = component("counter-component", {
    counterStore,
  
    // counterStoreBeforePropertyChanged(propName, newValue, oldValue) {
    //     console.log(propName + ": " + newValue);
    //      return false;
    // },
              
    render() {
        const tripled = function() { return this.counterStore.value * 3; };
        
        function quadrupeled() {
            return this.counterStore.value * 4;
        }
  
        return () => `
            <div>${new Date()}</div>
            <div>Count: ${this.counterStore.value} <button onclick="${() => this.counterStore.value++}">++</button></div>
            <div>Double count: ${this.counterStore.doubled+1}</div>
            <div>Triple count: ${-tripled}</div>
            <div>Quadrupled count: ${quadrupeled()}</div>
        `;
    }
  });