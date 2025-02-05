import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserCreateDto } from './dto/user.create.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private model: Model<User>,
  ) {}

  async upsertUser(userCreateDto: UserCreateDto) {
    const user = await this.model.findOne({ email: userCreateDto.email });
    if (user) {
      return user;
    }
    return this.model.create(userCreateDto);
  }

  async getUserById(id: string) {
    return await this.model.findById(id);
  }
  async getUserByEmail(email: string) {
    return await this.model.findOne({ email });
  }
}
