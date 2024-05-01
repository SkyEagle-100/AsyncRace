import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { ICar, IRaceWinner } from "../../interfaces";

import "./winnerInfo.css";
import { getCarById } from "../../service/service";
import { CarSVG } from "../Car/Car";

interface IWinnerInfoWindowProps {
  winner: IRaceWinner;
  setShow: Dispatch<SetStateAction<boolean>>;
}

const WinnerInfoWindow: FC<IWinnerInfoWindowProps> = ({ winner, setShow }) => {
  const [car, setCar] = useState<ICar>();
  useEffect(() => {
    (async function () {
      setCar(await getCarById(winner.id));
    })();
  }, [winner]);
  return (
    <div onClick={() => setShow(false)} className="modal-wrapper">
      {car && (
        <div className="winner-info">
          <div className="winner-info-header">{car.name} WINS!!!</div>
          <CarSVG color={car.color}></CarSVG>
          <div className="winner-info-time">Time: {winner.time}s</div>
        </div>
      )}
    </div>
  );
};

export default WinnerInfoWindow;
