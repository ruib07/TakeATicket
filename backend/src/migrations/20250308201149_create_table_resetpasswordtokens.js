export async function up(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable('resetpasswordtokens', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('token').notNull();
    t.datetime('expirydate').notNull();

    t.uuid('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNull();
  });
}

export function down(knex) {
  return knex.schema.dropTable('resetpasswordtokens');
}
