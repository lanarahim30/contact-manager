import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from 'winston'
import { Address, User } from "@prisma/client";
import { AddressResponse, CreateAddressRequest } from "../model/address.model";
import { AddressValidation } from "./address.validation";
import { ContactService } from "../contact/contact.service";
import {v4 as uuid} from 'uuid'

@Injectable()
export class AddressService{
	constructor(
		private validationService: ValidationService,
		private prismaService: PrismaService,
		private contactService: ContactService,
		@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger
	){}

	async create(user: User, request: CreateAddressRequest): Promise<AddressResponse> {
		this.logger.debug(`Create Address ${JSON.stringify(request)}`)
		const addressContact: CreateAddressRequest = this.validationService.validate(AddressValidation.CREATE,request)

		await this.contactService.checkcontact(user.username,addressContact.contact_id)

		const address = await this.prismaService.address.create({
			data:{
				...addressContact,
				...{
					id: uuid()
				}
			}
		})

		return this.toResponseAddress(address);
	}

	toResponseAddress(address: Address) : AddressResponse {

		return {
			id: address.id,
			street: address.street,
			city: address.city,
			province: address.province,
			country: address.country,
			postal_code: address.postal_code,
		}
	}
}