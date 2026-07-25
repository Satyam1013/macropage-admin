import 'dotenv/config';
import mongoose from 'mongoose';
import {
  IntegrationPlatform,
  IntegrationPlatformSchema,
} from '../apps/admin/src/macropage-connect/integration-platforms/schemas/integration-platform.schema';

const SEED_DATA: { category: string; name: string; sortOrder: number }[] = [
  { category: 'E-commerce', name: 'Shopify', sortOrder: 1 },
  { category: 'E-commerce', name: 'WooCommerce', sortOrder: 2 },
  { category: 'E-commerce', name: 'Razorpay', sortOrder: 3 },
  { category: 'E-commerce', name: 'PayU', sortOrder: 4 },
  { category: 'CRM', name: 'Zoho CRM', sortOrder: 1 },
  { category: 'CRM', name: 'Leadsquared', sortOrder: 2 },
  { category: 'Automation', name: 'Zapier', sortOrder: 1 },
  { category: 'Automation', name: 'Make.com (Integromat)', sortOrder: 2 },
];

async function seed() {
  const mongoUri = process.env.MACROPAGE_CONNECT_MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MACROPAGE_CONNECT_MONGODB_URI must be set (see .env)');
  }

  await mongoose.connect(mongoUri);
  const IntegrationPlatformModel = mongoose.model(
    IntegrationPlatform.name,
    IntegrationPlatformSchema,
  );

  let created = 0;
  let existing = 0;

  for (const row of SEED_DATA) {
    const result = await IntegrationPlatformModel.updateOne(
      { category: row.category, name: row.name },
      { $setOnInsert: { ...row, status: 'Active' } },
      { upsert: true },
    );
    if (result.upsertedCount > 0) created += 1;
    else existing += 1;
  }

  console.log(`Seed complete: ${created} created, ${existing} already existed.`);
  await mongoose.disconnect();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
