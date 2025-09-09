const ProdutoRepository = require("../repositories/produtoRepository");
const { NotFoundError } = require("../utils/errors");

class ProdutoService {
  constructor() {
    this.produtoRepository = new ProdutoRepository();
  }

  async create(req) {
    return await this.produtoRepository.create(req.body);
  }

  async getAll(req) {
    const searchFields = ["nome"];
    return await this.produtoRepository.getAll({ ...req.body, searchFields });
  }

  async find(id) {
    const produto = await this.produtoRepository.find(id);
    if (!produto) {
      throw new NotFoundError("Produto não encontrado");
    }
    return produto;
  }

  async update(id, req) {
    const produto = await this.produtoRepository.find(id);
    if (!produto) {
      throw new NotFoundError("Produto não encontrado");
    }

    return await this.produtoRepository.update(id, req.body);
  }

  async delete(id) {
    const produto = await this.produtoRepository.find(id);
    if (!produto) {
      throw new NotFoundError("Produto não encontrado");
    }

    return await this.produtoRepository.delete(id);
  }
}

module.exports = ProdutoService;
