/* import { objectToFormData } from "./helpers/form.helper";
import { getTokenFromLocalStorage } from "./helpers/localstorage.helper";
import { IProduct, EditProductDto, CreateProductDto, IHtppValidationProblemDetails, IProductDetail } from "./types/types";


export async function getAllProducts(): Promise<IProduct[] | null> {

    const response = await fetch('/api/catalog', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getTokenFromLocalStorage()
        }
    });
    if (response.ok) {
        const body = response.json();
        return body;
    }
    return null;

}



export async function editProduct(id: number, dto: EditProductDto): Promise<boolean> {

    const response = await fetch(`/api/catalog/${id}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + getTokenFromLocalStorage()
            },
            body: objectToFormData(dto)
        }
    );
    return response.ok;
}


export async function createProduct(dto: CreateProductDto): Promise<boolean | IHtppValidationProblemDetails> {
    const response = await fetch('/api/catalog',
        {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getTokenFromLocalStorage()
            },
            body: objectToFormData(dto)
        }
    );
    if (response.ok) {
        return true;
    }
    return response.json();
}


export async function deleteProduct(id: number): Promise<boolean> {
    const response = await fetch(`/api/catalog/${id}`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + getTokenFromLocalStorage()
            }
        });
    return response.ok;
}
 */