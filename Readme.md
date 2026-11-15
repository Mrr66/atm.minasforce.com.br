# Site Institucional - Assistente da Loja

## Objetivo

Criar um site moderno para divulgar o terminal inteligente de autoatendimento para lojas e supermercados.

O site deve apresentar o equipamento de forma visual, explicar suas funcionalidades, mostrar vídeos e fotos reais do terminal e direcionar interessados para contato comercial.

## Tecnologia

- Astro
- Tailwind CSS
- TypeScript
- Animações leves com CSS, Intersection Observer e Motion/GSAP somente quando necessário
- Site estático, rápido e otimizado para SEO
- Hospedagem simples em servidor estático

## Público-alvo

- Donos de lojas
- Supermercados
- Materiais de construção
- Lojas de informática
- Redes de varejo
- Empresas que desejam modernizar o atendimento presencial

## Direção visual

- Interface premium, moderna e tecnológica.
- Usar as fotos e vídeos reais do terminal como elementos principais.
- O terminal deve aparecer já na primeira tela.
- Design escuro sofisticado, com verde-esmeralda como cor de destaque.
- Tipografia limpa, legível e profissional.
- Não usar ilustrações genéricas, fundos abstratos, gradientes exagerados ou cartões decorativos.
- Priorizar imagens reais do equipamento, clientes utilizando o terminal e telas do assistente.

## Estrutura da página

### 1. Hero

- Vídeo ou imagem em tela cheia do terminal funcionando.
- Título direto:
  `Assistente da Loja`
- Texto de apoio:
  `Atendimento inteligente por voz para modernizar a experiência do cliente no varejo.`
- Botões:
  - `Solicitar demonstração`
  - `Ver como funciona`
- Deixar visível o início da próxima seção em qualquer resolução.

### 2. Demonstração

Apresentar um vídeo curto mostrando:

- Detecção de presença por câmera.
- Saudação automática ao cliente.
- Consulta de produtos por voz.
- Informação de preço, estoque e localização.
- Pagamento por PIX.
- Emissão de comprovante.
- Reconhecimento de colaboradores.

O vídeo deve abrir em modal ao clicar, sem reprodução automática com som.

### 3. Funcionalidades

Exibir recursos organizados em uma grade clara:

- Atendimento por voz.
- Consulta de produtos e estoque.
- Integração com CRM e PDV.
- Localização de produtos na loja.
- Pagamento via PIX com QR Code.
- Emissão de comprovante por impressora térmica.
- Envio de comprovante por WhatsApp.
- Reconhecimento facial de clientes.
- Reconhecimento de colaboradores.
- Atualização de estoque por voz.
- Baixa de vendas por voz.
- Atualizações automáticas do terminal.

Cada item deve ter ícone, título curto e descrição objetiva.

### 4. Experiência do cliente

Mostrar o fluxo de atendimento:

1. Cliente se aproxima do terminal.
2. A câmera identifica a presença.
3. O assistente dá boas-vindas.
4. O cliente pergunta sobre um produto.
5. O terminal informa disponibilidade, preço ou localização.
6. O atendimento é concluído de forma rápida e natural.

Usar uma animação de progresso suave conforme a pessoa rola a página.

### 5. Gestão para colaboradores

Apresentar as funcionalidades internas:

- Recebimento de pagamentos.
- Geração de QR Code PIX.
- Atualização de estoque.
- Registro de venda.
- Consulta de produtos.
- Emissão de comprovantes.
- Controle por comandos de voz.
- Reinício e desligamento protegido do terminal.

### 6. Integrações

Mostrar que o terminal pode integrar com diferentes sistemas:

- CRM
- PDV
- Estoque
- Catálogo de produtos
- WhatsApp
- Impressora térmica
- APIs personalizadas

Explicar que as integrações são configuráveis, sem alterar o código do terminal.

### 7. Galeria

Criar galeria responsiva com:

- Fotos reais do terminal.
- Fotos em modo retrato.
- Fotos do terminal em lojas.
- Capturas da interface.
- Imagens da câmera e reconhecimento facial.

Ao clicar, abrir imagem ampliada em modal.

### 8. Chamada comercial

Seção final com mensagem objetiva:

`Transforme o atendimento da sua loja.`

Texto:
`Ofereça uma experiência moderna, rápida e inteligente para seus clientes.`

Botões:
- `Solicitar demonstração`
- `Falar no WhatsApp`

## Animações

As animações devem ser discretas e úteis:

- Entrada suave de textos e imagens ao rolar a página.
- Destaque sutil do terminal no hero.
- Linha animada no fluxo de atendimento.
- Contadores animados para benefícios e recursos.
- Transições suaves em botões, galeria e modal de vídeo.
- Respeitar `prefers-reduced-motion`.

Não usar animações excessivas, pesadas ou que prejudiquem a leitura.

## Responsividade

- Prioridade para celulares.
- Layout adaptado para desktop, tablets e telas ultrawide.
- Imagens sem distorção.
- Vídeos com proporção estável.
- Texto sempre legível e sem sobreposição.
- Botões grandes o suficiente para toque.

## SEO e desempenho

- Usar títulos e descrições adequados.
- Criar Open Graph para compartilhamento no WhatsApp.
- Otimizar imagens em WebP/AVIF.
- Carregar vídeos somente quando necessário.
- Usar lazy loading em galeria e imagens fora da primeira tela.
- Gerar sitemap e robots.txt.
- Buscar excelente nota de desempenho no Lighthouse.

## Páginas

- `/` - Página principal institucional.
- `/privacidade` - Política de privacidade.
- `/contato` - Formulário e canais comerciais.

## Conteúdos necessários

- Logo da Minas Force ou marca definida para o produto.
- Fotos reais do terminal.
- Vídeo demonstrativo.
- Número do WhatsApp comercial.
- E-mail comercial.
- Nome da empresa responsável.
- Lista de integrações disponíveis.
- Depoimentos ou casos de uso, quando disponíveis.

## Critérios de entrega

- Site em Astro + Tailwind CSS.
- Design responsivo e profissional.
- Fotos e vídeos reais do terminal.
- Animações leves e fluidas.
- Formulário de contato funcional.
- Botão de WhatsApp funcional.
- SEO básico configurado.
- Pronto para publicar em hospedagem estática.