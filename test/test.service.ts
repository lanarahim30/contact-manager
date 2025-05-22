import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma.service";
import * as bcrypt from 'bcrypt'
import {v4 as uuid} from 'uuid'
import { Contact } from "@prisma/client";
@Injectable()
export class TestService{
	constructor(
		private prismaService: PrismaService
	){}

	async deleteUser() {
		await this.prismaService.user.deleteMany({
			where: {
				username: 'test'
			}
		})
	}

	async deleteContact() {
		await this.prismaService.contact.deleteMany({
			where: {
				username: 'test'
			}
		})
	}

	async createUser() {
		await this.prismaService.user.create({
			data: {
				username: 'test',
				name: 'test',
				password: await bcrypt.hash('test1234',10),
				token: 'token'
			}
		})
	}

	async getContact(): Promise<Contact> {
		return this.prismaService.contact.findFirst({
			where: {
				username:'test'
			}
		})
	}

	async createContact() {
		await this.prismaService.contact.create({
			data: {
				id: uuid(),
				first_name: 'test',
				last_name: 'test',
				email: 'test@example.com',
				phone: '9999',
				username:'test'
			}
		})
	}
}