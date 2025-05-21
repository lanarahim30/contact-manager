export class UserRegisterRequest {
	username: string
	password: string
	name: string

}
export class LoginRequest {
	username: string
	password: string
}

export class UserResponse {
	username: string
	name: string
	token? : string
}