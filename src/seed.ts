import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './modules/users/entities/user.entity';
import { Store } from './modules/stores/entities/store.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'your_password',
  database: 'store_rating_db',
  // FIX: Using strings helps TypeORM resolve circular dependencies in scripts
  entities: ['src/**/*.entity.ts'], 
  synchronize: true, 
});

async function seed() {
  try {
    // CRITICAL: You must await the connection before doing anything else
    await AppDataSource.initialize(); 
    console.log('✅ Connection established. Starting seed...');

    const userRepository = AppDataSource.getRepository(User);
    const storeRepository = AppDataSource.getRepository(Store);

    // Create Admin
    const adminEmail = 'admin@storerating.com';
    const adminExists = await userRepository.findOne({ where: { email: adminEmail } });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await userRepository.save({
        name: 'System Administrator Master', 
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      console.log('✅ Admin user created.');
    }

    // Create Store
    const storeName = 'The Great Indian Kitchen Hyderabad';
    const storeExists = await storeRepository.findOne({ where: { name: storeName } });
    if (!storeExists) {
      await storeRepository.save({
        name: storeName,
        address: 'Madhapur Main Road',
        city: 'Hyderabad',
        state: 'Telangana'
      });
      console.log('✅ Sample store added.');
    }

  } catch (error) {
    console.error('❌ Seeding error:', error instanceof Error ? error.message : error);
  } finally {
    await AppDataSource.destroy();
    console.log('👋 Connection closed.');
    process.exit(0);
  }
}

seed();