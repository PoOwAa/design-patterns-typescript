import ConsoleStrategy from './simple/strategies/console/console.strategy';
import ConsoleErrorStrategy from './simple/strategies/consoleError/consoleError.strategy';
import PinoStrategy from './simple/strategies/pino/pino.strategy';
import Logger from './simple/logger';

const consoleLogger = new ConsoleStrategy();
const errorLogger = new ConsoleErrorStrategy();
const pinoLogger = new PinoStrategy('simple');

console.log('Creating logger with [ConsoleStrategy]');
const logger = new Logger(consoleLogger);
logger.info('consoleLogger info');
logger.debug('consoleLogger debug');
logger.warning('consoleLogger warning');
logger.error('consoleLogger error');

console.log('Changing strategy to [ConsoleErrorStrategy]');
logger.setStrategy(errorLogger);
logger.info('consoleErrorLogger info');
logger.debug('consoleErrorLogger debug');
logger.warning('consoleErrorLogger warning');
logger.error('consoleErrorLogger error');

console.log('Changing strategy to [PinoStrategy]');
logger.setStrategy(pinoLogger);
logger.info('pinoLogger info');
logger.debug('pinoLogger debug');
logger.warning('pinoLogger warning');
logger.error('pinoLogger error');
