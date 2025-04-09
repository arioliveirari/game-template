import ObserverPatronModule from "./ObserverPatronModule";

export interface BusinessState {
    hasLand: boolean
  }
  
  class BusinessModule extends ObserverPatronModule<Partial<BusinessState>> {
    protected state: BusinessState;
    
    constructor(texture = "wizzardAqua") {
      super({});
      this.state = {
        hasLand: false
      };
  
      // add delayed call
      //    setTimeout(() => {
      //     this.setActive(false);
      //    },10000)
    }
  
    buyLand() {
      this.state.hasLand = true;
    }

    getBState() {
      let newState = {
        hasLand: this.state.hasLand
      };
      return newState;
    }

    setBState(state: Partial<BusinessState>) {
      Object.keys(state).forEach(key => {
        if (state[key as keyof BusinessState] !== undefined) {
          // @ts-ignore
          this.state[key as keyof BusinessState] = state[key as keyof BusinessState];       
        }
      });
    }
  }
  
  export default BusinessModule;