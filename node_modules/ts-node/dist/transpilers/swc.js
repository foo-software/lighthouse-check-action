"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.targetMapping = exports.create = void 0;
function create(createOptions) {
    const { swc, service: { config }, } = createOptions;
    // Load swc compiler
    let swcInstance;
    if (typeof swc === 'string') {
        swcInstance = require(swc);
    }
    else if (swc == null) {
        let swcResolved;
        try {
            swcResolved = require.resolve('@swc/core');
        }
        catch (e) {
            try {
                swcResolved = require.resolve('@swc/wasm');
            }
            catch (e) {
                throw new Error('swc compiler requires either @swc/core or @swc/wasm to be installed as dependencies');
            }
        }
        swcInstance = require(swcResolved);
    }
    else {
        swcInstance = swc;
    }
    // Prepare SWC options derived from typescript compiler options
    const compilerOptions = config.options;
    const { esModuleInterop, sourceMap, importHelpers, experimentalDecorators, emitDecoratorMetadata, target, module, jsxFactory, jsxFragmentFactory, } = compilerOptions;
    const nonTsxOptions = createSwcOptions(false);
    const tsxOptions = createSwcOptions(true);
    function createSwcOptions(isTsx) {
        var _a;
        let swcTarget = (_a = exports.targetMapping.get(target)) !== null && _a !== void 0 ? _a : 'es3';
        // Downgrade to lower target if swc does not support the selected target.
        // Perhaps project has an older version of swc.
        // TODO cache the results of this; slightly faster
        let swcTargetIndex = swcTargets.indexOf(swcTarget);
        for (; swcTargetIndex >= 0; swcTargetIndex--) {
            try {
                swcInstance.transformSync('', {
                    jsc: { target: swcTargets[swcTargetIndex] },
                });
                break;
            }
            catch (e) { }
        }
        swcTarget = swcTargets[swcTargetIndex];
        const keepClassNames = target >= /* ts.ScriptTarget.ES2016 */ 3;
        const moduleType = module === ModuleKind.CommonJS
            ? 'commonjs'
            : module === ModuleKind.AMD
                ? 'amd'
                : module === ModuleKind.UMD
                    ? 'umd'
                    : undefined;
        return {
            sourceMaps: sourceMap,
            // isModule: true,
            module: moduleType
                ? {
                    noInterop: !esModuleInterop,
                    type: moduleType,
                }
                : undefined,
            swcrc: false,
            jsc: {
                externalHelpers: importHelpers,
                parser: {
                    syntax: 'typescript',
                    tsx: isTsx,
                    decorators: experimentalDecorators,
                    dynamicImport: true,
                },
                target: swcTarget,
                transform: {
                    decoratorMetadata: emitDecoratorMetadata,
                    legacyDecorator: true,
                    react: {
                        throwIfNamespace: false,
                        development: false,
                        useBuiltins: false,
                        pragma: jsxFactory,
                        pragmaFrag: jsxFragmentFactory,
                    },
                },
                keepClassNames,
            },
        };
    }
    const transpile = (input, transpileOptions) => {
        const { fileName } = transpileOptions;
        const swcOptions = fileName.endsWith('.tsx') || fileName.endsWith('.jsx')
            ? tsxOptions
            : nonTsxOptions;
        const { code, map } = swcInstance.transformSync(input, Object.assign(Object.assign({}, swcOptions), { filename: fileName }));
        return { outputText: code, sourceMapText: map };
    };
    return {
        transpile,
    };
}
exports.create = create;
/** @internal */
exports.targetMapping = new Map();
exports.targetMapping.set(/* ts.ScriptTarget.ES3 */ 0, 'es3');
exports.targetMapping.set(/* ts.ScriptTarget.ES5 */ 1, 'es5');
exports.targetMapping.set(/* ts.ScriptTarget.ES2015 */ 2, 'es2015');
exports.targetMapping.set(/* ts.ScriptTarget.ES2016 */ 3, 'es2016');
exports.targetMapping.set(/* ts.ScriptTarget.ES2017 */ 4, 'es2017');
exports.targetMapping.set(/* ts.ScriptTarget.ES2018 */ 5, 'es2018');
exports.targetMapping.set(/* ts.ScriptTarget.ES2019 */ 6, 'es2019');
exports.targetMapping.set(/* ts.ScriptTarget.ES2020 */ 7, 'es2020');
exports.targetMapping.set(/* ts.ScriptTarget.ES2021 */ 8, 'es2021');
exports.targetMapping.set(/* ts.ScriptTarget.ESNext */ 99, 'es2021');
/**
 * @internal
 * We use this list to downgrade to a prior target when we probe swc to detect if it supports a particular target
 */
const swcTargets = [
    'es3',
    'es5',
    'es2015',
    'es2016',
    'es2017',
    'es2018',
    'es2019',
    'es2020',
    'es2021',
];
const ModuleKind = {
    None: 0,
    CommonJS: 1,
    AMD: 2,
    UMD: 3,
    System: 4,
    ES2015: 5,
    ES2020: 6,
    ESNext: 99,
};
//# sourceMappingURL=swc.js.map