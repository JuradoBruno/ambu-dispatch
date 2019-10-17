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

export interface MissionToUser {
    id: number,
    missionId: number,
    userId: number,
    state: any,
    createdAt: string,
    coordinates: {
        x: number,
        y: number
    },
    address: string,
    mission: Mission
}