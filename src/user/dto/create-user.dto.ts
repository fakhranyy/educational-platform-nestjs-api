import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() //* should be have value
  @IsString() //* must be string
  @Length(3, 20) //* it cann't be less than 3 characters and not more than 20 characters
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  fullName: string;
<<<<<<< HEAD

  // file: Express.Multer.File;
=======
>>>>>>> 65018de (init)
}
