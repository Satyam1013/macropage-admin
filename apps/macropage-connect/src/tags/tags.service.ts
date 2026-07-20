import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AssignTagsDto } from './dto/assign-tags.dto';
import { Customer, CustomerDocument } from '../customers/schemas/customer.schema';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  create(dto: CreateTagDto) {
    return this.tagModel.create(dto);
  }

  findAll() {
    return this.tagModel.find().exec();
  }

  async findOne(id: string) {
    const tag = await this.tagModel.findById(id).exec();
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  async update(id: string, dto: UpdateTagDto) {
    const tag = await this.tagModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  async remove(id: string) {
    const tag = await this.tagModel.findByIdAndDelete(id).exec();
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  async assignToCustomer(dto: AssignTagsDto) {
    const customer = await this.customerModel
      .findByIdAndUpdate(
        dto.customerId,
        { tagIds: dto.tagIds },
        { new: true },
      )
      .exec();
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }
}
