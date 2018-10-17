export interface IFirebaseAdminService {
  configure(serviceAccountKeyPath: string, databaseUrl: string): void;
  deleteUsers(): void;
}
