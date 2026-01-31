import { Document, Model } from 'mongoose';
import logger from '../config/logger';

export abstract class BaseRepository<T, TModel extends Document> {
  protected model: Model<TModel>;
  protected entityName: string;

  constructor(model: Model<TModel>, entityName: string) {
    this.model = model;
    this.entityName = entityName;
  }

  protected transformId(doc: TModel): T {
    const { _id, ...rest } = doc.toObject();
    return { ...rest, id: _id.toString() } as T;
  }

  async getAll(
    filters: Record<string, unknown> = {},
    pagination: { skip: number; limit: number } = { skip: 0, limit: 0 }
  ): Promise<T[]> {
    logger.debug(
      `Repository: Finding ${this.entityName} with filters: ${JSON.stringify(
        filters
      )} and pagination: ${JSON.stringify(pagination)}`
    );
    const docs = await this.model.find(filters, {}, pagination);
    logger.debug(`Repository: Found ${docs.length} ${this.entityName}`);
    return docs.map((doc: Document) => this.transformId(doc));
  }

  async getById(id: string): Promise<T | null> {
    logger.debug(`Repository: Fetching ${this.entityName} by id: ${id}`);
    const doc = await this.model.findById(id);
    if (!doc) {
      logger.debug(`Repository: No ${this.entityName} found with id: ${id}`);
      return null;
    }
    logger.debug(`Repository: ${this.entityName} with id ${id} fetched`);
    return this.transformId(doc);
  }

  async delete(id: string): Promise<T | null> {
    logger.debug(`Repository: Deleting ${this.entityName} with id: ${id}`);
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) {
      logger.warn(
        `Repository: No ${this.entityName} found to delete with id: ${id}`
      );
      return null;
    }
    logger.debug(`Repository: ${this.entityName} with id ${id} deleted`);
    return this.transformId(doc);
  }

  async create(data: Partial<TModel>): Promise<T | null> {
    logger.debug(
      `Repository: Creating ${this.entityName} with data: ${JSON.stringify(
        data
      )}`
    );
    const doc = await this.model.create(data);
    if (!doc) {
      logger.debug(`Repository: ${this.entityName} creation returned null`);
      return null;
    }
    logger.debug(`Repository: ${this.entityName} created`);
    return this.transformId(doc);
  }

  async update(id: string, data: Partial<TModel>): Promise<T | null> {
    logger.debug(
      `Repository: Updating ${
        this.entityName
      } with id: ${id} and data: ${JSON.stringify(data)}`
    );
    const doc = await this.model.findByIdAndUpdate(id, data, { new: true });
    if (!doc) {
      logger.debug(
        `Repository: No ${this.entityName} found to update with id: ${id}`
      );
      return null;
    }
    logger.debug(`Repository: ${this.entityName} with id ${id} updated`);
    return this.transformId(doc);
  }
}
