import { create } from "zustand";
import { persist } from 'zustand/middleware'
import { CartItem } from "../../types/types";


interface CartState {
    list: CartItem[],
    add: (productId: number) => void,
    remove: (productId: number, decreaseQuantity?: boolean) => void,
}

const useCartStore = create<CartState>()(persist((set) => (
    {
        list: [],
        add: (productId) => set(({ list }) => {
            const item = list.find(e => e.productId == productId)
            if (item) {
                item.quantity++;
                return { list: [...list] };
            }
            return { list: [...list, { productId: productId, quantity: 1 }] };
        }),
        remove: (productId, decreaseQuantity) => set(({ list }) => {
            const index = list.findIndex(e => e.productId == productId);
            if (index !== -1) {
                if (decreaseQuantity) list[index].quantity--; else list.splice(index, 1);
            }
            return { list: [...list] };
        })
    }
),
    {
        name: "cartStore"
    })
);


export default useCartStore;