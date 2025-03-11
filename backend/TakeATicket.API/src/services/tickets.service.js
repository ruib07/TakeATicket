import ValidationError from '../errors/validationError.js';

export const ticketsService = (app) => {
  const findAll = (filter = {}) => app.db('tickets').where(filter);

  const find = (filter = {}) => app.db('tickets').where(filter).first();

  const save = (newTicket) => {
    if (!newTicket.title) throw new ValidationError('Title is required!');
    if (!newTicket.description) throw new ValidationError('Description is required!');
    if (!newTicket.deadline) throw new ValidationError('Deadline is required!');
    if (!newTicket.status) throw new ValidationError('Status is required!');

    return app.db('tickets').insert(newTicket, '*');
  };

  const update = (id, ticketRes) => app.db('tickets')
    .where({ id })
    .update(ticketRes, '*');

  const remove = (id) => app.db('tickets')
    .where({ id })
    .del();

  return {
    findAll,
    find,
    save,
    update,
    remove,
  };
};