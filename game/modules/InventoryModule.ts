import { InventoryType, Item } from "../Assets/Modals/ModalTypes";
import ObserverPatronModule from "./ObserverPatronModule";


class InventoryModule extends ObserverPatronModule<Partial<InventoryType>> {
    
    constructor() {
        super({});
    }



    changeMoney(amount: number, type: 'physicalMoney' | 'digitalMoney' | 'investedMoney') {
        this.changeState({
            [type]: (this.state[type] || 0) + amount
        });
    }

    addToInventory(item: Item) {
        const items = this.state.items || [];
        const index = items.findIndex(i => i.id === item.id);
        if (index === -1) {
            this.changeState({
                items: [...items, item]
            });
        } else {
            items[index].amount += item.amount;
            this.changeState({
                items
            });
        }
    }

    removeFromInventory(item: Item) {
        const items = this.state.items || [];
        const index = items.findIndex(i => i.id === item.id);
        if (index !== -1) {
            items[index].amount -= item.amount;
            if (items[index].amount <= 0) {
                items.splice(index, 1);
            }
            this.changeState({
                items
            });
        }
    }
}



export default InventoryModule;