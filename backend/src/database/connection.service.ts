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
    console.log(
      '📦 Starting MongoDB connection process...',
      this.isConnected,
      this.connectionString,
    );
    if (this.isConnected) {
      return;
    }

    console.log(
      '📦 Connecting to MongoDB with connection string:',
      this.connectionString,
    );

    await mongoose.connect(this.connectionString);
    this.isConnected = true;
    console.log('📦 Connected to MongoDB with Mongoose');
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.isConnected = false;
  }
}
