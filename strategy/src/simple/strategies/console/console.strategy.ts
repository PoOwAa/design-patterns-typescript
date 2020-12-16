import LoggerStrategy from '../../interface/logger.strategy.interface';

export default class ConsoleStrategy implements LoggerStrategy {
  info(message: string): void {
    console.log(message);
  }

  warning(message: string): void {
    console.warn(message);
  }

  error(message: string): void {
    console.error(message);
  }

  debug(message: string): void {
    console.debug(message);
  }
}
