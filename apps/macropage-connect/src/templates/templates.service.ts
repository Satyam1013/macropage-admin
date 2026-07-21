import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NotificationTemplate,
  NotificationTemplateDocument,
} from './schemas/template.schema';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(NotificationTemplate.name)
    private readonly templateModel: Model<NotificationTemplateDocument>,
  ) {}

  create(dto: CreateTemplateDto) {
    return this.templateModel.create(dto);
  }

  findAll() {
    return this.templateModel.find().exec();
  }

  async findOne(id: string) {
    const template = await this.templateModel.findById(id).exec();
    if (!template) {
      throw new NotFoundException('Template not found');
    }
    return template;
  }

  async update(id: string, dto: UpdateTemplateDto) {
    const template = await this.templateModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!template) {
      throw new NotFoundException('Template not found');
    }
    return template;
  }

  async remove(id: string) {
    const template = await this.templateModel.findByIdAndDelete(id).exec();
    if (!template) {
      throw new NotFoundException('Template not found');
    }
    return template;
  }

  async render(
    templateId: string,
    variables: Record<string, string>,
  ): Promise<string> {
    const template = await this.findOne(templateId);
    return template.content.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) =>
      Object.prototype.hasOwnProperty.call(variables, key)
        ? variables[key]
        : match,
    );
  }
}
