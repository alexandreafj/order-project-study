export interface Repo<T> {
    exists(t: T): Promise<boolean>;
    save(t: T);
    update(t: T);
}