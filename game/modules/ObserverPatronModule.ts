
class ObserverPatronModule<T> {
    observers: Function[] = [];
    protected state: T;

    constructor(state: T) {
        this.state = state;
        this.observers = [];
    }

    getState() {
        return this.state;
    }

    subscribe(observer: Function) {
        this.observers.push(observer);
    }

    unsubscribe(observer: Function) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(state: T) {
        this.observers.forEach(observer => observer(state));
    }

    clear() {
        this.observers = [];
    }

    changeState(state: T) {
        this.state = state;
        this.notify(state);
    }
}

export default ObserverPatronModule;