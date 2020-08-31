import connection from '../../database/connection';

class ProviderController {
  async index(req, res) {
    const { page = 1 } = req.query;

    let query = await connection('users')
      .select(
        'users.id',
        'users.name',
        'users.email',
        'users.avatar_id',
        'files.path'
      )
      .limit(5)
      .offset((page - 1) * 5)
      .leftJoin('files', 'files.id', '=', 'users.avatar_id')
      .where({ provider: true });

    const rows = await query;

    const providers = [];
    for (let row of rows) {
      const provider = {
        id: row.id,
        name: row.name,
        email: row.email,
        path: row.path,
        avatar_url: row.path ? `http://localhost:3333/files/${row.path}` : null,
      };

      providers.push(provider);
    }

    return res.json(providers);
  }
}

export default new ProviderController();
