export interface Mapper<T> {
    toDomain(raw: any): T;
    toPersistance(t: T): T;
    toDTO(t: T): T;
}