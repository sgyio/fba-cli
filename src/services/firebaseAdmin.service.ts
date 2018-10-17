import * as Configstore from 'configstore';
import * as firebaseAdmin from 'firebase-admin';

import { inject, injectable } from 'inversify';
import { TYPES } from '../ioc/types';

import { IConfigstoreConfig, IFirebaseConfig } from '../shared';
import { IFirebaseAdminService } from './firebaseAdmin.interface';

@injectable()
export class FirebaseAdminService implements IFirebaseAdminService {

  private conf: Configstore;

  constructor(
    @inject(TYPES.ConfigstoreConfig) configStoreConfig: IConfigstoreConfig,
  ) {
    this.conf = new Configstore(configStoreConfig.name);
  }

  public async configure(serviceAccountKeyPath: string, databaseUrl: string): Promise<void> {
    try {
      require(serviceAccountKeyPath);
      this.conf.set('firebase', {
        serviceAccountKeyPath,
        databaseUrl,
      });
    } catch (err) {
      this.handleError(err, serviceAccountKeyPath);
    }
  }

  public async deleteUsers(): Promise<void> {
    const config: IFirebaseConfig = this.conf.get('firebase');

    if (!(config && config.serviceAccountKeyPath && config.databaseUrl)) {
      process.exitCode = 1;
      throw new Error(`No Firebase configuration found.  Run 'fba configure <serviceAccountKeyPath> <databaseUrl>'.`);
    }

    const serviceAccount = require(config.serviceAccountKeyPath);
    const app = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      databaseURL: config.databaseUrl,
    });

    let userList = await this.listUsers();
    while (userList.users.length) {
      await Promise.all(userList.users.map(this.deleteUser));
      userList = await this.listUsers();
    }

    app.delete();
  }

  private async listUsers(limit = 50): Promise<firebaseAdmin.auth.ListUsersResult> {
    return await firebaseAdmin.auth().listUsers(limit);
  }

  private async deleteUser(user: firebaseAdmin.auth.UserRecord): Promise<void> {
    await firebaseAdmin.auth().deleteUser(user.uid);
    console.log(`Successfully deleted user (uid: ${user.uid})`);
  }

  private handleError(err: any, serviceAccountKeyPath: string): void {
    process.exitCode = 1;
    if (err.message.includes('Cannot find module')) {
      console.log(`Problem reading service account file.  Please check if it exists at '${serviceAccountKeyPath}'.`);
    } else {
      console.log(err.message);
    }
  }
}
