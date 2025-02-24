import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { name: createUserDto.name.trim() },
      });
      console.log('existing user', existingUser);

      if (createUserDto.name.trim() == '') {
        throw new BadRequestException('The user name must not be null');
      }
      if (existingUser) {
        throw new BadRequestException(
          `User with name ${createUserDto.name.trim()} is already exists.`,
        );
      }

      const newUser = { ...createUserDto, name: createUserDto.name.trim() };
      await this.userRepository.save(newUser);

      return {
        status: HttpStatus.CREATED,
        message: 'User created successfully',
        data: newUser,
      };
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to create user.');
    }
  }
}
