# Sistema de Pontos de Fidelidade - TDD

Projeto desenvolvido para a disciplina de Qualidade de Software, aplicando Test-Driven Development (TDD) na camada de negócio.

## Descrição

Sistema simples de gerenciamento de pontos de fidelidade baseado em compras. O sistema calcula e gerencia pontos de clientes de acordo com regras de negócio específicas.

## Regras de Negócio

### Cálculo de Pontos por Categoria:
- **Cliente Padrão**: 1 ponto por R$1,00 gasto
- **Cliente Premium**: 1,5 pontos por R$1,00 gasto
- **Cliente VIP**: 2 pontos por R$1,00 gasto

### Funcionalidades:
- Registrar compra e atualizar pontos do cliente
- Consultar total de pontos de um cliente
- Resgatar pontos para desconto (1 ponto = R$0,05)
- Operações em listas: adicionar, filtrar, ordenar, remover, buscar

## Estrutura do Projeto

```
QA/
├── src/
│   └── sistema_pontos.ts    # Implementação do sistema
│   └── index.ts 
├── tests/
│   └── test_sistema_pontos.test.ts  # Testes unitários
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Instalação

```bash
npm install
```

## Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

## Compilar TypeScript

```bash
npm run build
```

## Tecnologias

- **Linguagem**: TypeScript
- **Framework de Testes**: Jest
- **Cobertura**: Jest Coverage

## Estratégia TDD Utilizada

O projeto foi desenvolvido seguindo a metodologia TDD (Test-Driven Development):

1. **Escrever o teste primeiro** - Cada funcionalidade foi testada antes da implementação
2. **Executar o teste (falha inicial)** - Verificar que o teste falha como esperado
3. **Implementar código mínimo** - Implementar apenas o necessário para o teste passar
4. **Refatorar mantendo testes verdes** - Melhorar o código mantendo todos os testes passando
5. **Repetir o ciclo** - Aplicar o ciclo para cada nova regra de negócio

## Casos de Teste Implementados

O projeto contém 22 testes unitários cobrindo:

- Cálculo de pontos por tipo de cliente (Padrão, Premium, VIP)
- Acúmulo de pontos em múltiplas compras
- Consulta de pontos
- Resgate de pontos para desconto
- Validações (saldo insuficiente, valores zero, pontos negativos)
- Operações em listas (filtrar, ordenar, remover, buscar)
- Funcionalidades avançadas (bônus promocional, expiração de pontos)

