export interface FormattedPokemonData {
  name: string;
  id: number;
  weight: number;
  height: number;
  stats: Stat[];
  abilities: string[];
  next: string | undefined;
  previous: string | undefined;
  DamageRelations: DamageRelation[];
  types: string[];
  sprites: string[];
  description: string;
}

export interface DamageRelation {
  double_damage_from: DoubleDamageFrom[];
  double_damage_to: DoubleDamageFrom[];
  half_damage_from: DoubleDamageFrom[];
  half_damage_to: DoubleDamageFrom[];
  no_damage_from: any[];
  no_damage_to: DoubleDamageFrom[];
}

export interface DoubleDamageFrom {
  name: string;
  url: string;
}

export interface Stat {
  name: string;
  baseStat: number;
}
