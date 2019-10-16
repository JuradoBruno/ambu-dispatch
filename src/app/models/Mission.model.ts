export interface Mission {
    id: number
    title: string
    description?: string
    textureName: string
    textureFileName: string
    textureScale: number
    priceReward: number
    numberOfVehicleNeeded?: number
    processDurationSeconds?: number
}