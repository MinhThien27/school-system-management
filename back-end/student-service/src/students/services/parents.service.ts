import { Injectable } from "@nestjs/common";
import { CreateParentDto } from "../dtos/create-parent.dto";
import { Parent } from "../types/parent-custom.type";
import { ParentsRepository } from "../repositories/parents.repository";
import { UpdateParentDto } from "../dtos/update-parent.dto";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";

@Injectable()
export class ParentsService {

    constructor(private readonly parentsRepository: ParentsRepository) {}

    async getParents(studentId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<PaginatedResource<Parent>> {
        const parents = await this.parentsRepository.findParents(studentId, pagination, sorts, filters);
        const parentCount = await this.parentsRepository.countParents({ studentId });
        return {
            totalItems: parentCount,
            items: parents,
            page: pagination.page,
            size: pagination.size
        };
    }

    createParent(studenId: string, createParentDto: CreateParentDto): Promise<Parent> {
        return this.parentsRepository.createParent(studenId, createParentDto);
    }

    udpateParent(parentId: string, updateParentDto: UpdateParentDto): Promise<Parent> {
        return this.parentsRepository.updateParent(parentId, updateParentDto);
    }
    
    deleteParent(parentId: string): Promise<Parent> {
        return this.parentsRepository.deleteParent(parentId);
    }
}