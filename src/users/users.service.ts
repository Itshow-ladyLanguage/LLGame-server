import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { name: createUserDto.name.trim() },
      });
      if (existingUser) {
        throw new BadRequestException(
          `User with name ${createUserDto.name.trim()} is already exists.`,
        );
      }
      const newUser = { ...createUserDto, name: createUserDto.name.trim() };
      if (newUser.name.trim() == '') {
        throw new BadRequestException('The user name must not be null');
      }

      return await this.userRepository.save(newUser);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    try {
      let user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.update(id, dto);

      return await this.userRepository.findOneBy({ id });
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException("Failed to update user's score.");
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        order: { score: 'DESC' },
      });
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to retrieve users.');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to retrieve user.');
    }
  }
}
