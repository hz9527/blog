import { EventInfo } from '../../utils/Dragger'
export type Direction = 'top' | 'left' | 'right'; // todo 先不提供 bottom

export type State = Direction | 'max' | 'min'

export type ScreenState = boolean | null

export interface FactoryRes {
  getValue(info: EventInfo): number;
  key: 'vertical' | 'horizontal'
}
