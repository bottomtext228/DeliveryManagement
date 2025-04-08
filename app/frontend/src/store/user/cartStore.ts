import { create } from "zustand";


interface CartItem {
    productId: number,
    quantity: number
}

interface CartState {
    list: CartItem[],
    add: (productId: number) => void,
    remove: (productId: number) => void,
}

const useCartStore = create<CartState>((set) => ({
    list: [],
    add: (productId) => set(({ list }) => {
        const item = list.find(e => e.productId == productId)
        if (item) {
            item.quantity++;
            return { list: list };
        }
        return { list: [...list, { productId: productId, quantity: 1 }] };
    }),
    remove: (productId) => set(({ list }) => {
        var index = list.findIndex(e => e.productId == productId);
        if (index !== -1) {
            list.splice(index, 1);
        }
        return { list: [...list] };
    })
}));

export default useCartStore;