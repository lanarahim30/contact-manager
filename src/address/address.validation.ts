import { ZodType, z } from "zod";

export class AddressValidation {
	static readonly CREATE: ZodType = z.object({
		contact_id: z.string().uuid(),
		street: z.string().min(1).max(255).optional(),
		city: z.string().min(1).max(100).optional(),
		province: z.string().min(1).max(100).optional(),
		country: z.string().min(1).max(100),
		postal_code: z.string().min(1).max(10),
	})
}