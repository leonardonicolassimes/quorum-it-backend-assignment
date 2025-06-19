/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1680000000000 implements MigrationInterface {
  private readonly logger = new Logger(InitialSchema1680000000000.name);
  name = 'InitialSchema1680000000000';

  private async createTableIfNotExists(
    queryRunner: QueryRunner,
    tableName: string,
    schemaDefinition: string,
  ): Promise<void> {
    const tableExists = await queryRunner.hasTable(tableName);
    if (!tableExists) {
      await queryRunner.query(
        `CREATE TABLE "${tableName}" (${schemaDefinition})`,
      );
      this.logger.log(`Table ${tableName} created successfully`);
    } else {
      this.logger.log(`Table ${tableName} already exists, skipping`);
    }
  }

  private async addConstraintIfNotExists(
    queryRunner: QueryRunner,
    table: string,
    constraintName: string,
    sql: string,
  ): Promise<void> {
    const constraintExists = await queryRunner.query(
      `SELECT 1 FROM pg_constraint WHERE conname = $1`,
      [constraintName],
    );

    if (!constraintExists?.length) {
      await queryRunner.query(sql);
      this.logger.log(`Constraint ${constraintName} added successfully`);
    } else {
      this.logger.log(`Constraint ${constraintName} already exists, skipping`);
    }
  }

  private async dropConstraintIfExists(
    queryRunner: QueryRunner,
    table: string,
    constraintName: string,
  ): Promise<void> {
    const constraintExists = await queryRunner.query(
      `SELECT 1 FROM pg_constraint WHERE conname = $1`,
      [constraintName],
    );

    if (constraintExists?.length) {
      await queryRunner.query(
        `ALTER TABLE "${table}" DROP CONSTRAINT "${constraintName}"`,
      );
      this.logger.log(`Constraint ${constraintName} dropped successfully`);
    } else {
      this.logger.log(`Constraint ${constraintName} doesn't exist, skipping`);
    }
  }

  private async dropTableIfExists(
    queryRunner: QueryRunner,
    tableName: string,
  ): Promise<void> {
    const tableExists = await queryRunner.hasTable(tableName);
    if (tableExists) {
      await queryRunner.query(`DROP TABLE "${tableName}"`);
      this.logger.log(`Table ${tableName} dropped successfully`);
    } else {
      this.logger.log(`Table ${tableName} doesn't exist, skipping`);
    }
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await this.createTableIfNotExists(
        queryRunner,
        'permissions',
        `
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "createdat" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedat" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedat" TIMESTAMP,
        CONSTRAINT "permissions_pk" PRIMARY KEY ("id")
      `,
      );

      await this.createTableIfNotExists(
        queryRunner,
        'roles',
        `
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "createdat" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedat" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedat" TIMESTAMP,
        CONSTRAINT "roles_pk" PRIMARY KEY ("id")
      `,
      );

      await this.createTableIfNotExists(
        queryRunner,
        'users',
        `
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "createdat" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedat" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedat" TIMESTAMP,
        CONSTRAINT "users_pk" PRIMARY KEY ("id")
      `,
      );

      await this.createTableIfNotExists(
        queryRunner,
        'roles_permissions',
        `
        "id" SERIAL NOT NULL,
        "role" integer,
        "permission" integer,
        "createdat" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedat" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedat" TIMESTAMP,
        CONSTRAINT "roles_permissions_pkey" PRIMARY KEY ("id")
      `,
      );

      await this.createTableIfNotExists(
        queryRunner,
        'users_permissions',
        `
        "id" SERIAL NOT NULL,
        "user" integer,
        "permission" integer,
        "createdat" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedat" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedat" TIMESTAMP,
        CONSTRAINT "users_permissions_pkey" PRIMARY KEY ("id")
      `,
      );

      await this.createTableIfNotExists(
        queryRunner,
        'users_roles',
        `
        "id" SERIAL NOT NULL,
        "user" integer,
        "role" integer,
        "createdat" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedat" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedat" TIMESTAMP,
        CONSTRAINT "users_roles_pkey" PRIMARY KEY ("id")
      `,
      );

      await this.addConstraintIfNotExists(
        queryRunner,
        'roles_permissions',
        'roles_permissions_permissions_fk',
        `ALTER TABLE "roles_permissions"
         ADD CONSTRAINT "roles_permissions_permissions_fk"
         FOREIGN KEY ("permission") REFERENCES "permissions"("id")
         ON DELETE CASCADE ON UPDATE CASCADE`,
      );

      await this.addConstraintIfNotExists(
        queryRunner,
        'roles_permissions',
        'roles_permissions_roles_fk',
        `ALTER TABLE "roles_permissions"
         ADD CONSTRAINT "roles_permissions_roles_fk"
         FOREIGN KEY ("role") REFERENCES "roles"("id")
         ON DELETE CASCADE ON UPDATE CASCADE`,
      );

      await this.addConstraintIfNotExists(
        queryRunner,
        'users_permissions',
        'users_permissions_permissions_fk',
        `ALTER TABLE "users_permissions"
         ADD CONSTRAINT "users_permissions_permissions_fk"
         FOREIGN KEY ("permission") REFERENCES "permissions"("id")
         ON DELETE CASCADE ON UPDATE CASCADE`,
      );

      await this.addConstraintIfNotExists(
        queryRunner,
        'users_permissions',
        'users_permissions_users_fk',
        `ALTER TABLE "users_permissions"
         ADD CONSTRAINT "users_permissions_users_fk"
         FOREIGN KEY ("user") REFERENCES "users"("id")
         ON DELETE CASCADE ON UPDATE CASCADE`,
      );

      await this.addConstraintIfNotExists(
        queryRunner,
        'users_roles',
        'users_role_role_fk',
        `ALTER TABLE "users_roles"
         ADD CONSTRAINT "users_role_role_fk"
         FOREIGN KEY ("role") REFERENCES "roles"("id")
         ON DELETE CASCADE ON UPDATE CASCADE`,
      );

      await this.addConstraintIfNotExists(
        queryRunner,
        'users_roles',
        'users_role_users_fk',
        `ALTER TABLE "users_roles"
         ADD CONSTRAINT "users_role_users_fk"
         FOREIGN KEY ("user") REFERENCES "users"("id")
         ON DELETE CASCADE ON UPDATE CASCADE`,
      );
    } catch (error) {
      this.logger.error('Migration failed:', error);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await this.dropConstraintIfExists(
        queryRunner,
        'users_roles',
        'users_role_users_fk',
      );
      await this.dropConstraintIfExists(
        queryRunner,
        'users_roles',
        'users_role_role_fk',
      );
      await this.dropConstraintIfExists(
        queryRunner,
        'users_permissions',
        'users_permissions_users_fk',
      );
      await this.dropConstraintIfExists(
        queryRunner,
        'users_permissions',
        'users_permissions_permissions_fk',
      );
      await this.dropConstraintIfExists(
        queryRunner,
        'roles_permissions',
        'roles_permissions_roles_fk',
      );
      await this.dropConstraintIfExists(
        queryRunner,
        'roles_permissions',
        'roles_permissions_permissions_fk',
      );

      await this.dropTableIfExists(queryRunner, 'users_roles');
      await this.dropTableIfExists(queryRunner, 'users_permissions');
      await this.dropTableIfExists(queryRunner, 'roles_permissions');
      await this.dropTableIfExists(queryRunner, 'users');
      await this.dropTableIfExists(queryRunner, 'roles');
      await this.dropTableIfExists(queryRunner, 'permissions');
    } catch (error) {
      this.logger.error('Migration revert failed:', error);
      throw error;
    }
  }
}
