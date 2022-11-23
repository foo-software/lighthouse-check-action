import process from 'node:process';
import fs, {promises as fsPromises} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import parseJson from 'parse-json';
import normalizePackageData from 'normalize-package-data';

const toPath = urlOrPath => urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;

export async function readPackage({cwd, normalize = true} = {}) {
	cwd = toPath(cwd) || process.cwd();
	const filePath = path.resolve(cwd, 'package.json');
	const json = parseJson(await fsPromises.readFile(filePath, 'utf8'));

	if (normalize) {
		normalizePackageData(json);
	}

	return json;
}

export function readPackageSync({cwd, normalize = true} = {}) {
	cwd = toPath(cwd) || process.cwd();
	const filePath = path.resolve(cwd, 'package.json');
	const json = parseJson(fs.readFileSync(filePath, 'utf8'));

	if (normalize) {
		normalizePackageData(json);
	}

	return json;
}
