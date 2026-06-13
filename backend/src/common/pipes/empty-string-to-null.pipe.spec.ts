import { ArgumentMetadata } from '@nestjs/common';
import { EmptyStringToNullPipe } from './empty-string-to-null.pipe';

describe('EmptyStringToNullPipe', () => {
  let pipe: EmptyStringToNullPipe;

  beforeEach(() => {
    pipe = new EmptyStringToNullPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should transform empty strings to null in body', () => {
    const input = {
      name: 'John Doe',
      email: '',
      cpf: '',
      phone: '11999999999',
    };
    const metadata: ArgumentMetadata = { type: 'body' };

    const result = pipe.transform(input, metadata);

    expect(result).toEqual({
      name: 'John Doe',
      email: null,
      cpf: null,
      phone: '11999999999',
    });
  });

  it('should transform empty strings recursively in nested objects', () => {
    const input = {
      name: 'John Doe',
      address: {
        street: 'Main Street',
        number: '',
        zip: '',
      },
    };
    const metadata: ArgumentMetadata = { type: 'body' };

    const result = pipe.transform(input, metadata);

    expect(result).toEqual({
      name: 'John Doe',
      address: {
        street: 'Main Street',
        number: null,
        zip: null,
      },
    });
  });

  it('should transform empty strings in arrays', () => {
    const input = {
      name: 'John Doe',
      tags: ['active', '', 'test'],
      objects: [{ id: '1', name: '' }, { id: '2', name: 'Valid' }],
    };
    const metadata: ArgumentMetadata = { type: 'body' };

    const result = pipe.transform(input, metadata);

    expect(result).toEqual({
      name: 'John Doe',
      tags: ['active', null, 'test'],
      objects: [{ id: '1', name: null }, { id: '2', name: 'Valid' }],
    });
  });

  it('should not transform Date objects', () => {
    const date = new Date();
    const input = {
      createdAt: date,
      name: '',
    };
    const metadata: ArgumentMetadata = { type: 'body' };

    const result = pipe.transform(input, metadata);

    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.name).toBeNull();
  });

  it('should ignore non-body requests', () => {
    const input = { name: '' };
    const metadata: ArgumentMetadata = { type: 'query' };

    const result = pipe.transform(input, metadata);

    expect(result.name).toBe('');
  });
});
