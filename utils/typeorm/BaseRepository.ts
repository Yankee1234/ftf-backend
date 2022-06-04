import {
    AbstractRepository,
    EntityManager,
    ObjectLiteral /* , ObjectType, Repository */,
} from 'typeorm';
import {
    getEntityManagerOrTransactionManager,
    // BaseRepository as BaseTransactionalClsRepository,
} from 'typeorm-transactional-cls-hooked';

/* export class BaseRepository<
    Entity extends ObjectLiteral
> extends BaseTransactionalClsRepository<Entity> {
    get repository(): Repository<Entity> {
        return this;
    }

    protected getRepositoryFor<T>(entity: ObjectType<T>): Repository<T> {
        return this.manager.getRepository(entity);
    }
} */

export class BaseRepository<T extends ObjectLiteral> extends AbstractRepository<T> {
    private $connectionName?: string;

    private $manager?: EntityManager;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    get manager() {
        return getEntityManagerOrTransactionManager(
            this.$connectionName ?? 'default',
            this.$manager,
        );
    }

    set(manager?: EntityManager) {
        this.$manager = manager;
        this.$connectionName = manager?.connection?.name;
    }
}