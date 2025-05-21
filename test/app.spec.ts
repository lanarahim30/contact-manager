import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController (e2e)', () => {
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

  describe("POST /api/users",() => {

	beforeEach(async() => {
		await testService.deleteUser()
	})

	it("should be rejected if request is invalid", async () => {
		const response = await request(app.getHttpServer())
			.post('/api/users')
			.send({
				username: '',
				name: '',
				password: ''
			})
		
		logger.info(response.body)
		
		expect(response.status).toBe(400)
		expect(response.body.errors).toBeDefined()
	})
	
	it("should be able to register", async () => {
		const response = await request(app.getHttpServer())
			.post('/api/users')
			.send({
				username: 'test',
				name: 'test',
				password: 'test1234'
			})
		
		logger.info(response.body)
		
		expect(response.status).toBe(201)
		expect(response.body.data.username).toBeDefined()
		expect(response.body.data.name).toBe('test')
	})

	it("should be rejected if username already exists", async () => {
		await testService.createUser()

		const response = await request(app.getHttpServer())
			.post('/api/users')
			.send({
				username: 'test',
				name: 'test',
				password: 'test1234'
			})
		
		logger.info(response.body)
		
		expect(response.status).toBe(400)
		expect(response.body.errors).toBeDefined()
	})

  })

  describe("POST /api/users/login", () => {
	beforeEach(async () => {
		await testService.deleteUser()
		await testService.createUser()
	})

	it("should be rejected if request is invalid", async () => {
		const response = await request(app.getHttpServer())
			.post('/api/users/login')
			.send({
				username: '',
				password: ''
			})
		
		logger.info(response.body)
		
		expect(response.status).toBe(400)
		expect(response.body.errors).toBeDefined()
	})

	it("should be able to login", async () => {
		const response = await request(app.getHttpServer())
			.post('/api/users/login')
			.send({
				username: 'test',
				password: 'test1234'
			})
		
		logger.info(response.body)
		
		expect(response.status).toBe(200)
		expect(response.body.data.username).toBe('test')
		expect(response.body.data.token).toBeDefined()
		expect(response.body.data.name).toBe('test')
	})

  })

  describe("GET /api/users/profile", () => {
		beforeEach(async () => {
			await testService.deleteUser()
			await testService.createUser()
		})

		it("should be rejected if token is invalid", async () => {
			const response = await request(app.getHttpServer())
				.get('/api/users/profile')
				.set('Authorization','wrong')

			logger.info(response.body)
			
			expect(response.status).toBe(401)
			expect(response.body.errors).toBeDefined()
		})

		it("should be able to get user", async () => {
			const response = await request(app.getHttpServer())
				.get('/api/users/profile')
				.set('Authorization','token')
			
			logger.info(response.body)
			
			expect(response.status).toBe(200)
			expect(response.body.data.username).toBe('test')
			expect(response.body.data.name).toBe('test')
		})
  })

  describe("PATCH /api/users/profile", () => {
	beforeEach(async () => {
		await testService.deleteUser()
		await testService.createUser()
	})

	it("should be rejected if request is invalid", async () => {
		const response = await request(app.getHttpServer())
			.patch('/api/users/profile')
			.send({
				password: '',
				name: ''
			})
			.set('Authorization','token')

		logger.info(response.body)
		
		expect(response.status).toBe(400)
		expect(response.body.errors).toBeDefined()
	})

	it("should be able to update name", async () => {
		const response = await request(app.getHttpServer())
			.patch('/api/users/profile')
			.send({
				name: 'test updated'
			})
			.set('Authorization','token')
		
		logger.info(response.body)
		
		expect(response.status).toBe(200)
		expect(response.body.data.name).toBe('test updated')
		expect(response.body.data.username).toBe('test')
	})

	it("should be able to update password", async () => {
		let response = await request(app.getHttpServer())
			.patch('/api/users/profile')
			.send({
				password: 'passwordupdate'
			})
			.set('Authorization','token')
		
		logger.info(response.body)
		
		expect(response.status).toBe(200)
		expect(response.body.data.name).toBe('test')
		expect(response.body.data.username).toBe('test')

		response = await request(app.getHttpServer())
			.post('/api/users/login')
			.send({
				username:'test',
				password: 'passwordupdate'
			})
	
		expect(response.status).toBe(200)
		expect(response.body.data.token).toBeDefined()
	})
  })

  describe("DELETE /api/users/logout", () => {
	beforeEach(async () => {
		await testService.deleteUser()
		await testService.createUser()
	})

	it("should be rejected if token is invalid", async () => {
		const response = await request(app.getHttpServer())
			.delete('/api/users/logout')
			.set('Authorization','wrong')

		logger.info(response.body)
		
		expect(response.status).toBe(401)
		expect(response.body.errors).toBeDefined()
	})

	it("should be able to logout", async () => {
		const response = await request(app.getHttpServer())
			.delete('/api/users/logout')
			.set('Authorization','token')
		
		logger.info(response.body)
		
		expect(response.status).toBe(200)
		expect(response.body.data).toBe(true)
	})
  })
});
