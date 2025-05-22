import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ValidationService } from "../common/validation.service";
import { PrismaService } from "../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from 'winston'
import { ContactResponse, CreateContactRequest, SearchContactRequest, UpdateContactRequest } from "src/model/contact.model";
import { Contact, User } from "@prisma/client";
import { ContactValidation } from "./contact.validation";
import {v4 as uuid} from 'uuid'
import { WebResponse } from "src/model/web.model";

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
					username: user.username,
					id: uuid()
				}
			},
		})

		return this.toContactResponse(contact)
		
	}

	toContactResponse(contact: Contact): ContactResponse {
		return {
			id: contact.id,
			first_name: contact.first_name,
			last_name: contact.last_name,
			email: contact.email,
			phone: contact.phone
		};
	}

	async checkcontact(username: string, contactId): Promise<Contact> {
		const contact = await this.prismaService.contact.findFirst({
			where: {
				username: username,
				id: contactId
			}
		})

		if(!contact) {
			throw new HttpException('Contact not found',404)
		}

		return contact
	}

	async get(user: User, contactId: string): Promise<ContactResponse> {
		const contact = await this.checkcontact(user.username,contactId)

		return this.toContactResponse(contact)
	}
	
	async update(user: User, request: UpdateContactRequest) : Promise<ContactResponse>{
		this.logger.debug(`Update Contact ${JSON.stringify(request)}`)
		const updateRequest: UpdateContactRequest = this.validationService.validate(ContactValidation.UPDATE,request)

		let contact = await this.checkcontact(user.username,updateRequest.id)

		contact = await this.prismaService.contact.update({
			where: {
				id: contact.id,
				username: contact.username
			},
			data: updateRequest
		})

		return this.toContactResponse(contact)
	}

	async delete(user: User, contactId: string): Promise<ContactResponse> {
		await this.checkcontact(user.username,contactId)

		const contact = await this.prismaService.contact.delete({
			where: {
				id: contactId,
				username: user.username
			}
		})

		return this.toContactResponse(contact)
	}

	async search(user: User, request: SearchContactRequest): Promise<WebResponse<ContactResponse[]>> {
		const searchRequest: SearchContactRequest = this.validationService.validate(ContactValidation.SEARCH,request)

		const filters = []

		if(searchRequest.name){
			// add filter name
			filters.push({
				OR: [
					{
					  first_name: {
						contains: searchRequest.name,
					  },
					},
					{
					  last_name: {
						contains: searchRequest.name,
					  },
					},
				],
			});
		}

		if(searchRequest.email){
			// add filter email
			filters.push({
				email: {
					contains: searchRequest.email
				}
			});
		}

		if(searchRequest.phone){
			// add filter phone
			filters.push({
				phone: {
					contains: searchRequest.phone
				}
			});
		}

		const skip = (searchRequest.page - 1) * searchRequest.size

		const contacts = await this.prismaService.contact.findMany({
			where: {
				username: user.username,
				AND: filters
			},
			take: searchRequest.size,
			skip: skip
		})

		const total = await this.prismaService.contact.count({
			where: {
				username: user.username,
				AND: filters
			}
		})

		return {
			data: contacts.map((contact) => this.toContactResponse(contact)),
			paging: {
				current_page: searchRequest.page,
				size: searchRequest.size,
				total_page: Math.ceil(total / searchRequest.size)
			}
		}
	}
}