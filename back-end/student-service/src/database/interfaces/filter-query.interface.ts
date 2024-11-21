export abstract class FilterQuery<T> {

    constructor(
        private readonly entity: T
    ) {
        this.factory(entity);
    }

    private factory(entity: T): void {
        for (const key in entity) {
            this.entity[key] = entity[key];
        }
    }
}