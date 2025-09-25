import type { PageLoad } from "./$types";
import {products} from '$lib/data/products'

export const load: PageLoad = ({params}) => {
    const {id} = params;
    const product = products.find((params) => params.id === id);
    if (!product) {
        throw new Error("Produk tidak ditemukan")
    }
    return { product}
}