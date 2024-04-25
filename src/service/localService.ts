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
    
    const {velocity} = await engineMode(id, engineStatus.STARTED)
    
    if(car){
      car.style.animationPlayState = 'paused'; // Приостанавливаем анимацию
      car.style.animationName = "none"
      car.addEventListener('animationend', () => {
        car.style.animationName = 'none';
      }); 
     setMoveAnimation(car, calcDuration(velocity))
    }
}


export const calcDuration = (velocity: number, distance: number = 100): number => {
      return (distance /(velocity * 2)) * 10;
}