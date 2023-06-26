import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll()', () => {
    it('should return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne()', () => {
    it('should return a movie', () => {
      service.createMovie({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });
    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Not Found Moive with ID: 999');
      }
    });
  });

  describe('deleteOne()', () => {
    it('deletes a movie', () => {
      service.createMovie({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });
      const beforeDelete = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll().length;
      expect(afterDelete).toEqual(beforeDelete - 1);
    });
    it('should return a 404', () => {
      try {
        service.deleteOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Not Found Moive with ID: 999');
      }
    });
  });

  describe('creteMovie()', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;
      service.createMovie({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });
      const afterCreate = service.getAll().length;
      expect(afterCreate).toEqual(beforeCreate + 1);
    });
    it('index have to be increased at all time', () => {
      service.createMovie({
        title: 'Test Movie 1',
        genres: ['test'],
        year: 2000,
      });
      service.createMovie({
        title: 'Test Movie 2',
        genres: ['test'],
        year: 2000,
      });
      service.createMovie({
        title: 'Test Movie 3',
        genres: ['test'],
        year: 2000,
      });
      service.update(2, { title: 'Test Movie 2 updated' });
      service.createMovie({
        title: 'Test Movie 4',
        genres: ['test'],
        year: 2000,
      });
      const movies = service.getAll();
      expect(movies[3].id).toEqual(4);
    });
  });

  describe('update()', () => {
    it('should update a movie', () => {
      service.createMovie({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });
      service.update(1, { title: 'Updated Test' });
      const movie = service.getOne(1);
      expect(movie.title).toEqual('Updated Test');
    });
    it('should throw a NotFoundException', () => {
      try {
        service.update(999, {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Not Found Moive with ID: 999');
      }
    });
  });
});
