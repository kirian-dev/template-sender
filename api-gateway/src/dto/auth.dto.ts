export class CreateUserDto {
  email: string;
  password: string;
}

export class LoginUserDto {
  email: string;
  passwords: string
}

export class UserResponseDto {
  token: string;
}
