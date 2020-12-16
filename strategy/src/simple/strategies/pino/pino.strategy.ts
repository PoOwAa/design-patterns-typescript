import LoggerStrategy from '../../interface/logger.strategy.interface';
import Pino from 'pino';

export default class PinoStrategy implements LoggerStrategy {
  private readonly logger: Pino.Logger;
  private readonly errorLogger: Pino.Logger;

  constructor(name: string) {
    this.logger = Pino({
      name,
      level: 'info',
      prettyPrint: {
        colorize: true,
        translateTime: true,
      },
    });

    this.errorLogger = Pino(
      {
        name,
        level: 'warn',
        prettyPrint: {
          colorize: true,
          translateTime: true,
        },
      },
      process.stderr
    );
  }

  info(message: string): void {
    this.logger.info(message);
  }

  debug(message: string): void {
    this.logger.debug(message);
  }

  warning(message: string): void {
    this.errorLogger.warn(message);
  }

  error(message: string): void {
    this.errorLogger.error(message);
  }
}
