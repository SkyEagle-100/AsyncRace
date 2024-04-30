import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import "./winners.css"
import { ICar, IWinner, IWinnerFullInfo } from "../../interfaces"
import { sortWinners } from "../../service/service"
import { makeWinnersFullInfoList } from "../../service/localService"
import Car, { CarSVG } from "../Car/Car"
import { sortValues } from "../../values"

interface IWinnersPageProps {
    show: boolean,
    setShow: Dispatch<SetStateAction<boolean>>,
    winners: IWinner[],
    cars: ICar[]
}



const WinnersPage:FC<IWinnersPageProps> = ({show, setShow, winners, cars}) => {

    const [winnersTable, setWinnersTable] = useState<IWinnerFullInfo[]>([]);
    const [paginatedWinners, setPaginatedWinners] = useState<IWinnerFullInfo[]>([])
    const [currentPage, setCurrentPage] = useState(1)

    const [sort, setSort] = useState(sortValues.winsDESC)

    useEffect(() => {
        makeSort()
    }, [sort, winners])

    useEffect(() => {
        if(winners){
            const sliced = winnersTable?.slice((currentPage - 1) * 10,(currentPage - 1) * 10 + 10);
            setPaginatedWinners(sliced)
          }
    },[winnersTable, currentPage])

    const makeSort = () => {
        const sortParams = sort.split(" ");
        (async function(){
            const sorted = await sortWinners({sort: sortParams[0], order: sortParams[1],})
            setWinnersTable(makeWinnersFullInfoList(sorted, cars))
        })()
    }
    return(
        <>
        <div style={{display: show ? "block" : 'none'}} className="container winners-page">
            <div className="header">
                <div className="header-panel">
                    <div className="header-panel-div">
                        <div>
                            Sort by:
                            <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                                <option></option>
                                <option>{sortValues.winsASC}</option>
                                <option>{sortValues.winsDESC}</option>
                                <option>{sortValues.timeASC}</option>
                                <option>{sortValues.timeDESC}</option>
                            </select>
                        </div>
                    </div>
                    <h1 className="winners-text">
                        Winners
                    </h1>
                    <div className="header-panel-div">
                    <button onClick={() => setShow(false)}>Garage</button>
                    </div>
                </div>
            </div>
            <table className="winners-table">
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
                                    <CarSVG color={el.color}></CarSVG>
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
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={paginatedWinners.length < 10 || currentPage * 10 === winners.length}>Next</button>
            </div>                
        </div>
        </>
    )
}

export default WinnersPage


