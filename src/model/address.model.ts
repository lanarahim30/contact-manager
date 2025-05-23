export class AddressResponse {
	id: string
	street?: string
	city?: string
	province?: string
	country: string
	postal_code: string
}
export class CreateAddressRequest {
	street?: string
	city?: string
	province?: string
	country: string
	postal_code: string
	contact_id: string
}