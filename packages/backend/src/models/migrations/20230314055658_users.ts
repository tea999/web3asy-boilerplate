import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable('users') == false) {
        await knex.schema.createTable("users", (table: any) => {
            table.text("id").unique().notNullable();
            table.text("email").nullable();
            table.text("external_id").nullable();
            table.text("type").nullable();
            table.text("password").nullable();
            table.primary(["email", "type"] ,{constraintName:'users_pkey'});
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users')
}