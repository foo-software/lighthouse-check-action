/**
 * @fileoverview Shared interfaces for functions that check CSP policies.
 */

import {Csp} from '../csp';
import {Finding} from '../finding';

/**
 * A function that checks a given Csp for problems and returns an unordered
 * list of Findings.
 */
export type CheckerFunction = (csp: Csp) => Finding[];
