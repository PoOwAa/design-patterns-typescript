import LoggerStrategy from '../../interface/logger.strategy.interface';

export default class ConsoleErrorStrategy implements LoggerStrategy {
  info(message: string): void {
    console.error(message);
  }

  warning(message: string): void {
    console.error(message);
  }

  error(message: string): void {
    console.error(message);
  }

  debug(message: string): void {
    console.error(message);
  }
}
