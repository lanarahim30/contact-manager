import { Inject, Injectable } from "@nestjs/common";
import { ValidationService } from "../common/validation.service";
import { PrismaService } from "../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from 'winston'
import { ContactResponse, CreateContactRequest } from "src/model/contact.model";
import { User } from "@prisma/client";
import { ContactValidation } from "./contact.validation";
import {v4 as uuid} from 'uuid'

@Injectable()
export class ContactService{
	constructor(
		private validationService: ValidationService,
		private prismaService: PrismaService,
		@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger
	){}

	async create(user: User, request: CreateContactRequest) : Promise<ContactResponse>{
		this.logger.debug(`Create Contact ${JSON.stringify(request)}`)
		const contactRequest: CreateContactRequest = this.validationService.validate(ContactValidation.CREATE,request)

		const contact = await this.prismaService.contact.create({
			data: {
				...contactRequest,
				...{
					id: uuid()
				},
				...{
					username: user.username
				}
			},
		})

		return {
			id: contact.id,
			first_name: contact.first_name,
			last_name: contact.last_name,
			email: contact.email,
			phone: contact.phone
		};
	}
}