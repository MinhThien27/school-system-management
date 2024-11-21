import { Saga } from "./saga";
import { SagaFLow } from "./saga-flow";
import { Step } from "./step";

export class Factory<T> {
    
    createSaga(steps: Step<T>[]): Saga<T> {
        return new Saga<T>(this.createSagaFlow(steps));
    }

    createSagaFlow(steps: Step<T>[]): SagaFLow<T> {
        return new SagaFLow<T>(steps);
    }

    createStep(name = ''): Step<T> {
        return new Step<T>(name);
    }
}