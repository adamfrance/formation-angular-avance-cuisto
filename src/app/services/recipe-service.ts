import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Author, Recipe, RecipePage } from '@cuisto/models';
import { API_URL } from './api';

/**
 * Accès aux recettes de l'API DummyJSON : liste, recherche, fiche, auteur et proposition.
 */
@Service()
export class RecipeService {
  /** Le client HTTP d'Angular, qui envoie les requêtes. */
  private readonly http = inject(HttpClient);

  /**
   * Toutes les recettes en une requête (50).
   * @returns la page de résultats, avec `recipes` et `total`
   */
  getAll(): Observable<RecipePage> {
    return this.http.get<RecipePage>(`${API_URL}/recipes?limit=0`);
  }

  /**
   * Les recettes dont le nom contient le terme ; la recherche est faite par le serveur.
   * @param terme le texte saisi, encodé dans l'adresse
   */
  search(terme: string): Observable<RecipePage> {
    return this.http.get<RecipePage>(`${API_URL}/recipes/search?q=${encodeURIComponent(terme)}`);
  }

  /**
   * Une recette complète : ingrédients, étapes, temps.
   * @param id l'identifiant de la recette
   */
  getById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${API_URL}/recipes/${id}`);
  }

  /**
   * Les recettes qui portent une étiquette, pour les « recettes similaires ».
   * @param tag l'étiquette, par exemple « Chicken »
   */
  byTag(tag: string): Observable<RecipePage> {
    return this.http.get<RecipePage>(`${API_URL}/recipes/tag/${encodeURIComponent(tag)}`);
  }

  /**
   * Le prénom et le nom de l'auteur d'une recette.
   * @param id l'identifiant de l'utilisateur
   */
  author(id: number): Observable<Author> {
    return this.http.get<Author>(`${API_URL}/users/${id}?select=firstName,lastName`);
  }

  /**
   * Propose une nouvelle recette ; l'API de démonstration simule l'enregistrement.
   * @param recette les champs du formulaire « Proposer une recette »
   */
  add(recette: object): Observable<Recipe> {
    return this.http.post<Recipe>(`${API_URL}/recipes/add`, recette);
  }
}
