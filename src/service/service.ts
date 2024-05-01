import axios, { AxiosError } from "axios";
import { serverUrl } from "../values";
import { ICar, ISortWinnerData, IWinner } from "../interfaces";

export const getAllCars = async (): Promise<ICar[]> => {
  let cars: ICar[] = [];
  cars = await axios.get(`${serverUrl}/garage`).then((response) => {
    console.table(response.data);
    return response.data;
  });
  return cars;
};

export const createCar = async (name: string, color: string) => {
  await axios.post(`${serverUrl}/garage`, {
    name,
    color,
  });
};

export const getCarById = async (id: number) => {
  const car = (await axios.get(`${serverUrl}/garage?id=${id}`)).data[0];
  return car;
};

export const removeCar = async (id: number) => {
  await axios.delete(`${serverUrl}/garage/${id}`);
};

export const editCar = async (car: ICar) => {
  await axios.put(`${serverUrl}/garage/${car.id}`, car, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getAllWinners = async (): Promise<IWinner[]> => {
  let winners: IWinner[] = await (await axios.get(`${serverUrl}/winners`)).data;
  return winners;
};

export const engineMode = async (id: number, status: string) => {
  let result;
  try {
    result = (
      await axios.patch(`${serverUrl}/engine`, null, {
        params: { id: id, status: status },
      })
    ).data;
  } catch (error) {
    const axiosError = error as AxiosError;
    return axiosError.response?.status;
  }
  return result;
};

export const createWinner = async (data: IWinner) => {
  console.log(
    await axios.post(`${serverUrl}/winners`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    }),
  );
};

export const updateWinner = async (data: IWinner) => {
  await axios.put(
    `${serverUrl}/winners/${data.id}`,
    { wins: data.wins, time: data.time },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const removeWinner = async (id: number) => {
  axios.delete(`${serverUrl}/winners/${id}`);
};

export const sortWinners = async (
  data: ISortWinnerData,
): Promise<IWinner[]> => {
  const res: IWinner[] = await axios
    .get(`${serverUrl}/winners?_sort=${data.sort}&_order=${data.order}`)
    .then((response) => {
      return response.data;
    });
  return res;
};
