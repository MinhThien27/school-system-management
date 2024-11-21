import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { Class, classSelect } from "../types/class-custom.type";
import { CreateClassDto } from "../dtos/create-class.dto";
import { UpdateClassDto } from "../dtos/update-class.dto";
import { Class as ClassSchema, Prisma } from "@prisma/client";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";
import { CreateclassSubjectDto } from "../dtos/create-class-subject.dto";

@Injectable()
export class ClassesRepository {

    constructor(
        private readonly databaseService: DatabaseService
    ) {}

    async countClasses(): Promise<number> {
        const classCount = await this.databaseService.class.count();
        return classCount;
    }

    async findClasses(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<Class[]> {
        const classes = await this.databaseService.class.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: getWhere(filters),
            orderBy: getOrder(sorts),
            select: classSelect
        }));
        return classes;
    } 

    async findClassesWithFilterQuery(filterQuery: Prisma.ClassWhereInput): Promise<Class[]> {
        const classes = await this.databaseService.class.findMany(({
            where: filterQuery,
            select: classSelect
        }));
        return classes;
    }

    async findClass(filterQuery: Partial<Omit<ClassSchema, 'createdAt' | 'updatedAt'>>): Promise<Class> {
        const _class = await this.databaseService.class.findFirst({
            where: filterQuery,
            select: classSelect
        });
        return _class;
    }   

    async findUniqueClass(filterQuery: { id: string }): Promise<Class> {
        const _class = await this.databaseService.class.findUnique({
            where: filterQuery,
            select: classSelect
        });
        return _class;
    }

    async createClass(createClassDto: CreateClassDto, createManyClassSubjects: CreateclassSubjectDto[]): Promise<Class> {
        const result = await this.databaseService.$transaction(async (tx) => {
            const createdClass = await tx.class.create({
                data: createClassDto,
                select: classSelect
            });
            await tx.classSubject.createMany({
                data: createManyClassSubjects.map(createClassSubjectDto => ({ classId: createdClass.id, ...createClassSubjectDto }))
            })
            return createdClass;
          })
        return result;
    }

    async updateClass(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
        const updatedClass = await this.databaseService.class.update({
            where: { id },
            data: updateClassDto,
            select: classSelect
        });
        return updatedClass;
    }

    async deleteClass(id: string): Promise<Class> {
        const deletedClasss = await this.databaseService.class.delete({
            where: { id },
            select: classSelect
        });
        return deletedClasss;
    }

    async deleteClasses(filterQuery: Prisma.ClassWhereInput): Promise<Prisma.BatchPayload> {
        return await this.databaseService.class.deleteMany({
            where: filterQuery
        });
    }
}