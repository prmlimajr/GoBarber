import connection from '../../database/connection';

class ProviderController {
  async index(req, res) {
    let providers = await connection('users')
      .select(
        'users.id',
        'users.name',
        'users.email',
        'users.avatar_id',
        'files.path'
      )
      .join('files', 'files.id', '=', 'users.avatar_id')
      .where({ provider: true });

    providers = providers.map((provider) => {
      return {
        ...provider,
        avatar_url: `http://localhost:3333/files/${provider.path}`,
      };
    });

    return res.json(providers);
  }
}

export default new ProviderController();
