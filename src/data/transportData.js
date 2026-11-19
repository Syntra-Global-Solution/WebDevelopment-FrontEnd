export const transportTypes = [
  { value: '', label: 'Todos' },
  { value: 'metro', label: 'Metrô' },
  { value: 'train', label: 'Trem' },
  { value: 'monorail', label: 'Monotrilho' },
]

const METRO_SOURCE = 'https://www.metro.sp.gov.br/sua-viagem/linhas-estacoes/'
const CPTM_SOURCE = 'https://www.cptm.sp.gov.br/cptm/sua-viagem/linhas-e-estacoes'
const ARTESP_SOURCE = 'https://ccm.artesp.sp.gov.br/metroferroviario/status-linhas/'

const regularMetro = {
  status: 'Linha cadastrada',
  statusKind: 'unknown',
  operatingHours: '4h40 à 0h, diariamente',
  sourceLabel: 'Metrô de São Paulo',
  sourceUrl: METRO_SOURCE,
  updatedAt: '19/11/2026',
}

const regularTrain = {
  status: 'Linha cadastrada',
  statusKind: 'unknown',
  operatingHours: 'aprox. 4h à 0h; confirme na operadora',
  updatedAt: '19/11/2026',
}

export const transportLines = [
  {
    id: 'metro-1', type: 'metro', code: '1', name: 'Linha 1–Azul', color: '#0B4EA2', operator: 'Metrô de São Paulo',
    directions: ['Jabaquara', 'Tucuruvi'],
    stops: ['Jabaquara–Comitê Paralímpico Brasileiro', 'Conceição', 'São Judas', 'Saúde', 'Praça da Árvore', 'Santa Cruz', 'Vila Mariana', 'Ana Rosa', 'Paraíso', 'Vergueiro–Sebrae', 'São Joaquim', 'Japão–Liberdade', 'Sé', 'São Bento', 'Luz', 'Tiradentes', 'Armênia', 'Portuguesa–Tietê', 'Carandiru', 'Santana', 'Jardim São Paulo–Ayrton Senna', 'Parada Inglesa', 'Tucuruvi'],
    ...regularMetro,
  },
  {
    id: 'metro-2', type: 'metro', code: '2', name: 'Linha 2–Verde', color: '#008C5A', operator: 'Metrô de São Paulo',
    directions: ['Vila Madalena', 'Vila Prudente'],
    stops: ['Vila Madalena', 'Santuário Nossa Senhora de Fátima–Sumaré', 'Clínicas', 'Consolação', 'Trianon–Masp', 'Brigadeiro', 'Paraíso', 'Ana Rosa', 'Vila Mariana', 'Chácara Klabin', 'Santos–Imigrantes', 'Alto do Ipiranga', 'Sacomã', 'Tamanduateí', 'Vila Prudente'],
    ...regularMetro,
  },
  {
    id: 'metro-3', type: 'metro', code: '3', name: 'Linha 3–Vermelha', color: '#D71920', operator: 'Metrô de São Paulo',
    directions: ['Palmeiras–Barra Funda', 'Corinthians–Itaquera'],
    stops: ['Palmeiras–Barra Funda', 'Marechal Deodoro', 'Santa Cecília', 'República', 'Anhangabaú', 'Sé', 'Pedro II', 'Brás', 'Bresser–Mooca', 'Belém', 'Tatuapé', 'Carrão–Assaí Atacadista', 'Penha–Lojas Besni', 'Vila Matilde', 'Guilhermina–Esperança', 'Patriarca–Vila Ré', 'Artur Alvim', 'Corinthians–Itaquera'],
    ...regularMetro,
  },
  {
    id: 'metro-4', type: 'metro', code: '4', name: 'Linha 4–Amarela', color: '#C9A400', operator: 'Motiva Linha 4',
    directions: ['Vila Sônia', 'Luz'],
    stops: ['Vila Sônia–Professora Elisabeth Tenreiro', 'São Paulo–Morumbi', 'Butantã', 'Pinheiros', 'Faria Lima', 'Fradique Coutinho', 'Oscar Freire', 'Paulista–Pernambucanas', 'Higienópolis–Mackenzie', 'República', 'Luz'],
    ...regularMetro,
    sourceLabel: 'Motiva Linha 4', sourceUrl: 'https://trilhos.motiva.com.br/linha-4-amarela/',
  },
  {
    id: 'metro-5', type: 'metro', code: '5', name: 'Linha 5–Lilás', color: '#8A3A8E', operator: 'Motiva Linha 5',
    directions: ['Capão Redondo', 'Chácara Klabin'],
    stops: ['Capão Redondo', 'Campo Limpo', 'Vila das Belezas', 'Giovanni Gronchi', 'Santo Amaro', 'Largo Treze', 'Adolfo Pinheiro', 'Alto da Boa Vista', 'Borba Gato', 'Brooklin', 'Campo Belo', 'Eucaliptos', 'Moema', 'AACD–Servidor', 'Hospital São Paulo', 'Santa Cruz', 'Chácara Klabin'],
    ...regularMetro,
    sourceLabel: 'Motiva Linha 5', sourceUrl: 'https://trilhos.motiva.com.br/linha-5-lilas/',
  },
  {
    id: 'metro-6', type: 'metro', code: '6', name: 'Linha 6–Laranja', color: '#F58220', operator: 'LinhaUni',
    directions: ['João Paulo I', 'Perdizes'],
    status: 'Operação assistida', statusKind: 'unknown', operatingHours: '10h às 15h, de segunda a sexta',
    stops: ['João Paulo I', 'Freguesia do Ó', 'Santa Marina', 'Água Branca', 'SESC–Pompeia', 'Perdizes'],
    sourceLabel: 'LinhaUni / Governo de São Paulo', sourceUrl: 'https://www.linhauni.com.br/linha-6-laranja', updatedAt: '19/11/2026',
    note: 'Primeiro trecho em operação assistida; a linha completa permanece em implantação.',
  },
  {
    id: 'monorail-15', type: 'monorail', code: '15', name: 'Linha 15–Prata', color: '#777777', operator: 'Metrô de São Paulo',
    directions: ['Vila Prudente', 'Jardim Colonial'],
    stops: ['Vila Prudente', 'Oratório', 'São Lucas', 'Camilo Haddad', 'Vila Tolstói', 'Vila União', 'Jardim Planalto', 'Sapopemba', 'Fazenda da Juta', 'São Mateus', 'Jardim Colonial'],
    ...regularMetro,
  },
  {
    id: 'monorail-17', type: 'monorail', code: '17', name: 'Linha 17–Ouro', color: '#A67C00', operator: 'Metrô de São Paulo',
    directions: ['Morumbi', 'Washington Luís'],
    status: 'Operação transitória', statusKind: 'unknown', operatingHours: '6h às 22h, de segunda a sábado',
    stops: ['Morumbi', 'Chucri Zaidan', 'Vila Cordeiro', 'Campo Belo', 'Vereador José Diniz', 'Brooklin Paulista', 'Aeroporto de Congonhas', 'Washington Luís'],
    sourceLabel: 'Metrô de São Paulo', sourceUrl: METRO_SOURCE, updatedAt: '19/11/2026',
  },
  {
    id: 'train-7', type: 'train', code: '7', name: 'Linha 7–Rubi', color: '#8B1E3F', operator: 'TIC Trens',
    directions: ['Jundiaí', 'Palmeiras–Barra Funda'],
    stops: ['Jundiaí', 'Várzea Paulista', 'Campo Limpo Paulista', 'Botujuru', 'Francisco Morato', 'Baltazar Fidélis', 'Franco da Rocha', 'Caieiras', 'Perus', 'Vila Aurora', 'Jaraguá', 'Vila Clarice', 'Pirituba', 'Piqueri', 'Lapa', 'Água Branca', 'Palmeiras–Barra Funda'],
    ...regularTrain,
    sourceLabel: 'TIC Trens', sourceUrl: 'https://www.tictrens.com.br/',
  },
  {
    id: 'train-8', type: 'train', code: '8', name: 'Linha 8–Diamante', color: '#737373', operator: 'Motiva Linhas 8 e 9',
    directions: ['Júlio Prestes', 'Amador Bueno'],
    stops: ['Júlio Prestes', 'Palmeiras–Barra Funda', 'Lapa', 'Domingos de Moraes', 'Imperatriz Leopoldina', 'Presidente Altino', 'Osasco', 'Comandante Sampaio', 'Quitaúna', 'General Miguel Costa', 'Carapicuíba', 'Santa Terezinha', 'Antônio João', 'Barueri', 'Jardim Belval', 'Jardim Silveira', 'Jandira', 'Sagrado Coração', 'Engenheiro Cardoso', 'Itapevi', 'Santa Rita', 'Cimenrita', 'Ambuitá', 'Amador Bueno'],
    ...regularTrain,
    sourceLabel: 'Motiva Linhas 8 e 9', sourceUrl: 'https://trilhos.motiva.com.br/viamobilidade8e9/',
  },
  {
    id: 'train-9', type: 'train', code: '9', name: 'Linha 9–Esmeralda', color: '#007F6E', operator: 'Motiva Linhas 8 e 9',
    directions: ['Osasco', 'Varginha'],
    stops: ['Osasco', 'Presidente Altino', 'Ceasa', 'Villa-Lobos–Jaguaré', 'Cidade Universitária', 'Pinheiros', 'Hebraica–Rebouças', 'Cidade Jardim', 'Vila Olímpia', 'Berrini', 'Morumbi–Claro', 'Granja Julieta', 'João Dias', 'Santo Amaro', 'Socorro', 'Jurubatuba', 'Autódromo', 'Primavera–Interlagos', 'Grajaú', 'Bruno Covas–Mendes–Vila Natal', 'Varginha'],
    ...regularTrain,
    sourceLabel: 'Motiva Linhas 8 e 9', sourceUrl: 'https://trilhos.motiva.com.br/viamobilidade8e9/',
  },
  {
    id: 'train-10', type: 'train', code: '10', name: 'Linha 10–Turquesa', color: '#008B95', operator: 'CPTM',
    directions: ['Palmeiras–Barra Funda', 'Rio Grande da Serra'],
    stops: ['Palmeiras–Barra Funda', 'Luz', 'Brás', 'Juventus–Mooca', 'Ipiranga', 'Tamanduateí', 'São Caetano do Sul–Prefeito Walter Braido', 'Utinga', 'Prefeito Saladino', 'Prefeito Celso Daniel–Santo André', 'Capuava', 'Mauá', 'Guapituba', 'Ribeirão Pires–Antônio Bespalec', 'Rio Grande da Serra'],
    ...regularTrain,
    sourceLabel: 'CPTM', sourceUrl: CPTM_SOURCE,
  },
  {
    id: 'train-11', type: 'train', code: '11', name: 'Linha 11–Coral', color: '#E56A16', operator: 'Trivia Trens',
    directions: ['Palmeiras–Barra Funda', 'Estudantes'],
    stops: ['Palmeiras–Barra Funda', 'Luz', 'Brás', 'Tatuapé', 'Corinthians–Itaquera', 'Dom Bosco', 'José Bonifácio', 'Guaianases', 'Antônio Gianetti Neto', 'Ferraz de Vasconcelos', 'Poá', 'Calmon Viana', 'Suzano', 'Jundiapeba', 'Braz Cubas', 'Mogi das Cruzes', 'Estudantes'],
    ...regularTrain,
    sourceLabel: 'ARTESP / CPTM', sourceUrl: ARTESP_SOURCE,
  },
  {
    id: 'train-12', type: 'train', code: '12', name: 'Linha 12–Safira', color: '#163A70', operator: 'Trivia Trens',
    directions: ['Brás', 'Calmon Viana'],
    stops: ['Brás', 'Tatuapé', 'Engenheiro Goulart', 'USP Leste', 'Comendador Ermelino', 'São Miguel Paulista', 'Jardim Helena–Vila Mara', 'Itaim Paulista', 'Jardim Romano', 'Engenheiro Manoel Feio', 'Itaquaquecetuba', 'Aracaré', 'Calmon Viana'],
    ...regularTrain,
    sourceLabel: 'ARTESP / CPTM', sourceUrl: ARTESP_SOURCE,
  },
  {
    id: 'train-13', type: 'train', code: '13', name: 'Linha 13–Jade', color: '#00A0C6', operator: 'Trivia Trens',
    directions: ['Engenheiro Goulart', 'Aeroporto–Guarulhos'],
    stops: ['Engenheiro Goulart', 'Guarulhos–Cecap', 'Aeroporto–Guarulhos'],
    ...regularTrain,
    sourceLabel: 'ARTESP / CPTM', sourceUrl: ARTESP_SOURCE,
  },
]
