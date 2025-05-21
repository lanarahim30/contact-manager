import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import {LoginRequest, UserRegisterRequest, UserResponse, UserUpdateRequest } from "../model/user.model";
import { Logger } from 'winston'
import { UserValidation } from "./user.validation";
import * as bcrypt from 'bcrypt'
import {v4 as uuid} from 'uuid'
import { User } from "@prisma/client";

@Injectable()
export class UserService {

	constructor(
		private validationService: ValidationService,
		private prismaService: PrismaService,
		@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger
	){}

	async register(request: UserRegisterRequest) : Promise<UserResponse> {
		this.logger.debug(`Register new user ${JSON.stringify(request)}`)
		const registerRequest: UserRegisterRequest = this.validationService.validate(UserValidation.REGISTER,request)

		const totalUserExists = await this.prismaService.user.count({
			where: {
				username: registerRequest.username
			}
		})

		if(totalUserExists != 0) {
			throw new HttpException('Username already exists',400);
		}

		registerRequest.password = await bcrypt.hash(registerRequest.password,10)

		const user = await this.prismaService.user.create({
			data: registerRequest
		})

		return {
			username: user.username,
			name: user.name
		}
	}

	async login(request: LoginRequest): Promise<UserResponse> {
		this.logger.debug(`login user ${JSON.stringify(request)}`)
		const loginRequest: LoginRequest = this.validationService.validate(UserValidation.LOGIN,request)

		let user = await this.prismaService.user.findUnique({
			where:{
				username: loginRequest.username
			}
		})

		if(!user) {
			throw new HttpException('Username or password is invalid',401);
		}

		const isPasswordValid = await bcrypt.compare(loginRequest.password,user.password)
		if(!isPasswordValid) {
			throw new HttpException('Username or password is invalid',401);
		}

		user = await this.prismaService.user.update({
			where: {
				username: loginRequest.username
			},
			data: {
				token: uuid()
			}
		})

		return {
			username: user.name,
			name: user.name,
			token: user.token
		}
	}

	async get(user: User): Promise<UserResponse> {
		return {
			username: user.username,
			name: user.name
		}
	}

	async update(user: User, request: UserUpdateRequest): Promise<UserResponse> {
		this.logger.debug(`user update ${JSON.stringify(request)}`)
		const updateUserRequest: UserUpdateRequest = this.validationService.validate(UserValidation.UPDATE,request)

		if(updateUserRequest.name) {
			user.name = updateUserRequest.name
		}

		if(updateUserRequest.password) {
			user.password = await bcrypt.hash(updateUserRequest.password,10)
		}

		const result = await this.prismaService.user.update({
			where: {
				username: user.username
			},
			data: user
		})

		return {
			name: result.name,
			username: result.username
		}
	}

	async logout(user: User): Promise<UserResponse> {
		const result = await this.prismaService.user.update({
			where: {
				username: user.username
			},
			data: {
				token: null
			}
		})

		return {
			name: result.name,
			username: result.username
		}
	}
}