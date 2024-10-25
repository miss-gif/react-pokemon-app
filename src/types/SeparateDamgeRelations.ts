export interface DamageFromAndTo {
  to: SeparateDamge;
  from: SeparateDamge;
}

export interface SeparateDamge {
  double_damage?: Damage[];
  half_damage?: Damage[];
  no_damage?: Damage[];
}

export interface Damage {
  damageValue: string;
  name: string;
  url: string;
}
