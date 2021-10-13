"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getUrlsFromJson_1 = __importDefault(require("./getUrlsFromJson"));
describe('getUrlsFromJson', () => {
    it('should return parsed JSON', () => {
        const urls = (0, getUrlsFromJson_1.default)('["https://www.foo.software", "https://www.google.com"]');
        expect(urls).toEqual([
            'https://www.foo.software',
            'https://www.google.com',
        ]);
    });
    it('should return parsed JSON correctly when tuples are defined', () => {
        const urls = (0, getUrlsFromJson_1.default)('[["abc", "https://www.foo.software"], ["123", "https://www.google.com"]]');
        expect(urls).toEqual([
            'abc::https://www.foo.software',
            '123::https://www.google.com',
        ]);
    });
    it('should return parsed JSON correctly when single arrays are defined', () => {
        const urls = (0, getUrlsFromJson_1.default)('[["https://www.foo.software"], ["https://www.google.com"]]');
        expect(urls).toEqual([
            'https://www.foo.software',
            'https://www.google.com',
        ]);
    });
    it('should throw an error if incorrect format', () => {
        expect(() => {
            (0, getUrlsFromJson_1.default)('https://www.foo.software,https://www.google.com');
        }).toThrow();
    });
    it('should throw an error if array item is larger than a tuple', () => {
        expect(() => {
            (0, getUrlsFromJson_1.default)('[["abc", "https://www.foo.software", "oh no"], ["123", "https://www.google.com"]]');
        }).toThrow();
    });
});
//# sourceMappingURL=index.test.js.map