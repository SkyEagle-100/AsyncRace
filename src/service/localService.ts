import { ICar, IWinner, IWinnerFullInfo } from "../interfaces";
import { carBrands, carModels, engineStatus } from "../values";
import { createCar, engineMode } from "./service";

export const generateRandomCars = (amount: number = 100) => {
    let i = 1;
    while(i <= amount){
        const brandIndex = Math.floor(Math.random() * carBrands.length);
        const brand = carBrands[brandIndex];
        const models = carModels[brand];
        const modelIndex = Math.floor(Math.random() * models.length);
        const model = models[modelIndex];
      createCar(brand + " " + model, generateRandomHexColor())
      i++;
    }
}

function generateRandomHexColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

export const stopAnimation = () =>{
  const cars = document.querySelectorAll('.car') as NodeListOf<HTMLElement>;
  cars.forEach((car: HTMLElement) => {
    car.style.animationPlayState = 'paused'; // Приостанавливаем анимацию
    car.style.animationName = "none"
  })
}

export const setMoveAnimation = (carDiv : HTMLElement,duration: number) => {
  carDiv.style.animationName = "moveRight"
  carDiv.style.animationDuration = `${duration}s`;
  carDiv.style.animationTimingFunction = 'ease-in-out'; // Линейная анимация для постоянной скорости
  carDiv.style.animationPlayState = 'running'; 
}

export const moveCarById = async (id: number) => {
  
    const car = document.getElementById(id+"")
    
    
    if(car){
      car.style.animationPlayState = 'paused'; // Приостанавливаем анимацию
      car.style.animationName = "none"
      car.addEventListener('animationend', () => {
      car.style.animationPlayState = 'paused'; // Приостанавливаем анимацию
        car.style.animationName = 'none';
      }); 
     const {velocity} = await engineMode(id, engineStatus.STARTED)
     setMoveAnimation(car, calcDuration(velocity))
     checkDriveById(id)
    }
}


export const calcDuration = (velocity: number, distance: number = 100): number => {
      return (distance /(velocity * 2)) * 10;
}


export const makeWinnersFullInfoList = (winners: IWinner[], cars: ICar[]): IWinnerFullInfo[] => {
  const arr: IWinnerFullInfo[] = [];
  winners.forEach(el => {
      const car = cars.find(c => c.id === el.id);
      if(car)
      arr.push({id: car.id, color: car.color, name: car.name, wins: el.wins, time: el.time});
  })
  return arr
}

export const checkDrive = async (cars : ICar[]) => {
  for(const car of cars){
    const res = await engineMode(car.id, engineStatus.DRIVE)
    if(res == 500){
        const div = document.getElementById(car.id+"")
        if(div){
          div.style.animationPlayState = 'paused';
          engineMode(car.id, engineStatus.STOPPED)          
        }
    }
  }
}


export const checkDriveById = async(id: number) => {
    const res = await engineMode(id, engineStatus.DRIVE)
    if(res === 500){
      const div = document.getElementById(id+"")
        if(div)
          div.style.animationPlayState = 'paused';
          engineMode(id, engineStatus.STOPPED)          
        }
    }

