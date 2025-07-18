export type UserType = {
    name: string;
    email: string;
    password: string;
}

export type ProductType = {
    _id?: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    color: string[];
    size: string[];
    category: string;
    stock: number;
    rating?: number;
    numReviews?: number;
    isFeatured?: boolean;
    brand?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type OrderType = {
    user: string,
    products: {
        product: string,
        quantity: number,
    }[],
    totalAmount: number,
    address: string,
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
    note?: string,
    createdAt: Date,
    updatedAt: Date,
}

export type CartType = {
    user: string,
    products: {
        product: string,
        quantity: number,
    }[],
    subTotal: number,
    createdAt: Date,
}


export type WishListType = {
    user: string,
    products: {
        product: string
    }[],
    createdAt: Date,
}

export type AddressType = {
    user: string,
    street: string,
    city: string,
    phone: string,
    zilla: string,
    zipCode: string,
    country: string,
    createdAt: string
}