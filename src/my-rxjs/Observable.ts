import { IOperator } from "./IOperator";
import { ISubscribe } from "./ISubscribe";
import { ISubscriber } from "./ISubscriber";
import { ISubscription } from "./ISubscription";

export class Observable<T> {

    private readonly subscribeFn: ISubscribe<T>;

    constructor(
        subscribeFn: ISubscribe<T>
    ){
        this.subscribeFn = subscribeFn;
    }

    public subscribe(subscriber: ISubscriber<T>): ISubscription {

        let terminated = false;

        const innerSubscriber: ISubscriber<T> = {
            next: value => {
                if(!terminated) {
                    subscriber?.next(value);
                }
            },
            error: err => {
                if(!terminated) {
                    terminated = true;
                    subscriber?.error(err);
                }
            },
            complete: () =>  {
                if(!terminated) {
                    terminated = true;
                    subscriber?.complete();
                }
            }
        };

        const unsubscribeFn = this.subscribeFn(innerSubscriber);

        return {
            unsubscribe: () => {
                terminated = true;
                if(unsubscribeFn) {
                    unsubscribeFn();
                }
            }
        };
    }

    public pipe<U, R>(...pipeline: IOperator<U, R>[]): Observable<R> {
        let obs: Observable<T | R | U> = this;
        pipeline.forEach(operator => obs = operator(obs));
        return obs;
    }
}