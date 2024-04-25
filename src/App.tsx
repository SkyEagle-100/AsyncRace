import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import './App.css';
import { createCar, createWinner, engineMode, getAllCars, getAllWinners, getCarById, removeCar, removeWinner, updateWinner} from './service/service';
import { ICar, IRaceWinner, IWinner } from './interfaces';
import Car from './components/Car/Car';
import { calcDuration, generateRandomCars, moveCarById, setMoveAnimation, stopAnimation } from './service/localService';
import WinnersPage from './components/Winners/Winners';
import axios from 'axios';
import { engineStatus } from './values';
import WinnerInfoWindow from './components/WinnerInfo/WinnerInfo';
import EditWindow from './components/EditWindow/EditWIndow';

function App() {
  

  const [showWinnersPage, setShowWinnersPage] = useState(false)
  const [createCarName, setCreateCarName] = useState("")
  const [createCarColor, setCreateCarColor] = useState("#000000")
  const [cars, setCars] = useState<Array<ICar>>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [paginatedCars, setPaginatedCars] = useState<ICar[]>([])
  const [winnersList, setWinnersList] = useState<IWinner[]>([])
  const [raceWinner, setRaceWinner] = useState<IRaceWinner | null>(null)
  const [showWinnerInfo, setShowWinnerInfo] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [carToEdit, setCarToEdit] = useState<ICar>()

  useEffect(() => {
    fetchCars();
    fetchWinners()
  },[])

  useEffect(() => {
    paginateCars()
    //eslint-disable-next-line
  }, [cars, currentPage]) 

  useEffect(() => {
    (async function () {if(raceWinner){
        console.log("Alee")
        setShowWinnerInfo(true)
        const winner: IWinner | undefined =  winnersList.find(winner => winner.id === raceWinner.id)
        if(winner)
            await updateWinner({id: winner.id, wins: winner.wins + 1, time: raceWinner.time < winner.time ? raceWinner.time : winner.time})
        else
            await createWinner({id: raceWinner.id, wins: 1, time: raceWinner.time })
        
        fetchWinners()
    }})()
  }, [raceWinner])

  const fetchCars = async () => {
      setCars(await getAllCars());
  };

  const fetchWinners = async () => {
      setWinnersList(await getAllWinners());
  }
  const paginateCars = () => {
    if(cars){
      const sliced = cars?.slice((currentPage - 1) * 7,(currentPage - 1) * 7 + 7)
      setPaginatedCars(sliced)
    }
  }

  const handleOnCreateCarClick = async () => {
      if(createCarName){
        await createCar(createCarName, createCarColor)
        fetchCars()
        setCreateCarColor("#000000")
        setCreateCarName("")
      }else{
        alert("Define name for new car")
      }
  }

  const handleOnGenerateClick = async () => {
    generateRandomCars()
    fetchCars()
  }

  const handleOnRemoveButtonClick = async (id: number) => {
      await removeCar(id)
      if(winnersList.find(w => w.id === id)){
        await removeWinner(id)
        fetchWinners()   
      }
      fetchCars()
  }

  const handleOnEditButtonClick = async (id: number) => { 
      const car = await getCarById(id)
      setCarToEdit(car)
      setShowEditModal(true)
  }

  const handleOnDriveButtonClick = async (id : number) => {
    moveCarById(id)

  }

  const handleOnStopButtonClick = async (id: number) => {
    const car = document.getElementById(id+"")
    if(car){
    car.style.animationPlayState = 'paused'; // Приостанавливаем анимацию
    car.style.animationName = "none"
    }
    engineMode(id, engineStatus.STOPPED)
  }

  const handleResetButtonClick  = () => {
    stopAnimation()
  }

  return (
    <div className='container'>
      { showWinnersPage ? <WinnersPage cars={cars} winners={winnersList} show={showWinnersPage} setShow={setShowWinnersPage}></WinnersPage> : null}
      { showWinnerInfo && raceWinner ? <WinnerInfoWindow winner={raceWinner} setShow={setShowWinnerInfo}></WinnerInfoWindow> : null}
      { showEditModal && carToEdit ? <EditWindow fetchCars={fetchCars} car={carToEdit} setShow={setShowEditModal}></EditWindow> : null}
      <div className="header">
        <div className="header-panel">
          <div className="header-panel-left-div">

            <div className="create-car-div">
              <div className='header-inputs'>
                <input className="name-input" value={createCarName} onChange={e => setCreateCarName(e.target.value)} placeholder='Add car name'></input>
                <input className='color-input' type='color' value={createCarColor} onChange={e => setCreateCarColor(e.target.value)}></input>
              </div>
            <button onClick={handleOnCreateCarClick}>Create Car</button>
            </div>
            
            <button onClick={handleOnGenerateClick}>Generate 100 cars</button>
          </div>
          <div className="header-panel-right-div">
            <button className='__green-button' onClick={() => moveCarsById(paginatedCars, setRaceWinner)}>RACE</button>
            <button onClick={() => handleResetButtonClick()}>Reset</button>
          <button className="winners-button"onClick={() => setShowWinnersPage(true)}>Winners</button>
          </div>
        </div>
        
          <div className='cars-amount'>
            <h1 className='cars-amount-text'>
              {cars?.length}
            </h1>
            <div className="total-cars-text">
              Total cars              
            </div>
          </div>
           
      </div>
      
      
      <div className="track">
        {paginatedCars?.map((el, i) => {
            return <>
                  <div className="road">
                    <div className="race-way">
                      <div id={`${el.id}`} key={i} className='car'>
                        <Car color={el.color}/>
                      </div>
                    </div>
                    <div className="car-buttons">
                      <button onClick={() => handleOnEditButtonClick(el.id)}>E</button>
                      <button onClick={() => handleOnRemoveButtonClick(el.id)}>R</button>
                      <button onClick={() => handleOnDriveButtonClick(el.id)}>D</button>
                      <button onClick={() => handleOnStopButtonClick(el.id)}>S</button>
                    </div>
                    <div style={{color: el.color}} className='car-name'>
                      {el.name}
                    </div>
                  <div className="finish">
                    <div className="finish-text">
                      FINISH
                    </div>
                    
                  </div>
                  </div>
                  
                  </>
        })}
      </div>
      <div className='pagination-panel'>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        {currentPage}
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={paginatedCars.length < 7 || currentPage * 7 === cars.length}>Next</button>
      </div>
    </div>
  );
}

