import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelpDoc, HelpDocSchema } from './schemas/help-doc.schema';
import { HelpFaq, HelpFaqSchema } from './schemas/help-faq.schema';
import { DocsService } from './docs/docs.service';
import { DocsController } from './docs/docs.controller';
import { FaqsService } from './faqs/faqs.service';
import { FaqsController } from './faqs/faqs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HelpDoc.name, schema: HelpDocSchema },
      { name: HelpFaq.name, schema: HelpFaqSchema },
    ]),
  ],
  controllers: [DocsController, FaqsController],
  providers: [DocsService, FaqsService],
})
export class HelpModule {}
