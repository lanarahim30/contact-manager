import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";
import { ContactResponse, CreateContactRequest, SearchContactRequest, UpdateContactRequest } from "../model/contact.model";
import { WebResponse } from "../model/web.model";

@Controller('/api/contacts')
export class ContactController{
	constructor(
		private contactService: ContactService
	) {}

	@Post()
	async create(
		@Auth() user: User, 
		@Body() request: CreateContactRequest
	): Promise<WebResponse<ContactResponse>> {
		const result = await this.contactService.create(user,request)

		return {
			data: result
		}
	}

	@Get('/search')
	@HttpCode(200)
	async search(
		@Auth() user: User, 
		@Query('name') name?: string,
		@Query('email') email?: string,
		@Query('phone') phone?: string,
		@Query('page',new ParseIntPipe({optional: true})) page?: number,
		@Query('size',new ParseIntPipe({optional: true})) size?: number
	): Promise<WebResponse<ContactResponse[]>> {
		const request: SearchContactRequest = {
			name: name,
			email: email,
			phone: phone,
			page: page || 1,
			size: size || 10
		}
		console.log(request)
		return this.contactService.search(user,request)
	}

	@Get('/:contactId')
	async get(
		@Auth() user: User, 
		@Param('contactId') contactId: string
	): Promise<WebResponse<ContactResponse>> {
		const result = await this.contactService.get(user,contactId)

		return {
			data: result
		}
	}

	@Put('/:contactId')
	@HttpCode(200)
	async update(
		@Auth() user: User, 
		@Param('contactId') contactId: string, 
		@Body() request: UpdateContactRequest
	): Promise<WebResponse<ContactResponse>> {
		request.id = contactId
		const result = await this.contactService.update(user,request)
		return {
			data: result
		}
	}

	@Delete('/:contactId')
	async delete(
		@Auth() user: User, 
		@Param('contactId') contactId: string
	): Promise<WebResponse<boolean>> {
		await this.contactService.delete(user,contactId)

		return {
			data: true
		}
	}
}