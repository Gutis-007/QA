import { Cliente, TipoCliente, SistemaPontos } from '../src/sistema_pontos';

describe('Sistema de Pontos de Fidelidade', () => {
  let sistema: SistemaPontos;

  beforeEach(() => {
    sistema = new SistemaPontos();
  });

  // Teste 1: Calcular pontos para cliente padrão
  test('test_calcular_pontos_compra_cliente_padrao', () => {
    const cliente = new Cliente('João', TipoCliente.PADRAO);
    const pontos = sistema.calcularPontos(cliente, 100);
    expect(pontos).toBe(100);
  });

  // Teste 2: Calcular pontos para cliente Premium
  test('test_calcular_pontos_cliente_premium', () => {
    const cliente = new Cliente('Maria', TipoCliente.PREMIUM);
    const pontos = sistema.calcularPontos(cliente, 100);
    expect(pontos).toBe(150); // 1.5 pontos por real
  });

  // Teste 3: Calcular pontos para cliente VIP
  test('test_calcular_pontos_cliente_vip', () => {
    const cliente = new Cliente('Pedro', TipoCliente.VIP);
    const pontos = sistema.calcularPontos(cliente, 100);
    expect(pontos).toBe(200); // 2 pontos por real
  });

  // Teste 4: Acumular pontos em várias compras
  test('test_acumular_pontos_varias_compras', () => {
    const cliente = new Cliente('Ana', TipoCliente.PADRAO);
    sistema.registrarCompra(cliente, 50);
    sistema.registrarCompra(cliente, 30);
    sistema.registrarCompra(cliente, 20);
    expect(cliente.pontos).toBe(100);
  });

  // Teste 5: Consultar pontos de cliente existente
  test('test_consultar_pontos_cliente_existente', () => {
    const cliente = new Cliente('Carlos', TipoCliente.PADRAO);
    sistema.registrarCompra(cliente, 200);
    const pontos = sistema.consultarPontos(cliente);
    expect(pontos).toBe(200);
  });

  // Teste 6: Resgatar pontos para desconto
  test('test_resgatar_pontos_para_desconto', () => {
    const cliente = new Cliente('Lucia', TipoCliente.PADRAO);
    sistema.registrarCompra(cliente, 1000); // 1000 pontos
    const desconto = sistema.resgatarPontos(cliente, 100); // Resgata 100 pontos
    expect(desconto).toBe(5); // 100 pontos * R$0.05 = R$5.00
    expect(cliente.pontos).toBe(900);
  });

  // Teste 7: Impedir resgate com saldo insuficiente
  test('test_impedir_resgate_com_saldo_insuficiente', () => {
    const cliente = new Cliente('Paulo', TipoCliente.PADRAO);
    sistema.registrarCompra(cliente, 100); // 100 pontos
    expect(() => {
      sistema.resgatarPontos(cliente, 150); // Tenta resgatar mais do que tem
    }).toThrow('Saldo de pontos insuficiente');
    expect(cliente.pontos).toBe(100); // Pontos não devem mudar
  });

  // Teste 8: Resgatar todos os pontos disponíveis
  test('test_resgatar_todos_os_pontos_disponiveis', () => {
    const cliente = new Cliente('Fernanda', TipoCliente.PADRAO);
    sistema.registrarCompra(cliente, 500); // 500 pontos
    const desconto = sistema.resgatarPontos(cliente, 500);
    expect(desconto).toBe(25); // 500 * 0.05 = 25
    expect(cliente.pontos).toBe(0);
  });

  // Teste adicional: Resgatar pontos com valor zero ou negativo
  test('test_resgatar_pontos_zero_ou_negativo', () => {
    const cliente = new Cliente('Teste', TipoCliente.PADRAO);
    sistema.registrarCompra(cliente, 100);
    const descontoZero = sistema.resgatarPontos(cliente, 0);
    const descontoNegativo = sistema.resgatarPontos(cliente, -10);
    expect(descontoZero).toBe(0);
    expect(descontoNegativo).toBe(0);
    expect(cliente.pontos).toBe(100); // Pontos não devem mudar
  });

  // Teste 9: Não gerar pontos para valor zero
  test('test_nao_gerar_pontos_para_valor_zero', () => {
    const cliente = new Cliente('Roberto', TipoCliente.PADRAO);
    sistema.registrarCompra(cliente, 0);
    expect(cliente.pontos).toBe(0);
  });

  // Teste 10: Gerar pontos para valores decimais
  test('test_gerar_pontos_para_valores_decimais', () => {
    const cliente = new Cliente('Sandra', TipoCliente.PADRAO);
    sistema.registrarCompra(cliente, 99.99);
    expect(cliente.pontos).toBeCloseTo(99.99, 2);
  });

  // Teste 11: Não permitir pontos negativos
  test('test_nao_permitir_pontos_negativos', () => {
    const cliente = new Cliente('Marcos', TipoCliente.PADRAO);
    sistema.registrarCompra(cliente, 100);
    sistema.resgatarPontos(cliente, 100);
    expect(() => {
      sistema.resgatarPontos(cliente, 1);
    }).toThrow('Saldo de pontos insuficiente');
    expect(cliente.pontos).toBe(0);
  });

  // Teste 12: Cliente inexistente lança exceção
  test('test_cliente_inexistente_lanca_excecao', () => {
    const clienteNaoRegistrado = new Cliente('NaoRegistrado', TipoCliente.PADRAO);
    expect(() => {
      sistema.consultarPontos(clienteNaoRegistrado);
    }).toThrow('Cliente não encontrado no sistema');
  });

  // Teste 13: Registrar novo cliente com pontos iniciais
  test('test_registrar_novo_cliente_com_pontos_iniciais', () => {
    const cliente = sistema.registrarCliente('NovoCliente', TipoCliente.PADRAO, 50);
    expect(cliente.pontos).toBe(50);
    expect(sistema.consultarPontos(cliente)).toBe(50);
  });

  // Teste 14: Aplicar bônus promocional em compra
  test('test_aplicar_bonus_promocional_em_compra', () => {
    const cliente = new Cliente('Bonus', TipoCliente.PADRAO);
    sistema.registrarCompra(cliente, 100, 0.1); // 10% de bônus
    // 100 pontos base + 10 pontos de bônus = 110 pontos
    expect(cliente.pontos).toBe(110);
  });

  // Teste 15: Expirar pontos antigos após período
  test('test_expirar_pontos_antigos_apos_periodo', () => {
    const cliente = new Cliente('Expira', TipoCliente.PADRAO);
    sistema.registrarCompra(cliente, 100);
    const dataAntiga = new Date();
    dataAntiga.setMonth(dataAntiga.getMonth() - 13); // 13 meses atrás
    cliente.ultimaAtualizacao = dataAntiga;
    sistema.expirarPontos(cliente, 12); // Expira após 12 meses
    expect(cliente.pontos).toBe(0);
  });

  // Teste 16: Registrar vários clientes em lista
  test('test_registrar_varios_clientes_em_lista', () => {
    const clientes: Cliente[] = [];
    clientes.push(new Cliente('Cliente1', TipoCliente.PADRAO));
    clientes.push(new Cliente('Cliente2', TipoCliente.PREMIUM));
    clientes.push(new Cliente('Cliente3', TipoCliente.VIP));
    expect(clientes.length).toBe(3);
  });

  // Teste 17: Calcular pontos para todos os clientes de uma lista
  test('test_calcular_pontos_lista_clientes', () => {
    const clientes = [
      new Cliente('C1', TipoCliente.PADRAO),
      new Cliente('C2', TipoCliente.PREMIUM),
      new Cliente('C3', TipoCliente.VIP)
    ];
    clientes.forEach(cliente => sistema.registrarCompra(cliente, 100));
    const total = sistema.calcularTotalPontosLista(clientes);
    expect(total).toBe(450); // 100 + 150 + 200
  });

  // Teste 18: Filtrar clientes com pontos acima de limite
  test('test_filtrar_clientes_com_pontos_acima_de_limite', () => {
    const clientes = [
      new Cliente('C1', TipoCliente.PADRAO),
      new Cliente('C2', TipoCliente.PADRAO),
      new Cliente('C3', TipoCliente.PADRAO)
    ];
    sistema.registrarCompra(clientes[0], 50);
    sistema.registrarCompra(clientes[1], 150);
    sistema.registrarCompra(clientes[2], 200);
    const filtrados = sistema.filtrarClientesPorPontos(clientes, 100);
    expect(filtrados.length).toBe(2);
    expect(filtrados).toContain(clientes[1]);
    expect(filtrados).toContain(clientes[2]);
  });

  // Teste 19: Ordenar clientes por pontos
  test('test_ordenar_clientes_por_pontos', () => {
    const clientes = [
      new Cliente('C1', TipoCliente.PADRAO),
      new Cliente('C2', TipoCliente.PADRAO),
      new Cliente('C3', TipoCliente.PADRAO)
    ];
    sistema.registrarCompra(clientes[0], 300);
    sistema.registrarCompra(clientes[1], 100);
    sistema.registrarCompra(clientes[2], 200);
    const ordenados = sistema.ordenarClientesPorPontos(clientes);
    expect(ordenados[0].pontos).toBe(300);
    expect(ordenados[1].pontos).toBe(200);
    expect(ordenados[2].pontos).toBe(100);
  });

  // Teste 20: Remover clientes com saldo zero
  test('test_remover_clientes_com_saldo_zero', () => {
    const clientes = [
      new Cliente('C1', TipoCliente.PADRAO),
      new Cliente('C2', TipoCliente.PADRAO),
      new Cliente('C3', TipoCliente.PADRAO)
    ];
    sistema.registrarCompra(clientes[0], 100);
    sistema.registrarCompra(clientes[1], 0);
    sistema.registrarCompra(clientes[2], 50);
    sistema.resgatarPontos(clientes[2], 50);
    const semZeros = sistema.removerClientesComSaldoZero(clientes);
    expect(semZeros.length).toBe(1);
    expect(semZeros[0].pontos).toBe(100);
  });

  // Teste 21: Buscar cliente por nome
  test('test_buscar_cliente_por_nome', () => {
    const clientes = [
      new Cliente('João', TipoCliente.PADRAO),
      new Cliente('Maria', TipoCliente.PREMIUM),
      new Cliente('Pedro', TipoCliente.VIP)
    ];
    const encontrado = sistema.buscarClientePorNome(clientes, 'Maria');
    expect(encontrado).not.toBeNull();
    expect(encontrado?.nome).toBe('Maria');
    expect(encontrado?.tipo).toBe(TipoCliente.PREMIUM);
  });

  // Teste 22: Somar total de pontos de todos os clientes
  test('test_somar_total_pontos_lista', () => {
    const clientes = [
      new Cliente('C1', TipoCliente.PADRAO),
      new Cliente('C2', TipoCliente.PREMIUM),
      new Cliente('C3', TipoCliente.VIP)
    ];
    sistema.registrarCompra(clientes[0], 100);
    sistema.registrarCompra(clientes[1], 100);
    sistema.registrarCompra(clientes[2], 100);
    const total = sistema.somarTotalPontosLista(clientes);
    expect(total).toBe(450); // 100 + 150 + 200
  });
});

