import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./App.css";
import {
  createCar,
  createWinner,
  engineMode,
  getAllCars,
  getAllWinners,
  updateWinner,
} from "./service/service";
import { ICar, IRaceWinner, IWinner } from "./interfaces";
import Car from "./components/Car/Car";
import {
  calcDuration,
  checkDrive,
  generateRandomCars,
  setMoveAnimation,
  stopAnimation,
} from "./service/localService";
import WinnersPage from "./components/Winners/Winners";
import { engineStatus } from "./values";
import WinnerInfoWindow from "./components/WinnerInfo/WinnerInfo";
import EditWindow from "./components/EditWindow/EditWIndow";

function App() {
  const [showWinnersPage, setShowWinnersPage] = useState(false);
  const [createCarName, setCreateCarName] = useState("");
  const [createCarColor, setCreateCarColor] = useState("#000000");
  const [cars, setCars] = useState<Array<ICar>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedCars, setPaginatedCars] = useState<ICar[]>([]);
  const [winnersList, setWinnersList] = useState<IWinner[]>([]);
  const [raceWinner, setRaceWinner] = useState<IRaceWinner | null>(null);
  const [showWinnerInfo, setShowWinnerInfo] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [carToEdit, setCarToEdit] = useState<ICar>();
  const [raceOn, setRaceOn] = useState(false);

  useEffect(() => {
    fetchCars();
    fetchWinners();
  }, []);

  useEffect(() => {
    paginateCars();
  }, [cars, currentPage]);

  useEffect(() => {
    (async function () {
      if (raceWinner) {
        console.log("Alee");
        setShowWinnerInfo(true);
        const winner: IWinner | undefined = winnersList.find(
          (winner) => winner.id === raceWinner.id,
        );
        if (winner)
          await updateWinner({
            id: winner.id,
            wins: winner.wins + 1,
            time: raceWinner.time < winner.time ? raceWinner.time : winner.time,
          });
        else
          await createWinner({
            id: raceWinner.id,
            wins: 1,
            time: raceWinner.time,
          });

        fetchWinners();
      }
    })();
  }, [raceWinner]);

  const fetchCars = async () => {
    setCars(await getAllCars());
  };

  const fetchWinners = async () => {
    setWinnersList(await getAllWinners());
  };
  const paginateCars = () => {
    if (cars) {
      const sliced = cars?.slice(
        (currentPage - 1) * 7,
        (currentPage - 1) * 7 + 7,
      );
      setPaginatedCars(sliced);
    }
  };

  const handleOnCreateCarClick = async () => {
    if (createCarName) {
      await createCar(createCarName, createCarColor);
      fetchCars();
      setCreateCarColor("#000000");
      setCreateCarName("");
    } else {
      alert("Define name for new car");
    }
  };

  const handleOnGenerateClick = async () => {
    generateRandomCars();
    setTimeout(() => {
      fetchCars();
    }, 1000);
  };

  const handleOnRaceButtonClick = () => {
    setRaceOn(true);
    moveCarsById(paginatedCars, setRaceWinner, setRaceOn);
  };

  const handleResetButtonClick = () => {
    setRaceOn(false);
    stopAnimation();
  };

  return (
    <div className="container">
      <WinnersPage
        cars={cars}
        winners={winnersList}
        show={showWinnersPage}
        setShow={setShowWinnersPage}
      ></WinnersPage>
      {showWinnerInfo && raceWinner ? (
        <WinnerInfoWindow
          winner={raceWinner}
          setShow={setShowWinnerInfo}
        ></WinnerInfoWindow>
      ) : null}
      {showEditModal && carToEdit ? (
        <EditWindow
          fetchCars={fetchCars}
          car={carToEdit}
          setShow={setShowEditModal}
        ></EditWindow>
      ) : null}
      <div className="header">
        <div className="header-panel">
          <div className="header-panel-div">
            <div className="header-inputs">
              <input
                className="name-input"
                value={createCarName}
                onChange={(e) => setCreateCarName(e.target.value)}
                placeholder="Add car name"
              ></input>
              <input
                style={{ borderColor: createCarColor }}
                className="color-input"
                type="color"
                value={createCarColor}
                onChange={(e) => setCreateCarColor(e.target.value)}
              ></input>
            </div>
            <button onClick={handleOnCreateCarClick}>Create Car</button>
            <button onClick={handleOnGenerateClick}>Generate 100</button>
          </div>
          <div className="header-panel-div">
            <button
              disabled={raceOn}
              className={`__green-button ${raceOn && "disabled-button"}`}
              onClick={handleOnRaceButtonClick}
            >
              RACE
            </button>
            <button onClick={() => handleResetButtonClick()}>Reset</button>
            <button
              className="winners-button"
              onClick={() => setShowWinnersPage(true)}
            >
              Winners
            </button>
          </div>
        </div>

        <div className="cars-amount">
          <h1 className="cars-amount-text">{cars?.length}</h1>
          <div className="total-cars-text">Total cars</div>
        </div>
      </div>

      <div className="track">
        {paginatedCars?.map((el) => {
          return (
            <>
              <div className="road">
                <div className="race-way">
                  <Car
                    color={el.color}
                    raceOn={raceOn}
                    id={el.id}
                    setCarToEdit={setCarToEdit}
                    setShowEditModal={setShowEditModal}
                    fetchCars={fetchCars}
                    winnersList={winnersList}
                    fetchWinners={fetchWinners}
                  />
                </div>
                <div className="car-name">{el.name}</div>
                <div style={{ borderColor: el.color }} className="finish">
                  <div className="finish-text">FINISH</div>
                </div>
              </div>
            </>
          );
        })}
      </div>
      <div className="pagination-panel">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {currentPage}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={paginatedCars.length < 7 || currentPage * 7 === cars.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;

async function moveCarsById(
  cars: ICar[],
  setRaceWinner: Dispatch<SetStateAction<IRaceWinner | null>>,
  setRaceOn: Dispatch<SetStateAction<boolean>>,
) {
  stopAnimation();
  let startTime: number;
  let winnerId: number | null = null; // Идентификатор победителя
  const velocities: { id: number; velocity: number }[] = [];
  await Promise.all(
    cars.map(async (el) => {
      const { velocity } = await engineMode(el.id, engineStatus.STARTED);
      velocities.push({ id: el.id, velocity });
    }),
  );
  for (const el of velocities) {
    const carDiv: HTMLElement | null = document.getElementById(el.id + "");
    calcDuration(el.velocity);
    if (carDiv) {
      carDiv.addEventListener("animationend", function () {
        setRaceOn(false);
        if (!winnerId) {
          const time = performance.now() - startTime;
          winnerId = el.id;
          setRaceWinner({
            id: winnerId,
            time: parseFloat((time / 1000).toFixed(2)),
          });
        }
        carDiv.style.animationName = "none";
      });
      setMoveAnimation(carDiv, calcDuration(el.velocity));
      startTime = performance.now();
    }
  }
  checkDrive(cars);
}
