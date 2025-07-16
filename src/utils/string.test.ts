import { describe, it, expect } from 'vitest';
import {
  toKebab,
  toCamel,
  toPascal,
  toSnake,
  toTitleCase,
  toTrainCase,
  capitalize,
} from './string';

describe('string case conversion utilities', () => {
  describe('toKebab', () => {
    it('basic cases', () => {
      expect(toKebab('Hello World')).toBe('hello-world');
      expect(toKebab('fooBarBaz')).toBe('foo-bar-baz');
      expect(toKebab('foo_bar-baz')).toBe('foo-bar-baz');
    });
    it('delimiters and long strings', () => {
      expect(toKebab('---___...')).toBe('');
      expect(toKebab('foo---bar___baz...qux')).toBe('foo-bar-baz-qux');
      expect(toKebab('   foo   bar   ')).toBe('foo-bar');
      expect(toKebab('a'.repeat(1000) + ' ' + 'b'.repeat(1000))).toBe(
        'a'.repeat(1000) + '-' + 'b'.repeat(1000),
      );
    });
    it('edge cases', () => {
      expect(toKebab('')).toBe('');
      expect(toKebab('   ')).toBe('');
      expect(toKebab('FOO')).toBe('foo');
      expect(toKebab('foo--bar__baz')).toBe('foo-bar-baz');
      expect(toKebab('foo123Bar')).toBe('foo123-bar');
      expect(toKebab('foo.bar')).toBe('foo-bar');
      expect(toKebab('123foo')).toBe('123foo');
      expect(toKebab('foo 123 bar')).toBe('foo-123-bar');
      expect(toKebab('foo 123bar')).toBe('foo-123bar');
      expect(toKebab('123 bar')).toBe('123-bar');
      expect(toKebab('foo 123')).toBe('foo-123');
    });
    it('delimiters and long strings', () => {
      expect(toCamel('---___...')).toBe('');
      expect(toCamel('foo---bar___baz...qux')).toBe('fooBarBazQux');
      expect(toCamel('   foo   bar   ')).toBe('fooBar');
      expect(toCamel('a'.repeat(1000) + ' ' + 'b'.repeat(1000))).toBe(
        'a'.repeat(1000) + 'B' + 'b'.repeat(999),
      );
    });
  });

  describe('toCamel', () => {
    it('basic cases', () => {
      expect(toCamel('Hello World')).toBe('helloWorld');
      expect(toCamel('foo-bar-baz')).toBe('fooBarBaz');
      expect(toCamel('foo_bar baz')).toBe('fooBarBaz');
    });
    it('delimiters and long strings', () => {
      expect(toPascal('---___...')).toBe('');
      expect(toPascal('foo---bar___baz...qux')).toBe('FooBarBazQux');
      expect(toPascal('   foo   bar   ')).toBe('FooBar');
      expect(toPascal('a'.repeat(1000) + ' ' + 'b'.repeat(1000))).toBe(
        'A' + 'a'.repeat(999) + 'B' + 'b'.repeat(999),
      );
    });
    it('edge cases', () => {
      expect(toCamel('')).toBe('');
      expect(toCamel('   ')).toBe('');
      expect(toCamel('FOO')).toBe('foo');
      expect(toCamel('foo--bar__baz')).toBe('fooBarBaz');
      expect(toCamel('foo123Bar')).toBe('foo123Bar');
      expect(toCamel('foo.bar')).toBe('fooBar');
      expect(toCamel('123foo')).toBe('123foo');
      expect(toCamel('foo 123 bar')).toBe('foo123Bar');
      expect(toCamel('foo 123bar')).toBe('foo123bar');
      expect(toCamel('123 bar')).toBe('123Bar');
      expect(toCamel('foo 123')).toBe('foo123');
    });
    it('delimiters and long strings', () => {
      expect(toSnake('---___...')).toBe('');
      expect(toSnake('foo---bar___baz...qux')).toBe('foo_bar_baz_qux');
      expect(toSnake('   foo   bar   ')).toBe('foo_bar');
      expect(toSnake('a'.repeat(1000) + ' ' + 'b'.repeat(1000))).toBe(
        'a'.repeat(1000) + '_' + 'b'.repeat(1000),
      );
    });
  });

  describe('toPascal', () => {
    it('basic cases', () => {
      expect(toPascal('hello world')).toBe('HelloWorld');
      expect(toPascal('foo-bar-baz')).toBe('FooBarBaz');
      expect(toPascal('foo_bar baz')).toBe('FooBarBaz');
    });
    it('delimiters and long strings', () => {
      expect(toTitleCase('---___...')).toBe('');
      expect(toTitleCase('foo---bar___baz...qux')).toBe('Foo Bar Baz Qux');
      expect(toTitleCase('   foo   bar   ')).toBe('Foo Bar');
      expect(toTitleCase('a'.repeat(1000) + ' ' + 'b'.repeat(1000))).toBe(
        'A' + 'a'.repeat(999) + ' ' + 'B' + 'b'.repeat(999),
      );
    });
    it('edge cases', () => {
      expect(toPascal('')).toBe('');
      expect(toPascal('   ')).toBe('');
      expect(toPascal('FOO')).toBe('Foo');
      expect(toPascal('foo--bar__baz')).toBe('FooBarBaz');
      expect(toPascal('foo123Bar')).toBe('Foo123Bar');
      expect(toPascal('foo.bar')).toBe('FooBar');
      expect(toPascal('123foo')).toBe('123foo');
      expect(toPascal('foo 123 bar')).toBe('Foo123Bar');
      expect(toPascal('foo 123bar')).toBe('Foo123bar');
      expect(toPascal('123 bar')).toBe('123Bar');
      expect(toPascal('foo 123')).toBe('Foo123');
    });
    it('delimiters and long strings', () => {
      expect(toTrainCase('---___...')).toBe('');
      expect(toTrainCase('foo---bar___baz...qux')).toBe('Foo-Bar-Baz-Qux');
      expect(toTrainCase('   foo   bar   ')).toBe('Foo-Bar');
      expect(toTrainCase('a'.repeat(1000) + ' ' + 'b'.repeat(1000))).toBe(
        'A' + 'a'.repeat(999) + '-' + 'B' + 'b'.repeat(999),
      );
    });
  });

  describe('toSnake', () => {
    it('basic cases', () => {
      expect(toSnake('Hello World')).toBe('hello_world');
      expect(toSnake('fooBarBaz')).toBe('foo_bar_baz');
      expect(toSnake('foo-bar baz')).toBe('foo_bar_baz');
    });
    it('long strings', () => {
      expect(capitalize('a'.repeat(1000))).toBe('A' + 'a'.repeat(999));
    });
    it('edge cases', () => {
      expect(toSnake('')).toBe('');
      expect(toSnake('   ')).toBe('');
      expect(toSnake('FOO')).toBe('foo');
      expect(toSnake('foo--bar__baz')).toBe('foo_bar_baz');
      expect(toSnake('foo123Bar')).toBe('foo123_bar');
      expect(toSnake('foo.bar')).toBe('foo_bar');
      expect(toSnake('123foo')).toBe('123foo');
      expect(toSnake('foo 123 bar')).toBe('foo_123_bar');
      expect(toSnake('foo 123bar')).toBe('foo_123bar');
      expect(toSnake('123 bar')).toBe('123_bar');
      expect(toSnake('foo 123')).toBe('foo_123');
    });
  });

  describe('toTitleCase', () => {
    it('basic cases', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('foo-bar-baz')).toBe('Foo Bar Baz');
      expect(toTitleCase('foo_bar baz')).toBe('Foo Bar Baz');
    });
    it('edge cases', () => {
      expect(toTitleCase('')).toBe('');
      expect(toTitleCase('   ')).toBe('');
      expect(toTitleCase('FOO')).toBe('Foo');
      expect(toTitleCase('foo--bar__baz')).toBe('Foo Bar Baz');
      expect(toTitleCase('foo123Bar')).toBe('Foo123 Bar');
      expect(toTitleCase('foo.bar')).toBe('Foo Bar');
      expect(toTitleCase('123foo')).toBe('123foo');
      expect(toTitleCase('foo 123 bar')).toBe('Foo 123 Bar');
      expect(toTitleCase('foo 123bar')).toBe('Foo 123bar');
      expect(toTitleCase('123 bar')).toBe('123 Bar');
      expect(toTitleCase('foo 123')).toBe('Foo 123');
    });
  });

  describe('toTrainCase', () => {
    it('basic cases', () => {
      expect(toTrainCase('hello world')).toBe('Hello-World');
      expect(toTrainCase('foo-bar-baz')).toBe('Foo-Bar-Baz');
      expect(toTrainCase('foo_bar baz')).toBe('Foo-Bar-Baz');
    });
    it('edge cases', () => {
      expect(toTrainCase('')).toBe('');
      expect(toTrainCase('   ')).toBe('');
      expect(toTrainCase('FOO')).toBe('Foo');
      expect(toTrainCase('foo--bar__baz')).toBe('Foo-Bar-Baz');
      expect(toTrainCase('foo123Bar')).toBe('Foo123-Bar');
      expect(toTrainCase('foo.bar')).toBe('Foo-Bar');
      expect(toTrainCase('123foo')).toBe('123foo');
      expect(toTrainCase('foo 123 bar')).toBe('Foo-123-Bar');
      expect(toTrainCase('foo 123bar')).toBe('Foo-123bar');
      expect(toTrainCase('123 bar')).toBe('123-Bar');
      expect(toTrainCase('foo 123')).toBe('Foo-123');
    });
  });

  describe('capitalize', () => {
    it('basic cases', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('Hello')).toBe('Hello');
      expect(capitalize('a')).toBe('A');
      expect(capitalize('1abc')).toBe('1abc');
    });
    it('edge cases', () => {
      expect(capitalize('')).toBe('');
      expect(capitalize(' ')).toBe(' ');
      expect(capitalize('123')).toBe('123');
      expect(capitalize('!foo')).toBe('!foo');
    });
  });
});
