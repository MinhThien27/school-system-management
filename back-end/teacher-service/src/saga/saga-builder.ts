import { Factory } from "./factory";
import { Saga } from "./saga";
import { Step } from "./step";

export class SagaBuilder<T> {
    private currentStep: Step<T>;
    private steps: Step<T>[] = [];
    private factory = new Factory<T>();

    setFactory(factory: Factory<T>): void {
        this.factory = factory;
    }

    step(name = ''): this {
        this.currentStep = this.factory.createStep(name);
        this.steps.push(this.currentStep);
        return this;
    }

    invoke(method: (params: T) => Promise<void> | void): this {
        this.currentStep.setInvocation(method);
        return this;
    }

    withCompensation(method: (params: T) => Promise<void> | void): this {
        this.currentStep.setCompensation(method);
        return this;
    }

    build(): Saga<T> {
        return this.factory.createSaga(this.steps);
    }
}