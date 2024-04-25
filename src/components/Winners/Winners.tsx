import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import "./winners.css"
import { ICar, IWinner, IWinnerFullInfo } from "../../interfaces"
import { getCarById } from "../../service/service"
import Car from "../Car/Car"

interface IWinnersPage {
    show: boolean,
    setShow: Dispatch<SetStateAction<boolean>>,
    winners: IWinner[],
    cars: ICar[]
}



const WinnersPage:FC<IWinnersPage> = ({show, setShow, winners, cars}) => {

    const [winnersTable, setWinnersTable] = useState<IWinnerFullInfo[]>([]);
    const [paginatedWinners, setPaginatedWinners] = useState<IWinnerFullInfo[]>([])
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        if(winners){
            const sliced = winnersTable?.slice((currentPage - 1) * 10,(currentPage - 1) * 10 + 10)
            setPaginatedWinners(sliced)
          }
    },[winnersTable, currentPage])

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
            <div className="header">
            <button onClick={() => setShow(false)}>Garage</button>

            </div>
            <table className="winners-table">
                <caption>Winners</caption>
                <thead>
                    <th>ID</th>
                    <th>Car </th>
                    <th>Name</th>
                    <th>Wins</th>
                    <th>Best Time</th>
                </thead>
                <tbody>
                {paginatedWinners.map(el => {
                return <tr className="winners-table-row" key={el.id}>
                            <td>{el.id}</td>
                            <td>
                                <div className="winners-table-car">
                                    <Car color={el.color}></Car>
                                </div>
                            </td>
                            <td>{el.name}</td>
                            <td>{el.wins}</td>
                            <td>{el.time}</td>
                       </tr>
                })}
                </tbody>
            </table>

            <div className="pagination-panel">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            {currentPage}
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={paginatedWinners.length < 10 || currentPage * 10 === cars.length}>Next</button>
            </div>                
        </div>
        </>
    )
}

export default WinnersPage