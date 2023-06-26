import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  getAll(): Movie[] {
    return this.movies;
  }
  getOne(id: number): Movie {
    const movie = this.movies.find((movie) => movie.id === id);
    if (!movie) {
      throw new NotFoundException(`Not Found Moive with ID: ${id}`);
    }
    return movie;
  }
  deleteOne(id: number) {
    this.getOne(id);
    this.movies = this.movies.filter((movie) => movie.id !== id);
  }
  createMovie(movieData: CreateMovieDto) {
    let newId: number;
    let value = 0;
    if (this.movies.length < 1) {
      newId = 1;
    } else {
      this.movies.forEach((movie) => {
        if (movie.id > value) {
          value = movie.id;
        }
      });
      newId = value + 1;
    }

    this.movies.push({
      id: newId,
      ...movieData,
    });
  }

  update(id: number, updateData: UpdateMovieDto) {
    const movie = this.getOne(id);
    this.deleteOne(id);
    this.movies.push({ ...movie, ...updateData });
  }
}
