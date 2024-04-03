import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Course } from 'src/course/entities/course.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryResponse } from 'src/cloudinary/cloudinary-response';

@Injectable()
export class UserService {
  constructor(
    private readonly cloudinarySrv: CloudinaryService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    file: Express.Multer.File,
  ): Promise<User | string> {
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      return 'User already exists';
    }
    const user = new User();
    Object.assign(user, createUserDto);
    user.avatar = (await this.cloudinarySrv.uploadFile(file)).secure_url;
    await this.userRepo.save(user);
    delete user.password;
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find(); // find all
  }

  async findOne(id: number): Promise<User> {
    return this.userRepo.findOne({ where: { id }, relations: ['courses'] });
  }

  async update(req: any, updateUserDto: UpdateUserDto): Promise<User> {
    const { id } = req.user;
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new HttpException('Not allowed', HttpStatus.METHOD_NOT_ALLOWED);
    }
    Object.assign(user, updateUserDto); //  target , source
    return await this.userRepo.save(user);
  }

  async remove(req: any) {
    const { id } = req.user;
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new HttpException('Not allowed', HttpStatus.METHOD_NOT_ALLOWED);
    }
    return this.userRepo.delete(id);
  }
}
