import { logLevels } from './logger.constants';
export interface LoggerOptions {
    useIcons: boolean;
}
export declare class Logger {
    private options?;
    constructor(options?: LoggerOptions);
    fail(message: string): void;
    skip(message: string): void;
    success(message: string): void;
    data(message: string): void;
    start(message: string): void;
    title(message: string): void;
    protected parseMessage(level: logLevels, message: string): string;
    protected logColoring({ level, message }: {
        level: logLevels;
        message: string;
    }): string;
}
