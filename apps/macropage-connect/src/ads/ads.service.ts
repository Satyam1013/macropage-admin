import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model } from 'mongoose';
import { Ad, AdDocument } from './schemas/ad.schema';
import {
  Customer,
  CustomerDocument,
} from '../customers/schemas/customer.schema';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';

@Injectable()
export class AdsService {
  constructor(
    @InjectModel(Ad.name) private readonly adModel: Model<AdDocument>,
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  create(dto: CreateAdDto) {
    return this.adModel.create(dto);
  }

  findAll() {
    return this.adModel.find().sort({ priority: -1 }).exec();
  }

  async findOne(id: string) {
    const ad = await this.adModel.findById(id).exec();
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }
    return ad;
  }

  async update(id: string, dto: UpdateAdDto) {
    const ad = await this.adModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }
    return ad;
  }

  async remove(id: string) {
    const ad = await this.adModel.findByIdAndDelete(id).exec();
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }
    return ad;
  }

  async findActive(customerId?: string) {
    const now = new Date();
    const baseFilter: QueryFilter<AdDocument> = {
      isActive: true,
      $and: [
        { $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }] },
      ],
    };

    if (!customerId) {
      return this.adModel.find(baseFilter).sort({ priority: -1 }).exec();
    }

    const customer = await this.customerModel.findById(customerId).exec();
    const tagIds = customer?.tagIds ?? [];

    const filter: QueryFilter<AdDocument> = {
      ...baseFilter,
      $or: [
        { targetType: 'all' },
        { targetType: 'customer', targetIds: customerId },
        { targetType: 'tag', targetIds: { $in: tagIds } },
      ],
    };

    return this.adModel.find(filter).sort({ priority: -1 }).exec();
  }
}
