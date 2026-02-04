import { Module } from '@nestjs/common';

import { DatabaseProvider } from './database.provider';
import { ConnectionService } from './connection.service';

@Module({
  imports: [],
  providers: [ConnectionService, ...DatabaseProvider],
  exports: [...DatabaseProvider],
})
export class DatabaseModule {}
