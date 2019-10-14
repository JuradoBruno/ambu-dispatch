export interface Mission {
    id: number
    title: string
    description?: string
    priceReward: number
    numberOfVehicleNeeded?: number
    processDurationSeconds?: number
}