export default App;

async function moveCarsById(cars: ICar[], setRaceWinner: Dispatch<SetStateAction<IRaceWinner | null>>){
    stopAnimation()
    let startTime: number;
    let winnerId: number | null = null; // Идентификатор победителя
    const velocities: { id: number; velocity: number; }[] = []
    await Promise.all(cars.map(async el => {
      const { velocity } = await engineMode(el.id, engineStatus.STARTED);
      velocities.push({ id: el.id, velocity });
    }));
      for(const el of velocities){
      const carDiv: HTMLElement | null = document.getElementById(el.id+"")
      calcDuration(el.velocity)
      if(carDiv){
        carDiv.addEventListener('animationend', () => {
          if(!winnerId){
            const time = (performance.now() - startTime)
            winnerId = el.id
            setRaceWinner({id: winnerId, time: parseFloat((time / 1000).toFixed(2))})
          }
          carDiv.style.animationName = 'none';
        });      
      setMoveAnimation(carDiv, calcDuration(el.velocity))
      startTime = performance.now()
      }
    }
    checkDrive(cars)
}




const checkDrive = async (cars : ICar[]) => {
    for(const car of cars){
      const res = await engineMode(car.id, engineStatus.DRIVE)
      console.log( "RESSSSSS" + " " + res)
      if(res == 500){
          const div = document.getElementById(car.id+"")
          if(div){
            div.style.animationPlayState = 'paused'; // Приостанавливаем анимацию
            // div.style.animationName = "none"
            engineMode(car.id, engineStatus.STOPPED)          
            console.log("allee")
          }
      }
    }
}
