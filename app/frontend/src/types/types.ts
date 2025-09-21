export interface IUser {
    email: string,
    roles: string[],
    company?: Company
}

export interface Company {
    id: number,
    name: string,
    description: string
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
    user: IUser,
    token: string
}

export interface ValidationProblemDetails {
    type?: string,
    title?: string,
    status?: number,
    detail?: string,
    instance?: string,
    errors?: {
        [field: string]: string[];
    },
    traceId?: string
}

export interface ProblemDetails {
    type?: string,
    title?: string,
    status?: number,
    detail?: string,
    instance?: string,
    traceId?: string
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
    companyId: number,
    companyName: string
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
    Fastest = "Fastest",
    Cheapest = "Cheapest"
}

export interface CreateOrderDto {
    products: ProductOrderDto[],
    pickUpPointTownId: number,
    choice: RouteChoice
}

export interface ProductOrderDto {
    productId: number,
    quantity: number
}

export interface PickUpPoint {
    id: number,
    companyId: number,
    townId: number,
    townName: string
}

export interface Stock {
    id: number,
    companyId: number,
    townId: number
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
    id: number;
    items: OrderItemDto[];
    towns: Town[];
    shippingPrice: number;
    finalPrice: number;
    shippingTime: number;
    status: OrderStatus;
    createdAt: Date;
}

export interface OrderItemDto {
    product: IProduct;
    productPrice: number;
    quantity: number;
    finalPrice: number; // calculated as productPrice * quantity
}

export enum OrderStatus {
    Pending = "Pending",         // Order received but not yet processed
    Processing = "Processing",      // Order is being prepared/processed
    Shipped = "Shipped",         // Order has been shipped
    Delivered = "Delivered",       // Order delivered to the customer
    Cancelled = "Cancelled",       // Order was cancelled
    Returned = "Returned"         // Order was returned by the customer
}

export interface CartItem {
    productId: number,
    quantity: number
}

export interface Company {
    id: number,
    name: string
}

export interface ComputeRouteResponse {
    shippingPrice: number,
    shippingTime: number,
    towns: string[],
    isRoutesEqual: boolean
}

export interface ComputeRouteRequest {
    companyId: number,
    pickUpPointTownId: number,
    choice: RouteChoice
}

export interface RefreshTokenResponseDto {
    token: string
}

export interface PaginatedResponseDto<T> {
    data: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export enum ProductSortBy {
    Id = "id",
    Name = "name",
    Price = "price"
}

export interface CanCreateProductResponse {
    canCreate: boolean;
    message?: string;
}

export interface UserProfileDto {
    ordersCount: number;
}

export interface UpdateCompanyDetailsRequest {
    name: string,
    description: string
}