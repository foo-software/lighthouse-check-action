declare module 'robots-parser';

interface Robot {
	isAllowed(url: string, ua?: string): boolean | undefined;
	isDisallowed(url: string, ua?: string): boolean | undefined;
	getMatchingLineNumber(url: string, ua?: string): number;
	getCrawlDelay(ua?: string): number | undefined;
	getSitemaps(): string[];
	getPreferredHost(): string | null;
}

export default function robotsParser(url: string, robotstxt: string): Robot;
