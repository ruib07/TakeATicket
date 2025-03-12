export async function up(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable("users", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.string("name", 60).notNull();
    t.string("email", 100).notNull().unique();
    t.string("password", 100).notNull();
    t.string("role", 50).notNull().defaultTo("user");
    t.timestamp("created_at").defaultTo(knex.fn.now()).notNull();
  });

  await knex.raw(`
    ALTER TABLE users 
    ADD CONSTRAINT check_role 
    CHECK (role IN ('admin', 'user'))
  `);
}

export function down(knex) {
  return knex.schema.dropTable("users");
}
