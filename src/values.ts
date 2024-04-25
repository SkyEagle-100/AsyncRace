export const serverUrl = "http://localhost:3001"
interface CarModels {
    [brand: string]: string[];
}
export const carBrands = ["Tesla", "Ford", "Chevrolet", "Toyota", "Honda", "BMW", "Mercedes", "Audi", "Nissan", "Volvo"];
export const carModels: CarModels = {
    "Tesla": ["Model S", "Model 3", "Model X", "Model Y"],
    "Ford": ["Mustang", "Fiesta", "Focus", "Escape"],
    "Chevrolet": ["Camaro", "Silverado", "Equinox", "Malibu"],
    "Toyota": ["Camry", "Corolla", "Rav4", "Highlander"],
    "Honda": ["Accord", "Civic", "CR-V", "Pilot"],
    "BMW": ["X5", "3 Series", "5 Series", "7 Series"],
    "Mercedes": ["E-Class", "C-Class", "GLC", "S-Class"],
    "Audi": ["A4", "Q5", "A6", "Q7"],
    "Nissan": ["Altima", "Rogue", "Sentra", "Pathfinder"],
    "Volvo": ["XC90", "S60", "XC60", "V90"]
};


export const engineStatus ={
    STARTED : 'started',
    STOPPED : 'stopped',
    DRIVE : 'drive'
}
