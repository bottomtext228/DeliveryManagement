export interface IUser {
    email: string
}

export interface IUserData {
    email: string,
    password: string,
    asCompany: boolean,
    companyDescription: string,
    companyName: string
}

export interface ILoginData {
    /*  tokenType: string,
     accessToken: string,
     expiresIn: number,
     refreshToken: string */
    email: string,
    token: string
}

export interface IHtppValidationProblemDetails {
    type?: string,
    title?: string,
    status?: number,
    detail?: string,
    instance?: string,
    errors?: object
}

export interface IProduct {
    id: number,
    name: string,
    price: number,
    image: string
}

export interface IVector {
    x: number,
    y: number,
    z: number
}

export interface IProductDetail {
    id: number,
    name: string,
    description: string,
    price: number,
    weight: number,
    size: IVector,
    image: string
}

export interface EditProductDto {
    name: string,
    description: string,
    price: number,
    sizeX: number,
    sizeY: number,
    sizeZ: number,
    weight: number,
    image: File | undefined
}

export interface CreateProductDto {
    name: string,
    description: string,
    price: number,
    sizeX: number,
    sizeY: number,
    sizeZ: number,
    weight: number,
    image: File
}

export interface PickUpPoint {

}

export interface Stock {
    
}


export interface CustomeNode {
    x: number,
    y: number,
    name: string,
    id: number
}

export interface Vector2D {
    x: number,
    y: number
}

export interface Town {
    id: number,
    name: string,
    position: Vector2D
}

export interface Road {

}


export enum MapModes {
    SetStocks,
    SetPickUpPoints
}