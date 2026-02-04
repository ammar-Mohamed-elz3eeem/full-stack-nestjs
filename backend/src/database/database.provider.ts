import { ConnectionService } from './connection.service';

export const DatabaseProvider = [
  {
    provide: 'MONGODB_CONNECTION',
    useFactory: async (connectionService: ConnectionService) => {
      await connectionService.connect();
      return connectionService.connection;
    },
    inject: [ConnectionService],
  },
];
