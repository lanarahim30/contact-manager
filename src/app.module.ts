import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './common/error.filter';
import { ContactModule } from './contact/contact.module';
@Module({
  imports: [CommonModule, UserModule, ContactModule],
  controllers: [],
  providers: [
	{
		provide: APP_FILTER,
		useClass: ErrorFilter
	}
  ],
})
export class AppModule {}
