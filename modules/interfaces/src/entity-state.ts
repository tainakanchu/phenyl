import { DeleteCommand, IdUpdateCommand, MultiUpdateCommand } from "./command";
import { GeneralEntityMap, NarrowEntity } from "./type-map";
import { IdQuery, IdsQuery, WhereQuery } from "./query";

import { Entity } from "./entity";
import { GeneralUpdateOperation } from "@sp2/format";
import { Key } from "./key";

export type EntityPool<M extends GeneralEntityMap> = {
  [EN in Key<M>]: EntitiesById<NarrowEntity<M, EN>>
};
export type EntitiesById<T extends Entity> = { [id: string]: T };

export interface EntityState<M extends GeneralEntityMap> {
  pool: EntityPool<M>;
}

export interface EntityStateFinder<M extends GeneralEntityMap> {
  find<EN extends Key<M>>(query: WhereQuery<EN>): NarrowEntity<M, EN>[];

  findOne<EN extends Key<M>>(query: WhereQuery<EN>): NarrowEntity<M, EN> | null;

  get<EN extends Key<M>>(query: IdQuery<EN>): NarrowEntity<M, EN>;

  getByIds<EN extends Key<M>>(query: IdsQuery<EN>): NarrowEntity<M, EN>[];

  has<EN extends Key<M>>(query: IdQuery<EN>): boolean;
}

export interface EntityStateUpdater<M extends GeneralEntityMap> {
  register<N extends string>(
    entityName: N,
    ...entities: Array<M[N]>
  ): GeneralUpdateOperation;

  updateById<N extends string>(
    command: IdUpdateCommand<N>
  ): GeneralUpdateOperation;

  updateMulti<N extends string>(
    command: MultiUpdateCommand<N>
  ): GeneralUpdateOperation;

  delete<N extends string>(command: DeleteCommand<N>): GeneralUpdateOperation;
}
