exports.up = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.integer('avatar_id').unsigned().references('id').inTable('users');
  });
};

exports.down = function (knex) {};
