import LoggerStrategy from './interface/logger.strategy.interface';

export default class Logger implements LoggerStrategy {
  private strategy: LoggerStrategy;

  constructor(strategy: LoggerStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: LoggerStrategy): void {
    this.strategy = strategy;
  }

  info(message: string): void {
    this.strategy.info(message);
  }

  warning(message: string): void {
    this.strategy.warning(message);
  }

  error(message: string): void {
    this.strategy.error(message);
  }

  debug(message: string): void {
    this.strategy.debug(message);
  }
}
