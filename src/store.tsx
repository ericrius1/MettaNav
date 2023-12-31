import { create } from 'zustand';


export type StoreState = {
    iconHovered: boolean;
    setIconHovered: (value: boolean) => void;
}
export const useStore = create<StoreState>(set => ({
    iconHovered: false,
    setIconHovered: (value: boolean) => set(() => ({ iconHovered: value })),
}));
