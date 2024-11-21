// import { AggregateRoot } from "@nestjs/cqrs";
// import { EntitySchemaFactory } from "./entity-schema.factory";
// import { NotFoundException } from "@nestjs/common";
// import { PrismaClient } from "@prisma/client";
// import { FilterQuery } from "./interfaces/filter-query.interface";

// export abstract class EntityRepository<TPrisma extends PrismaClient, TEntity extends AggregateRoot> {
//     constructor(
//         protected readonly databaseService: TPrisma,
//         protected readonly modelName: string
//     ) {}

//     protected async findOne(entityFilterQuery?: FilterQuery<>): Promise<TEntity> {
//         const entity = await this.databaseService[this.modelName].findFirst({
//             where: {
                
//             }
//         })

//         if (!entityDocument) {
//             throw new NotFoundException('Entity was not found');
//         }

//         return this.entitySchemaFactory.createFromSchema(entityDocument);
//     }

//     protected async find(entityFilterQuery?: FilterQuery<TSchema>): Promise<TEntity[]> {
//         return (
//             await this.entityModel.find(entityFilterQuery, {}, /*{ lean: true }*/)
//         ).map(entityDocument => 
//             this.entitySchemaFactory.createFromSchema(entityDocument)
//         );
//     }

//     async create(entity: TEntity): Promise<void> {
//         await new this.entityModel(this.entitySchemaFactory.create(entity)).save();
//     }

//     protected async findOneAndReplace(entityFilterQuery: FilterQuery<TSchema>, entity: TEntity): Promise<void> {
//         const updatedEntityDocument = await this.entityModel.findOneAndReplace(
//             entityFilterQuery,
//             (this.entitySchemaFactory.create(entity)),
//             {
//                 new: true,
//                 lean: true
//             }
//         )

//         if (!updatedEntityDocument) {
//             throw new NotFoundException('Unable to find the entity to replace');
//         }
//     }
// }