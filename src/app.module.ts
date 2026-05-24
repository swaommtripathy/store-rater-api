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
      useFactory: (configService: ConfigService): any => {
        const host = configService.get<string>('DB_HOST');
        const forceSqlite = configService.get<string>('FORCE_SQLITE') === 'true';

        // If DB_HOST is provided and not explicitly forcing sqlite, assume Postgres in env and use it.
        if (host && !forceSqlite) {
          return {
            type: 'postgres' as const,
            host,
            port: Number(configService.get<number>('DB_PORT') || 5432),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_DATABASE'),
            entities: [User, Store, Rating],
            synchronize: true,
            dropSchema: false,
            logging: true,
          };
        }

        // Fallback to a local SQLite DB for faster local development when Postgres isn't configured.
        return {
          type: 'sqlite' as const,
          database: configService.get<string>('SQLITE_DB_PATH') || 'data/sqlite.db',
          entities: [User, Store, Rating],
          synchronize: true,
          logging: false,
        };
      },
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