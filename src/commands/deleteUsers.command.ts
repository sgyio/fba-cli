import { injectable } from 'inversify';
import { container, TYPES } from '../ioc';

import { IFirebaseAdminService } from '../services';
import { ICommand } from './command.interface';

@injectable()
export class DeleteUsersCommand implements ICommand {

  public readonly command = ['du', 'delete-users'];
  public readonly describe = 'Delete Users';
  public builder = {};

  public handler(args: any): void {
    const firebaseAdminService = container.get<IFirebaseAdminService>(TYPES.FirebaseAdminService);
    firebaseAdminService.deleteUsers();
  }
}
