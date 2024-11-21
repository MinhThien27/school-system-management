import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { verify } from "jsonwebtoken";
import { IS_PUBLIC_KEY } from "src/decorators/public.decorator";
import { UserEntity } from "../entities/user.entity";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly configService: ConfigService,
        private readonly reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPulic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (isPulic) return true;
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException();
        try {
            const decoded = await new Promise<{ UserInfo: UserEntity }>((resolve, reject) => {
                verify(
                    token,
                    this.configService.get<string>('ACCESS_TOKEN_SECRET'),
                    (err: any, decoded: any) => {
                        if (err) reject(err);
                        resolve(decoded);
                    }
                )
            });
            request['user'] = {
                id: decoded.UserInfo.id,
                firstName: decoded.UserInfo.firstName,
                lastName: decoded.UserInfo.lastName,
                role: decoded.UserInfo.role,
                avatar: decoded.UserInfo.avatar
            };
        } catch (err) {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined; 
    }
} 