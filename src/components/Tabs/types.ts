import { ComponentPublicInstance } from 'vue'

interface Props {
  title: string;
  checked: boolean;
  id?: string | number;
}

export type Item = Required<Pick<Props, Exclude<keyof Props, 'checked'>>>

export type Child = ComponentPublicInstance<Props>

export type Parent = ComponentPublicInstance<{}, {}, {}, {}, {
  addItem: (item: Child) => void,
  removeItem: (item: Child) => void,
  updateItem: () => void
}>
