import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Feature Modules
import { AuthModule } from './modules/auth/auth.modules';
import { UsersModule } from './modules/users/users.module';
import { StoresModule } from './modules/stores/stores.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { AdminModule } from './modules/admin/admin.module';

// Entities
import { User } from './modules/users/entities/user.entity';
import { Store } from './modules/stores/entities/store.entity';
import { Rating } from './modules/ratings/entities/rating.entity';

@Module({
  imports: [
    // 1. Load Environment Variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Database Connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Store, Rating],
        synchronize: true,
        dropSchema: false,
        logging: true,
      }),
    }),

    // 3. Feature Modules
    AuthModule,
    UsersModule,
    StoresModule,
    RatingsModule,
    AdminModule,
  ],
})
export class AppModule {}