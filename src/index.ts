import { SistemaPontos, Cliente, TipoCliente } from './sistema_pontos';

const sistema = new SistemaPontos();

const cliente1 = sistema.registrarCliente('João Silva', TipoCliente.PADRAO);
const cliente2 = sistema.registrarCliente('Maria Santos', TipoCliente.PREMIUM);
const cliente3 = sistema.registrarCliente('Pedro Costa', TipoCliente.VIP);

sistema.registrarCompra(cliente1, 100);
sistema.registrarCompra(cliente2, 100);
sistema.registrarCompra(cliente3, 100);

console.log(`${cliente1.nome} tem ${sistema.consultarPontos(cliente1)} pontos`);
console.log(`${cliente2.nome} tem ${sistema.consultarPontos(cliente2)} pontos`);
console.log(`${cliente3.nome} tem ${sistema.consultarPontos(cliente3)} pontos`);

const desconto = sistema.resgatarPontos(cliente1, 50);
console.log(`${cliente1.nome} resgatou 50 pontos e ganhou R$${desconto.toFixed(2)} de desconto`);

const listaClientes = [cliente1, cliente2, cliente3];

const clientesComMaisPontos = sistema.filtrarClientesPorPontos(listaClientes, 100);
console.log(`Clientes com mais de 100 pontos: ${clientesComMaisPontos.length}`);

const ranking = sistema.ordenarClientesPorPontos(listaClientes);
console.log('Ranking de clientes por pontos:');
ranking.forEach((cliente, index) => {
  console.log(`${index + 1}. ${cliente.nome} - ${cliente.pontos} pontos`);
});

const total = sistema.somarTotalPontosLista(listaClientes);
console.log(`Total de pontos de todos os clientes: ${total}`);

