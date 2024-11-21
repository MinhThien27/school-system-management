export class Step<T> {
    private invocation: Function;
    private compensation: Function;
    private readonly name: string;

    constructor(name = '') {
        this.name = name;
    }

    setInvocation(method: (params: T) => Promise<void> | void): void {
        this.invocation = method;
    }

    setCompensation(method: (params: T) => Promise<void> | void): void {
        this.compensation = method;
    }

    async invoke(params: T): Promise<void> {
        if (this.invocation) {
            return this.invocation(params);
        }
    }

    async compensate(params: T): Promise<void> {
        if (this.compensation) {
            return this.compensation(params);
        }
    }

    getName(): string {
        return this.name;
    }
}