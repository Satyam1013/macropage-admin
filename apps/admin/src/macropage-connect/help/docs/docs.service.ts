import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HelpDoc, HelpDocDocument } from '../schemas/help-doc.schema';
import { CreateDocDto } from './dto/create-doc.dto';
import { UpdateDocDto } from './dto/update-doc.dto';

@Injectable()
export class DocsService {
  constructor(
    @InjectModel(HelpDoc.name)
    private readonly docModel: Model<HelpDocDocument>,
  ) {}

  async create(dto: CreateDocDto) {
    const exists = await this.docModel.findOne({ slug: dto.slug }).exec();
    if (exists) {
      throw new ConflictException('A doc with this slug already exists');
    }
    return this.docModel.create(dto);
  }

  findAll(category?: string) {
    const filter = category ? { category } : {};
    return this.docModel.find(filter).sort({ category: 1, order: 1 }).exec();
  }

  async findOne(id: string) {
    const doc = await this.docModel.findById(id).exec();
    if (!doc) {
      throw new NotFoundException('Doc not found');
    }
    return doc;
  }

  async update(id: string, dto: UpdateDocDto) {
    const doc = await this.docModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!doc) {
      throw new NotFoundException('Doc not found');
    }
    return doc;
  }

  async remove(id: string) {
    const doc = await this.docModel.findByIdAndDelete(id).exec();
    if (!doc) {
      throw new NotFoundException('Doc not found');
    }
    return doc;
  }
}
