import { type IDataCrud, Paginated, PaginationOptions } from "@chapelure/api/crud";
import { type FilterGroup } from "@chapelure/api/filters";
import { filterGroupToPocketBase } from "@chapelure/api/pocketbase.filters";
import type { BaseSystemFields, TypedPocketBase } from '@shared/types.g.ts';
import PocketBase from 'pocketbase';

let pb: TypedPocketBase | null;
export function initDatabase(url: string) {
    if (!pb) {
        pb = new PocketBase(url) as TypedPocketBase;
    }
}

export function usePocketBase() {
    function getPb(): TypedPocketBase {
        if (!pb)
            throw new Error("PocketBase is not initialized. Call init(url) first.");
        return pb;
    }

    return {
        pb: getPb(),
    }
}

export class PocketbaseCrud<TResponse extends BaseSystemFields> implements IDataCrud<TResponse> {

    protected get collection() {
        const { pb } = usePocketBase();
        return pb.collection(this.collectionName);
    }

    constructor(
        protected readonly collectionName: string,
        protected readonly expands: string[] | undefined = undefined,
    ) { }

    async create(data: TResponse): Promise<TResponse> {
        return await this.collection.create<TResponse>(data, { expand: this.expands?.join(",") });
    }

    async update(id: string, data: Partial<TResponse>): Promise<TResponse> {
        return await this.collection.update<TResponse>(id, data, { expand: this.expands?.join(",") });
    }

    async delete(id: string): Promise<void> {
        await this.collection.delete(id);
    }

    async getById(id: string): Promise<TResponse | null> {
        return await this.collection.getOne<TResponse>(id, { expand: this.expands?.join(",") });
    }

    async getAll(): Promise<TResponse[]> {
        return await this.collection.getFullList<TResponse>({
            expand: this.expands?.join(",")
        });
    }

    async getList(options: PaginationOptions): Promise<Paginated<TResponse>> {
        const result = await this.collection.getList<TResponse>(options.page, options.perPage, {
            expand: this.expands?.join(","),
            sort: options.sortBy ? `${options.sortDirection}${options.sortBy}` : undefined,
        });

        return new Paginated<TResponse>(result.items, result.totalItems, options);
    }

    async filter(group: FilterGroup<TResponse>, options: PaginationOptions): Promise<Paginated<TResponse>> {
        const filter = filterGroupToPocketBase(group);
        const result = await this.collection.getList<TResponse>(options.page, options.perPage, {
            expand: this.expands?.join(","),
            sort: options.sortBy ? `${options.sortDirection}${options.sortBy}` : undefined,
            filter: filter || undefined,
        });
        return new Paginated<TResponse>(result.items, result.totalItems, options);
    }
}