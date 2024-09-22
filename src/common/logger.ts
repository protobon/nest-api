import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

const logger = createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`),
  ),
  transports: [new transports.Console()],
});

export default logger;