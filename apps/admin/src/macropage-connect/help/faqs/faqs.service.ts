import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HelpFaq, HelpFaqDocument } from '../schemas/help-faq.schema';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqsService {
  constructor(
    @InjectModel(HelpFaq.name)
    private readonly faqModel: Model<HelpFaqDocument>,
  ) {}

  create(dto: CreateFaqDto) {
    return this.faqModel.create(dto);
  }

  findAll(category?: string) {
    const filter = category ? { category } : {};
    return this.faqModel.find(filter).sort({ category: 1, order: 1 }).exec();
  }

  async findOne(id: string) {
    const faq = await this.faqModel.findById(id).exec();
    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }
    return faq;
  }

  async update(id: string, dto: UpdateFaqDto) {
    const faq = await this.faqModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }
    return faq;
  }

  async remove(id: string) {
    const faq = await this.faqModel.findByIdAndDelete(id).exec();
    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }
    return faq;
  }
}
