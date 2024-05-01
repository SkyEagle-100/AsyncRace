export interface ICar {
  color: string;
  id: number;
  name: string;
}

export interface IWinner {
  id: number;
  wins: number;
  time: number;
}

export interface IWinnerFullInfo {
  id: number;
  wins: number;
  time: number;
  color: string;
  name: string;
}

export interface IRaceWinner {
  id: number;
  time: number;
}

export interface IVelocity {
  id: number;
  velocity: number;
}

export interface ISortWinnerData {
  sort: string;
  order: string;
}

export interface CarModels {
  [brand: string]: string[];
}
