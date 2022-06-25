import { useEffect, useState } from "react";

import { Content } from "./components/Content";
import { SideBar } from "./components/SideBar";

import { api } from "./services/api";

import "./styles/global.scss";

import "./styles/content.scss";
import "./styles/sidebar.scss";

export interface GenreResponseProps {
  id: number;
  name: "action" | "comedy" | "documentary" | "drama" | "horror" | "family";
  title: string;
}

export interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

export function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(1);

  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>(
    {} as GenreResponseProps,
  );

  useEffect(() => {
    api.get<GenreResponseProps[]>("genres").then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    Promise.all([
      api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`),
      api.get<GenreResponseProps>(`genres/${selectedGenreId}`),
    ]).then(([moviesResponse, selectedGenreResponse]) => {
      setMovies(moviesResponse.data);
      setSelectedGenre(selectedGenreResponse.data);
    });
  }, [selectedGenreId]);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <SideBar
        genres={genres}
        setSelectedGenreId={setSelectedGenreId}
        selectedGenreId={selectedGenreId}
      />

      <Content movies={movies} selectedGenre={selectedGenre} />
    </div>
  );
}
