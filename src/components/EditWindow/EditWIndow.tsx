import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { deflate } from "zlib"
import "./editWindow.css"
import { ICar } from "../../interfaces";
import Car from "../Car/Car";
import { editCar, getCarById } from "../../service/service";
interface IEditModalProps {
    setShow: Dispatch<SetStateAction<boolean>>,
    car: ICar,
    fetchCars: () => void
}

const EditWindow:FC<IEditModalProps> = ({setShow,car, fetchCars}) => {

    const [color, setColor] = useState(car.color)
    const [name, setName] = useState(car.name)
    
    const handleOnSubmitButtonClick = async () => {
        await editCar({id: car.id, color, name})
        fetchCars()
        setShow(false)
    }

    return(
        <div onClick={() => setShow(false)}className="modal-wrapper">
            <div onClick={e => e.stopPropagation()} className="edit-modal">
                <Car color={color}></Car>
                <input onChange={(e) => setColor(e.target.value)} type="color" placeholder="Pick a new color"/>
                <input value={name} onChange={e => setName(e.target.value)}/>
                <button onClick={handleOnSubmitButtonClick}>Submit</button>
            </div>
        </div>
    )
}


export default EditWindow;