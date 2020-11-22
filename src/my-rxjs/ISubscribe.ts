import { ISubscriber } from "./ISubscriber";

export type ISubscribe<T> = (subscriber: ISubscriber<T>) => (() => void) | undefined;