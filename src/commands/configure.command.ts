import { injectable } from 'inversify';
import { container, TYPES } from '../ioc';

import { IFirebaseAdminService } from '../services';
import { IFirebaseConfig } from '../shared';
import { ICommand } from './command.interface';

@injectable()
export class ConfigureCommand implements ICommand {

  public readonly command = ['c <serviceAccountKeyPath> <databaseUrl>', 'configure'];
  public readonly describe = 'Configure Firebase';
  public builder = {};

  public handler(args: IFirebaseConfig): void {
    const firebaseAdminService = container.get<IFirebaseAdminService>(TYPES.FirebaseAdminService);
    firebaseAdminService.configure(args.serviceAccountKeyPath, args.databaseUrl);
  }
}
