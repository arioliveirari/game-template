import ObserverPatronModule from "./ObserverPatronModule";

class MissionModule extends ObserverPatronModule<Partial<any>> {

  constructor() {
    super({});
    this.state = {
      test: "TESTING DE STATE"
    }
  }

  getInfo() {
    return this.state;
  }

  changeStateTest() {
    this.state.test = "TESTING DE STATE CAMBIADO";
    this.notify(this.state);
  }

}

export default MissionModule;
