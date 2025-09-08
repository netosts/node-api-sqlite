const BaseService = require("./baseService");
const ProdutoRepository = require("../repositories/produtoRepository");
const ProdutoValidator = require("../validators/produtoValidator");
const {
  ValidationError,
  NotFoundError,
  BadRequestError,
} = require("../utils/errors");

/**
 * Serviço para regras de negócio relacionadas a produtos
 */
class ProdutoService extends BaseService {
  constructor() {
    super(new ProdutoRepository(), ProdutoValidator);
  }

  /**
   * Criar um novo produto
   * @param {Object} produtoData - Dados do produto
   * @returns {Promise} - Promise com o resultado da operação
   */
  async create(produtoData) {
    // Validar dados
    const validation = this.validator.validateCreate({ body: produtoData });
    if (!validation.isValid) {
      throw new ValidationError(validation.error.message);
    }

    // Aplicar regras de negócio específicas
    const dadosProcessados = this.processProductData(validation.data);

    // Criar produto
    return await this.repository.create(dadosProcessados);
  }

  /**
   * Atualizar produto por ID
   * @param {number} id - ID do produto
   * @param {Object} produtoData - Dados atualizados do produto
   * @returns {Promise} - Promise com o resultado da operação
   */
  async update(id, produtoData) {
    // Validar dados
    const validation = this.validator.validateUpdate({
      params: { id },
      body: produtoData,
    });
    if (!validation.isValid) {
      throw new ValidationError(validation.error.message);
    }

    const { id: validatedId, ...updateData } = validation.data;

    // Verificar se produto existe
    const produtoExistente = await this.repository.findById(validatedId);
    if (!produtoExistente) {
      throw new NotFoundError("Produto não encontrado");
    }

    // Aplicar regras de negócio específicas
    const dadosProcessados = this.processProductData(updateData);

    // Atualizar produto
    return await this.repository.update(validatedId, dadosProcessados);
  }

  /**
   * Processar dados do produto aplicando regras de negócio
   * @param {Object} data - Dados do produto
   * @returns {Object} - Dados processados
   */
  processProductData(data) {
    const processedData = { ...data };

    // Regra de negócio: preço não pode ser negativo
    if (processedData.preco !== undefined && processedData.preco < 0) {
      throw new BadRequestError("Preço não pode ser negativo");
    }

    // Regra de negócio: estoque não pode ser negativo
    if (processedData.estoque !== undefined && processedData.estoque < 0) {
      throw new BadRequestError("Estoque não pode ser negativo");
    }

    // Regra de negócio: formatar preço com 2 casas decimais
    if (processedData.preco !== undefined) {
      processedData.preco = parseFloat(processedData.preco.toFixed(2));
    }

    return processedData;
  }

  /**
   * Buscar produtos com estoque baixo
   * @param {number} limite - Limite mínimo de estoque
   * @returns {Promise} - Promise com os produtos encontrados
   */
  async findWithLowStock(limite = 5) {
    if (limite < 0) {
      throw new BadRequestError("Limite deve ser um número positivo");
    }

    return await this.repository.findWithLowStock(limite);
  }

  /**
   * Atualizar estoque de um produto
   * @param {number} id - ID do produto
   * @param {number} quantidade - Nova quantidade em estoque
   * @returns {Promise} - Promise com o resultado da operação
   */
  async updateStock(id, quantidade) {
    if (quantidade < 0) {
      throw new BadRequestError("Quantidade em estoque não pode ser negativa");
    }

    // Verificar se produto existe
    const produto = await this.repository.findById(id);
    if (!produto) {
      throw new NotFoundError("Produto não encontrado");
    }

    return await this.repository.updateStock(id, quantidade);
  }

  /**
   * Verificar disponibilidade de estoque
   * @param {number} id - ID do produto
   * @param {number} quantidade - Quantidade desejada
   * @returns {Promise<boolean>} - Promise com resultado da verificação
   */
  async checkStockAvailability(id, quantidade) {
    const produto = await this.repository.findById(id);
    if (!produto) {
      return false;
    }

    return produto.estoque >= quantidade;
  }

  /**
   * Verificar se um produto pode ser deletado
   * @param {number} id - ID do produto
   * @returns {Promise<boolean>} - Promise com resultado da verificação
   */
  async canDelete(id) {
    // Aqui você pode adicionar regras de negócio específicas
    // Por exemplo, verificar se o produto está em pedidos pendentes

    const produto = await this.repository.findById(id);
    if (!produto) {
      return false;
    }

    // Adicione aqui verificações de relacionamentos
    // Por exemplo: verificar se há pedidos pendentes, etc.

    return true;
  }

  /**
   * Deletar produto por ID
   * @param {number} id - ID do produto
   * @returns {Promise} - Promise com o resultado da operação
   */
  async delete(id) {
    // Validar ID
    const validation = this.validator.validateDelete({ params: { id } });
    if (!validation.isValid) {
      throw new ValidationError(validation.error.message);
    }

    // Verificar se pode deletar
    const canDelete = await this.canDelete(validation.data.id);
    if (!canDelete) {
      throw new BadRequestError(
        "Produto não encontrado ou não pode ser deletado"
      );
    }

    // Deletar produto
    return await this.repository.delete(validation.data.id);
  }
}

module.exports = ProdutoService;
