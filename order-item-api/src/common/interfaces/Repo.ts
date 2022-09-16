export interface Repo<T> {
    exists(t: T): Promise<boolean>;
    save(t: T);
    delete(t: T);
    update(t: T);
}