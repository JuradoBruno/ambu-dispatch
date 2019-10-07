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
    coordinates?: {
        x: number,
        y: number
    }

    constructor(building?: any) {
        Object.assign(this, building)
    }
}

