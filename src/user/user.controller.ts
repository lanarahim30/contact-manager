import { Body, Controller, Delete, Get, HttpCode, Patch, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { WebResponse } from "../model/web.model";
import { LoginRequest, UserRegisterRequest, UserResponse, UserUpdateRequest } from "../model/user.model";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";

@Controller('/api/users')
export class UserController{
	constructor(
		private userService: UserService
	) {}

	@Post()
	async register(@Body() request: UserRegisterRequest): Promise<WebResponse<UserResponse>> {
		const result = await this.userService.register(request)

		return {
			data: result
		}
	}

	@Post('/login')
	@HttpCode(200)
	async login(@Body() request: LoginRequest): Promise<WebResponse<UserResponse>> {
		const result = await this.userService.login(request)

		return {
			data: result
		}
	}

	@Get('/profile')
	@HttpCode(200)
	async current(@Auth() user: User): Promise<WebResponse<UserResponse>> {
		const result = await this.userService.get(user)

		return {
			data: result
		}
	}

	@Patch('/profile')
	@HttpCode(200)
	async update(@Auth() user: User, @Body() request: UserUpdateRequest): Promise<WebResponse<UserResponse>> {
		const result = await this.userService.update(user,request)

		return {
			data: result
		}
	}

	@Delete('/logout')
	@HttpCode(200)
	async logout(@Auth() user: User): Promise<WebResponse<boolean>> {
		const result = await this.userService.logout(user)

		return {
			data: true
		}
	}
}