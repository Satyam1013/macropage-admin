import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import {
  AdminUser,
  AdminUserSchema,
} from '../apps/mrfuels-transact/src/auth/schemas/admin-user.schema';

async function seed() {
  const mongoUri = process.env.MRFUELS_TRANSACT_MONGODB_URI;
  const email = process.env.MRFUELS_TRANSACT_ADMIN_EMAIL;
  const password = process.env.MRFUELS_TRANSACT_ADMIN_PASSWORD;
  const name = process.env.MRFUELS_TRANSACT_ADMIN_NAME ?? 'Super Admin';

  if (!mongoUri || !email || !password) {
    throw new Error(
      'MRFUELS_TRANSACT_MONGODB_URI, MRFUELS_TRANSACT_ADMIN_EMAIL and MRFUELS_TRANSACT_ADMIN_PASSWORD must be set (see .env)',
    );
  }

  await mongoose.connect(mongoUri);
  const AdminUserModel = mongoose.model(AdminUser.name, AdminUserSchema);

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await AdminUserModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: 'super-admin',
      isActive: true,
    },
    { upsert: true, returnDocument: 'after' },
  );

  console.log(`Admin user ready: ${admin.email} (role: ${admin.role})`);
  await mongoose.disconnect();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
