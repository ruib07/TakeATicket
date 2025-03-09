export async function up(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable('tickets', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('title', 80).notNull();
    t.text('description').notNull();
    t.datetime('deadline').notNull();
    t.string('status', 50)
      .notNull()
      .defaultTo('pending');

    t.uuid('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNull();

    t.uuid('admin_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .nullable();

    t.timestamp('created_at').defaultTo(knex.fn.now()).notNull();
    t.timestamp('updated_at').defaultTo(knex.fn.now()).notNull();
  });

  await knex.raw(`
    ALTER TABLE tickets 
    ADD CONSTRAINT check_status 
    CHECK (status IN ('pending', 'accepted', 'rejected', 'completed'))
  `);
}

export function down(knex) {
  return knex.schema.dropTable('tickets');
}
