export interface ICommand {
  command: string | string[];
  describe: string;
  builder: any;
  handler(args: any): void;
}
