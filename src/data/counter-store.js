export const counterStore = {
    // Regular property: If count changes, only depending parts of html are updated
    count: 10,

    countBeforeChanged(newValue, oldValue) {
        console.log(`counterStore.countBeforeChanged: ${oldValue} -> ${newValue}`);
        if (newValue <= 20)
            return true;
        else
            return false;
    },

    countAfterChanged(newValue, oldValue) {
        console.log(`counterStore.countAfterChanged: ${oldValue} -> ${newValue}`);
    },

    // Derived property: If count changes, inverted changes too
    // and depending parts of html are updated
    get inverted() { return -this.count; },

    // Regular method: This is not tracked and only evaluated on first rendering
    doubled() {
        return this.count * 2;
    },

    // Regular method: This is not tracked
    increment() {
        this.count++;
    },
};