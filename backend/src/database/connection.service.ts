import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class ConnectionService {
  connection: mongoose.Connection;
  private isConnected: boolean = false;
  private connectionString: string =
    process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/myapp';
  // 'mongodb://admin:admin@eg-db:27017/myapp?authSource=admin';

  constructor() {}

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    await mongoose.connect(this.connectionString);
    this.connection = mongoose.connection;
    this.isConnected = true;
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.isConnected = false;
  }
}
