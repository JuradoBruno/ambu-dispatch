export class Building{
    id: number
    title: string
    description: string
    level: number
    coinPrice: number
    cashPrice: number
    constructionTime: number
    employeeCapacity: number
    patientCapacity: number
    vehicleCapacity: number

    constructor(building?: any) {
        Object.assign(this, building)
    }
}