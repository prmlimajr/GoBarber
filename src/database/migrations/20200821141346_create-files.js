exports.up = function (knex) {
  return knex.schema.createTable('files', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('path').notNullable().unique();
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {};
