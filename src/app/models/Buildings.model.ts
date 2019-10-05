export class Building{
    buildingCore: {
        title: string,
        description: string
    }
    id: number    
    specificDescription: string
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

