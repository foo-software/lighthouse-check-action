'use strict';
const fs = require('fs');

let isDocker;

function hasDockerEnv() {
	try {
		fs.statSync('/.dockerenv');
		return true;
	} catch (_) {
		return false;
	}
}

function hasDockerCGroup() {
	try {
		const cGroup = fs.readFileSync('/proc/self/cgroup', 'utf8');

		return cGroup.includes('docker') ||
			cGroup.split('\n').some(line => line.length > 0 && !line.endsWith('/') && !line.endsWith('init.scope'));
	} catch (_) {
		return false;
	}
}

module.exports = () => {
	if (isDocker === undefined) {
		isDocker = hasDockerEnv() || hasDockerCGroup();
	}

	return isDocker;
};
