export default interface LoggerStrategy {
  info(message: string): void;
  debug(message: string): void;
  warning(message: string): void;
  error(message: string): void;
}
