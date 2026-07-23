import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter, TransformInterceptor } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { MacropageConnectModule } from './macropage-connect/macropage-connect.module';
import { MrFuelsModule } from './mr-fuels/mr-fuels.module';
import { MacropagePortalModule } from './macropage-portal/macropage-portal.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Default connection — macropage-connect's database. Also home to this
    // admin app's own `adminusers` collection (shared login for both products).
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MACROPAGE_CONNECT_MONGODB_URI'),
      }),
    }),
    // Named connection — mr-fuels' database.
    MongooseModule.forRootAsync({
      connectionName: 'mrFuels',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MRFUELS_TRANSACT_MONGODB_URI'),
      }),
    }),
    AuthModule,
    MacropageConnectModule,
    MrFuelsModule,
    MacropagePortalModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
