/* eslint-disable no-unused-vars */
import { Tree } from '../../types/index'

export type Extra<K extends string> = {
  [s in K]: {
    name: string;
    names: string[];
    fold: boolean;
    canFold: boolean;
  }
}

export interface Options<D, K extends string> {
  getName: (item: D) => string,
  getCanFold?: (item: D) => boolean,
  getInitFold?: (item: D) => boolean,
  key?: K
}

export type Item<D, K extends string> = D & Extra<K>

export type Data<D extends Record<string, any>, K extends string> = Tree<Item<D, K>>
