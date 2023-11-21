import { axiosInstance } from "@/utils/axiosInstance";
import Library from "./index";

async function getCategories() {
    const res = await axiosInstance('/api/book_categories/list')
    return res.data;
}

interface LibraryProps {
    searchParams: any
}

export default async function Page({ searchParams }: LibraryProps) {
    const categories = await getCategories();
    return (
        <>
            <Library categories={categories} searchParams={searchParams} />
        </>
    )
}