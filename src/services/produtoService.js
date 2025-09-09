const ProdutoRepository = require("../repositories/produtoRepository");
const { NotFoundError } = require("../utils/errors");

class ProdutoService {
  constructor() {
    this.produtoRepository = new ProdutoRepository();
  }

  async create(data) {
    return await this.produtoRepository.create(data);
  }

  async getAll(options) {
    return await this.produtoRepository.getAll(options);
  }

  async find(id) {
    const produto = await this.produtoRepository.find(id);
    if (!produto) {
      throw new NotFoundError("Produto não encontrado");
    }
    return produto;
  }

  async update(id, data) {
    const produto = await this.produtoRepository.find(id);
    if (!produto) {
      throw new NotFoundError("Produto não encontrado");
    }

    return await this.produtoRepository.update(id, data);
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
