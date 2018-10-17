import { Container } from 'inversify';
import { TYPES } from './types';

import { ConfigureCommand, DeleteUsersCommand } from '../commands';
import { ICommand } from '../commands/command.interface';
import { FirebaseAdminService, IFirebaseAdminService } from '../services';
import { IConfigstoreConfig } from '../shared';

export const container = new Container({ autoBindInjectable: true });

// Commands

container
  .bind<ICommand>(TYPES.Command)
  .to(DeleteUsersCommand)
  .whenTargetNamed('deleteUsers');

container
  .bind<ICommand>(TYPES.Command)
  .to(ConfigureCommand)
  .whenTargetNamed('configure');

// Services

container.bind<IFirebaseAdminService>(TYPES.FirebaseAdminService).to(FirebaseAdminService);

// Config

container
  .bind<IConfigstoreConfig>(TYPES.ConfigstoreConfig)
  .toConstantValue({ name: 'fba' });
