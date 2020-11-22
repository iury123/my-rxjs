import { Observable } from "./observable";

export type IOperator<T, R> = (source: Observable<T>) => Observable<R>;