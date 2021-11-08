import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// import { CreateCatDto } from './dto/create-cat.dto';
import { Cat, CatDocument } from './schemas/cat.schema';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
  ) {}

  // async create(createCatDto: CreateCatDto): Promise<Cat> {
  //   const createdCat = await this.catModel.create(createCatDto);
  //   return createdCat;
  // }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }
}