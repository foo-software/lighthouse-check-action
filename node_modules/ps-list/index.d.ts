export interface Options {
	/**
	Include other users' processes as well as your own.

	On Windows this has no effect and will always be the users' own processes.

	@default true
	*/
	readonly all?: boolean;
}

export interface ProcessDescriptor {
	readonly pid: number;
	readonly name: string;
	readonly ppid: number;

	/**
	Not supported on Windows.
	*/
	readonly cmd?: string;

	/**
	Not supported on Windows.
	*/
	readonly cpu?: number;

	/**
	Not supported on Windows.
	*/
	readonly memory?: number;

	/**
	Not supported on Windows.
	*/
	readonly uid?: number;
}

/**
Get running processes.

@returns A list of running processes.

@example
```
import psList from 'ps-list';

console.log(await psList());
//=> [{pid: 3213, name: 'node', cmd: 'node test.js', ppid: 1, uid: 501, cpu: 0.1, memory: 1.5}, …]
```
*/
export default function psList(options?: Options): Promise<ProcessDescriptor[]>;
