import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import {UserRegisterRequest, UserResponse } from "../model/user.model";
import { Logger } from 'winston'
import { UserValidation } from "./user.validation";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {

	constructor(
		private validationService: ValidationService,
		private prismaService: PrismaService,
		@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger
	){}

	async register(request: UserRegisterRequest) : Promise<UserResponse> {
		this.logger.info(`Register new user ${JSON.stringify(request)}`)
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
}