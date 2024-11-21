import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../repositories/auth.repository";

@Injectable()
export class AuthSagaService {

    constructor(private readonly authRepository: AuthRepository) {}

    
}