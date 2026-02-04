import { Injectable } from '@nestjs/common';
import { User as IUser } from './interfaces/user.interface';
import { IRepository } from '@/types/IRepository';
import User from '../models/User.model';

@Injectable()
export class AuthRepository implements IRepository<IUser> {
  async getById(id: string): Promise<IUser | null> {
    return await User.findById(id).exec();
  }

  async getAll(): Promise<IUser[]> {
    return await User.find().exec();
  }

  async getByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).exec();
  }

  async create(item: IUser): Promise<IUser | null> {
    return await User.create(item)
      .then((user) => user)
      .catch(() => null);
  }

  async update(id: string, item: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, item).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
