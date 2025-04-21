export interface IUser {
    email: string,
    roles: string[]
}

export interface IRegisterRequest {
    email: string,
    password: string,
    asCompany: boolean,
    companyDescription: string,
    companyName: string
}


export interface ILoginRequest {
    email: string,
    password: string
}

export interface ILoginResponse {
    /*  tokenType: string,
     accessToken: string,
     expiresIn: number,
     refreshToken: string */
    email: string,
    roles: string[],
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
    image: string,
    companyId: number
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

export enum RouteChoice {
    Fastest,
    Cheapest
}

export interface CreateOrderDto {
    productId: number,
    pickUpPointTownId: number,
    choice: RouteChoice,
    quantity: number
}

export interface PickUpPoint {
    id: number,
    companyId: number,
    townId: number,
}

export interface Stock {

}


export interface CustomeNode {
    x: number,
    y: number,
    name: string,
    id: number,
    selected: boolean
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

export interface IOrder {
    id: number,
    product: IProduct,
    towns: Town[],
    productPrice: number,
    shippingPrice: number,
    finalPrice: number,
    shippingTime: number,
    quantity: number,
    status: OrderStatus,
    createdAt: string
}

export enum OrderStatus {
    Pending = 0,         // Order received but not yet processed
    Processing = 1,      // Order is being prepared/processed
    Shipped = 2,         // Order has been shipped
    Delivered = 3,       // Order delivered to the customer
    Cancelled = 4,       // Order was cancelled
    Returned = 5         // Order was returned by the customer
}

export interface CartItem {
    productId: number,
    quantity: number
}