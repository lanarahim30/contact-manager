import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('ContactController (e2e)', () => {
  let app: INestApplication;
  let logger: Logger
  let testService: TestService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

	logger = app.get(WINSTON_MODULE_PROVIDER)
	testService = app.get(TestService)
  });

   	describe("POST /api/contacts",() => {
		beforeEach(async() => {
			await testService.deleteContact()
			await testService.deleteUser()

			await testService.createUser()
		})

		it("should be rejected if request is invalid", async () => {
			const response = await request(app.getHttpServer())
				.post('/api/contacts')
				.set('Authorization','token')
				.send({
					first_name: '',
					last_name: '',
					email: 'salah',
					phone: ''
				})
			
			logger.info(response.body)
			
			expect(response.status).toBe(400)
			expect(response.body.errors).toBeDefined()
		})
		
		it("should be able to create contact", async () => {
			const response = await request(app.getHttpServer())
				.post('/api/contacts')
				.set('Authorization','token')
				.send({
					first_name: 'test',
					last_name: 'test',
					email: 'test@example.com',
					phone: '9999'
				})
			
			logger.info(response.body)
			
			expect(response.status).toBe(201)
			expect(response.body.data.id).toBeDefined()
			expect(response.body.data.first_name).toBe('test')
			expect(response.body.data.last_name).toBe('test')
			expect(response.body.data.email).toBe('test@example.com')
			expect(response.body.data.phone).toBe('9999')
		})
	})

	describe("GET /api/contacts/:contactId",() => {
		beforeEach(async() => {
			await testService.deleteContact()
			await testService.deleteUser()

			await testService.createUser()
			await testService.createContact()
		})

		it("should be rejected if contact is not found", async () => {
			const contact = await testService.getContact()
			const response = await request(app.getHttpServer())
				.get(`/api/contacts/594277f9-058e-43e5-a2c3-f1558bee4de2`)
				.set('Authorization','token')
			
			logger.info(response.body)
			
			expect(response.status).toBe(404)
			expect(response.body.errors).toBeDefined()
		})
		
		it("should be able to get contact", async () => {
			const contact = await testService.getContact()
			const response = await request(app.getHttpServer())
				.get(`/api/contacts/${contact.id}`)
				.set('Authorization','token')

			logger.info(response.body)
			
			expect(response.status).toBe(200)
			expect(response.body.data.id).toBeDefined()
			expect(response.body.data.first_name).toBe('test')
			expect(response.body.data.last_name).toBe('test')
			expect(response.body.data.email).toBe('test@example.com')
			expect(response.body.data.phone).toBe('9999')
		})
    })

	describe("POST /api/contacts/:contactId",() => {
		beforeEach(async() => {
			await testService.deleteContact()
			await testService.deleteUser()

			await testService.createUser()
			await testService.createContact()
		})

		it("should be rejected if request is invalid", async () => {
			const contact = await testService.getContact()
			const response = await request(app.getHttpServer())
				.put(`/api/contacts/${contact.id}`)
				.set('Authorization','token')
				.send({
					first_name: '',
					last_name: '',
					email: 'salah',
					phone: ''
				})
			
			logger.info(response.body)
			
			expect(response.status).toBe(400)
			expect(response.body.errors).toBeDefined()
		})
		
		it("should be able to update contact", async () => {
			const contact = await testService.getContact()
			const response = await request(app.getHttpServer())
				.put(`/api/contacts/${contact.id}`)
				.set('Authorization','token')
				.send({
					first_name: 'updatetest',
					last_name: 'updatetest',
					email: 'updatetest@example.com',
					phone: '8888'
				})
			
			logger.info(response.body)
			
			expect(response.status).toBe(200)
			expect(response.body.data.id).toBeDefined()
			expect(response.body.data.first_name).toBe('updatetest')
			expect(response.body.data.last_name).toBe('updatetest')
			expect(response.body.data.email).toBe('updatetest@example.com')
			expect(response.body.data.phone).toBe('8888')
		})
	})

	describe("DELETE /api/contacts/:contactId",() => {
		beforeEach(async() => {
			await testService.deleteContact()
			await testService.deleteUser()

			await testService.createUser()
			await testService.createContact()
		})

		it("should be rejected if contact is not found", async () => {
			const contact = await testService.getContact()
			const response = await request(app.getHttpServer())
				.delete(`/api/contacts/594277f9-058e-43e5-a2c3-f1558bee4de2`)
				.set('Authorization','token')
			
			logger.info(response.body)
			
			expect(response.status).toBe(404)
			expect(response.body.errors).toBeDefined()
		})
		
		it("should be able to delete contact", async () => {
			const contact = await testService.getContact()
			const response = await request(app.getHttpServer())
				.delete(`/api/contacts/${contact.id}`)
				.set('Authorization','token')

			logger.info(response.body)
			
			expect(response.status).toBe(200)
			expect(response.body.data).toBe(true)
		})
    })

	describe("GET /api/contacts/search",() => {
		beforeEach(async() => {
			await testService.deleteContact()
			await testService.deleteUser()

			await testService.createUser()
			await testService.createContact()
		})

		it("should be able to search contacts", async () => {
			const response = await request(app.getHttpServer())
				.get(`/api/contacts/search`)
				.set('Authorization','token')
			
			logger.info(response.body)
			
			expect(response.status).toBe(200)
			expect(response.body.data.length).toBe(1)
		})

		it("should be able to search contacts by name", async () => {
			const response = await request(app.getHttpServer())
				.get(`/api/contacts/search`)
				.query({
					name: 'es'
				})
				.set('Authorization','token')
			
			logger.info(response.body)
			
			expect(response.status).toBe(200)
			expect(response.body.data.length).toBe(1)
		})
    })
});
