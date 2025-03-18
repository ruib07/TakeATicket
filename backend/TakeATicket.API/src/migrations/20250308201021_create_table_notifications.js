export async function up(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable("notifications", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

    t.uuid("ticket_id")
      .references("id")
      .inTable("tickets")
      .onDelete("CASCADE")
      .notNull();

    t.uuid("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .notNull();

    t.uuid("admin_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .notNull();

    t.string("content").notNull();
    t.string("status", 50).notNull().defaultTo("unread");
    t.timestamp("created_at").defaultTo(knex.fn.now()).notNull();
  });

  await knex.raw(`
    ALTER TABLE notifications 
    ADD CONSTRAINT check_status 
    CHECK (status IN ('unread', 'read'))
  `);
}

export function down(knex) {
  return knex.schema.dropTable("notifications");
}
