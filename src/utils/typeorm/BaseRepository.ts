import {
    AbstractRepository,
    EntityManager,
    ObjectLiteral
} from 'typeorm';
import {
    getEntityManagerOrTransactionManager,
} from 'typeorm-transactional-cls-hooked';

export class BaseRepository<T extends ObjectLiteral> extends AbstractRepository<T> {

    private $manager?: EntityManager;

    // @ts-ignore
    get manager() {
        return getEntityManagerOrTransactionManager(
            'default',
            this.$manager,
        );
    }

    set(manager?: EntityManager) {
        this.$manager = manager;
    }
}