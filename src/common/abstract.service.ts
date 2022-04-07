import { Injectable } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export abstract class AbstractService<T> {
  protected constructor(protected readonly model: ModelType<T>) {}

  async all(limit = 16) {
    return this.model.find().limit(limit).exec();
  }

  async paginate(page = 1, limit = 16) {
    const data = await this.model
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
    const total = await this.model.countDocuments();

    return {
      data,
      meta: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        lastPage: Math.ceil(total / limit)
      }
    };
  }

  async create(body: any): Promise<DocumentType<T>> {
    return this.model.create(body);
  }

  async findById(id: string): Promise<DocumentType<T> | null> {
    return this.model.findById(id).exec();
  }

  async delete(id: string): Promise<DocumentType<T> | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async update(id: string, dto: any): Promise<any> {
    return this.model.updateOne({ id }, { $set: dto });
  }
}
