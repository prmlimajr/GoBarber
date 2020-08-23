exports.up = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table
      .integer('avatar_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');
  });
};

exports.down = function (knex) {};
