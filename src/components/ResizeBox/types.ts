import { EventInfo } from '../../utils/Dragger'
export type Direction = 'top' | 'left' | 'right' | 'bottom';

export type State = Direction | 'max' | 'min'

export type ScreenState = boolean | null

export interface BaseInfo {
  vertical: number;
  horizontal: number;
  mainHorizontal: number;
}
export interface FactoryRes {
  getValue(info: EventInfo): number;
  key: keyof BaseInfo;
}

export interface OperationConf {
  left: Exclude<State, Direction>[];
  right: Direction[];
  }
