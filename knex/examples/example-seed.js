// Seed Users table with 3 users
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
  .then(function () {
    // Inserts seed entries
    return knex('users').insert([
      {
        id: 1,
        email: 'nigel@email.com',
        password: 'dorwssap'
      },
      {
        id: 2,
        email: 'nakaz@email.com',
        password: 'password1'
      },
      {
        id: 3
        email: 'jaywon@email.com',
        password: 'password123'
      }
    ]);
  });
};

// Seed Tasks table with 3 tasks
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('tasks').del()
  .then(function () {
    // Inserts seed entries
    return knex('tasks').insert([
      {
        title: 'Vaccuum the floors',
        description: 'Vaccum the living room and all bedroom',
        is_complete: false,
        user_id: 2
      },
      {
        title: 'Clean the car',
        description: 'Wash, wax and vacuum the car',
        is_complete: false,
        user_id: 1,
      },
      {
        title: 'Buy groceries',
        description: 'Milk, bread, cheese, eggs, flour',
        is_complete: true,
        user_id: 3,
      }
    ]);
  });
};

// Seed Todos with 5 records
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('todos').del();
  await knex('todos').insert([
      { title: 'Buy groceries', is_completed: false },
      { title: 'Finish report', is_completed: false },
      { title: 'Book doctor appointment', is_completed: false },
      { title: 'Clean the house', is_completed: true },
      { title: 'Workout', is_completed: false },
  ]);
};
