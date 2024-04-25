import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import "./winners.css"
import { ICar, IWinner, IWinnerFullInfo } from "../../interfaces"
import { getCarById } from "../../service/service"

interface IWinnersPage {
    show: boolean,
    setShow: Dispatch<SetStateAction<boolean>>,
    winners: IWinner[],
    cars: ICar[]
}



const WinnersPage:FC<IWinnersPage> = ({show, setShow, winners, cars}) => {

    const [winnersTable, setWinnersTable] = useState<IWinnerFullInfo[]>([]);

    useEffect(() => {
        const fetchWinners = async () => {
            const arr: IWinnerFullInfo[] = [];
            for (const el of winners) {
                const car: ICar = await getCarById(el.id);
                if(car)
                arr.push({id: car.id, color: car.color, name: car.name, wins: el.wins, time: el.time});
            }
            setWinnersTable(arr);
        };
        fetchWinners();
    }, [winners]);

   

    return(
        <>
        <div className="container winners-page">
            <button onClick={() => setShow(false)}>Garage</button>
            <table>
                <caption>Winners</caption>
                <thead>
                    <th>ID</th>
                    <th>Color</th>
                    <th>Name</th>
                    <th>Wins</th>
                    <th>Best Time</th>
                </thead>
                <tbody>
                {winnersTable.map(el => {
                return <tr key={el.id}>
                            <td>{el.id}</td>
                            <td>{el.color}</td>
                            <td>{el.name}</td>
                            <td>{el.wins}</td>
                            <td>{el.time}</td>
                       </tr>
                })}
                </tbody>
            </table>
           
        </div>
        </>
    )
}

export default WinnersPage