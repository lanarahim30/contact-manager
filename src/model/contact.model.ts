export class CreateContactRequest {
	first_name: string
	last_name?: string
	email?: string
	phone?: string
}

export class ContactResponse {
	id: string
	first_name: string
	last_name?: string
	email?: string
	phone?: string
}

export class UpdateContactRequest {
	id: string
	first_name: string
	last_name?: string
	email?: string
	phone?: string
}

export class SearchContactRequest {
	name?: string
	email?: string
	phone?: string
	page: number
	size: number
}