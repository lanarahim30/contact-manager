import { Body, Controller, Param, Post } from "@nestjs/common";
import { AddressService } from "./address.service";
import { User } from "@prisma/client";
import { AddressResponse, CreateAddressRequest } from "../model/address.model";
import { WebResponse } from "../model/web.model";
import { Auth } from "../common/auth.decorator";

@Controller('/api/contacts/:contactId/addresses')
export class AddressController{
	constructor(
		private addreService: AddressService
	){}

	@Post()
	async create(
		@Auth() user: User,
		@Param('contactId') contactId: string,
		@Body() request: CreateAddressRequest
	): Promise<WebResponse<AddressResponse>> {
		request.contact_id = contactId
		const result = await this.addreService.create(user,request)

		return {
			data: result
		}
	}
}