import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('AddressController (e2e)', () => {
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

  describe("POST /api/contacts/:contactId",() => {
	beforeEach(async() => {
		await testService.deleteAddress()
		await testService.deleteContact()
		await testService.deleteUser()

		await testService.createUser()
		await testService.createContact()
	})

	it("should be rejected if request is invalid", async () => {
		const contact = await testService.getContact()
		const response = await request(app.getHttpServer())
			.post(`/api/contacts/${contact.id}/addresses`)
			.set('Authorization','token')
			.send({
				street: '',
				province: '',
				city: '',
				country: '',
				postal_code: ''
			})
		
		logger.info(response.body)
		
		expect(response.status).toBe(400)
		expect(response.body.errors).toBeDefined()
	})

	it("should be able to create address", async () => {
		const contact = await testService.getContact()
		const response = await request(app.getHttpServer())
			.post(`/api/contacts/${contact.id}/addresses`)
			.set('Authorization','token')
			.send({
				street: 'kawe',
				province: 'bali',
				city: 'denpasar',
				country: 'ina',
				postal_code: '1111'
			})
		
		logger.info(response.body)
		
		expect(response.status).toBe(201)
		expect(response.body.data.street).toBe('kawe')
		expect(response.body.data.province).toBe('bali')
		expect(response.body.data.city).toBe('denpasar')
		expect(response.body.data.country).toBe('ina')
		expect(response.body.data.postal_code).toBe('1111')
	})
})
});
