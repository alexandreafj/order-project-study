export interface Repo<T> {
    exists(t: T): Promise<boolean>;
    save(t: T): Promise<T>;
    delete(t: T): Promise<T>;
    update(t: T): Promise<T>;
}