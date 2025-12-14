export enum TipoCliente {
  PADRAO = 'PADRAO',
  PREMIUM = 'PREMIUM',
  VIP = 'VIP'
}

export class Cliente {
  nome: string;
  tipo: TipoCliente;
  pontos: number;
  ultimaAtualizacao: Date;

  constructor(nome: string, tipo: TipoCliente, pontosIniciais: number = 0) {
    this.nome = nome;
    this.tipo = tipo;
    this.pontos = pontosIniciais;
    this.ultimaAtualizacao = new Date();
  }
}

export class SistemaPontos {
  private clientes: Map<string, Cliente>;

  constructor() {
    this.clientes = new Map();
  }

  calcularPontos(cliente: Cliente, valor: number): number {
    if (valor <= 0) {
      return 0;
    }

    let multiplicador = 1;
    switch (cliente.tipo) {
      case TipoCliente.PADRAO:
        multiplicador = 1;
        break;
      case TipoCliente.PREMIUM:
        multiplicador = 1.5;
        break;
      case TipoCliente.VIP:
        multiplicador = 2;
        break;
    }

    const pontos = valor * multiplicador;
    return Math.round(pontos * 100) / 100;
  }

  registrarCompra(cliente: Cliente, valor: number, bonusPercentual: number = 0): void {
    if (valor <= 0) {
      return;
    }

    const pontosBase = this.calcularPontos(cliente, valor);
    const pontosBonus = pontosBase * bonusPercentual;
    const pontosTotais = pontosBase + pontosBonus;

    cliente.pontos = Math.round((cliente.pontos + pontosTotais) * 100) / 100;
    cliente.ultimaAtualizacao = new Date();
    this.clientes.set(cliente.nome, cliente);
  }

  consultarPontos(cliente: Cliente): number {
    const clienteRegistrado = this.clientes.get(cliente.nome);
    if (!clienteRegistrado) {
      throw new Error('Cliente não encontrado no sistema');
    }
    return clienteRegistrado.pontos;
  }

  resgatarPontos(cliente: Cliente, pontos: number): number {
    if (pontos <= 0) {
      return 0;
    }

    const clienteRegistrado = this.clientes.get(cliente.nome) || cliente;
    
    if (clienteRegistrado.pontos < pontos) {
      throw new Error('Saldo de pontos insuficiente');
    }

    clienteRegistrado.pontos -= pontos;
    if (clienteRegistrado.pontos < 0) {
      clienteRegistrado.pontos = 0;
    }

    cliente.pontos = clienteRegistrado.pontos;
    this.clientes.set(clienteRegistrado.nome, clienteRegistrado);

    return pontos * 0.05;
  }

  registrarCliente(nome: string, tipo: TipoCliente, pontosIniciais: number = 0): Cliente {
    const cliente = new Cliente(nome, tipo, pontosIniciais);
    this.clientes.set(nome, cliente);
    return cliente;
  }

  expirarPontos(cliente: Cliente, mesesExpiracao: number): void {
    const agora = new Date();
    const mesesAtras = (agora.getTime() - cliente.ultimaAtualizacao.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (mesesAtras > mesesExpiracao) {
      cliente.pontos = 0;
    }
  }

  calcularTotalPontosLista(clientes: Cliente[]): number {
    return clientes.reduce((total, cliente) => {
      const pontos = this.clientes.get(cliente.nome)?.pontos || cliente.pontos;
      return total + pontos;
    }, 0);
  }

  filtrarClientesPorPontos(clientes: Cliente[], limite: number): Cliente[] {
    return clientes.filter(cliente => {
      const pontos = this.clientes.get(cliente.nome)?.pontos || cliente.pontos;
      return pontos > limite;
    });
  }

  ordenarClientesPorPontos(clientes: Cliente[]): Cliente[] {
    return [...clientes].sort((a, b) => {
      const pontosA = this.clientes.get(a.nome)?.pontos || a.pontos;
      const pontosB = this.clientes.get(b.nome)?.pontos || b.pontos;
      return pontosB - pontosA;
    });
  }

  removerClientesComSaldoZero(clientes: Cliente[]): Cliente[] {
    return clientes.filter(cliente => {
      const pontos = this.clientes.get(cliente.nome)?.pontos || cliente.pontos;
      return pontos > 0;
    });
  }

  buscarClientePorNome(clientes: Cliente[], nome: string): Cliente | null {
    const encontrado = clientes.find(cliente => cliente.nome === nome);
    return encontrado || null;
  }

  somarTotalPontosLista(clientes: Cliente[]): number {
    return this.calcularTotalPontosLista(clientes);
  }
}

