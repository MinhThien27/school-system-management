import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, Res, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { LoginDto } from "./dtos/login.dto";
import { Request, Response } from "express";
import { Public } from "src/decorators/public.decorator";
import { Cookie } from "src/decorators/cookie.decorator";
import { UserEntity } from "./entities/user.entity";
import { User } from "src/decorators/user.decorator";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { firstValueFrom } from "rxjs";

@Controller({ path: 'auth', version: '1' })
export class AuthController {
    
    constructor(private readonly authService: AuthService) {}

    @Post()
    @Public()
    @HttpCode(HttpStatus.OK)
    async login(
        @Res({ passthrough: true }) res: Response, 
        @Body(new ValidationPipe({ whitelist: true })) loginDto: LoginDto
    ) {
        const { accessToken, refreshToken } = await firstValueFrom(this.authService.login(loginDto));
        // Create secure cookie with refresh token 
        res.cookie('refreshToken', refreshToken, {
            // httpOnly: true, //accessible only by web server 
            secure: true, //https
            sameSite: 'none', //cross-site cookie 
            maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
        })
        return { accessToken };
    }

    @Get('refresh')
    @Public()
    refresh(@Cookie('refreshToken') refreshToken: string) {
        return this.authService.refresh(refreshToken);
    }

    @Patch('change-password')
    changePassword(
        @User() user: UserEntity, 
        @Body(new ValidationPipe({ whitelist: true })) changePasswordDto: ChangePasswordDto
    ) {
        return this.authService.changePassword(user, changePasswordDto);
    }

    @Post('logout')
    logout(@Req() req: Request, @Res() res: Response) {
        const cookies = req.cookies;
        if (!cookies?.refreshToken) return res.sendStatus(204); //No content
        res.clearCookie('refreshToken', { /*httpOnly: true,*/ sameSite: 'none', secure: true });
        res.json({ message: 'Cookie cleared' });
    }
}