<h1>Memorys</h1>

Este e um projeto de uma rede social

Para inciar use os seguintes comandos

<h1>Front-end</h1>

<p>cd client</p>
<p>npm i</p>
<p>npm run dev</p>

<h1>Back-end</h1>

<p><strong>Primeiramente vai em ./server e crie um arquivo chamado .env esse arquvi será usado para fazer algumas configurações do projeto</strong></p>

<p><strong>Dentro do arquivo você deve colocar as seguintes configurações</strong></p>

<hr>
<p><strong>
  PULO="Aqui você deve colocar um valor númerico para ser feito o hash da criptografia"<br><br>

  DATABASE_URL="file:Aqui depois do file: vai ficar o local onde seu banco sqlite vai ficar"
</strong></p>

<hr>

<p><strong>Agora use os seguintes comandos</strong></p>
<p>cd server</p>
<p>npm i</p>
<p>npx prisma migrate dev init</p>
<p>Em "Enter a name for the new migration" você deve colocar qualquer nome sem espaço e sem acentuação</p>
<p>npm run server</p>

<h1>Testes do Back-end e Front-end</h1>

<h2>Testes do front-end</h2>

<p><strong>Vai em ./client/src/main.jsx e na linha 21: const testes = false, altere para const testes = true</strong></p>
<p><strong>Agora use os comandos:</strong></p>
<p>cd client</p>
<p>npm run dev</p>
<p><strong>Agora abra outro terminal e use os comandos</strong></p>
<p>cd client</p>
<p>npx playwright test</p>
<p><strong>Pronto o teste do front-end está feito</strong></p>
<p><strong>Não esqueça de colocar o testes do arquivo ./client/src/main.jsx como false de novo após terminal o teste</strong></p>

<h2>Testes do back-end</h2>

<p><strong>Para fazer os testes do back use os seguintes comandos</strong></p>
<p>cd server</p>
<p>npm run test</p>

<p><strong>Pronto assim que você terminar de usa esses comandos o teste do back-end vai se iniciado</strong></p>

<p><strong>PS: Os emails que forem enviados poderão se visto no terminal já que foi utilizado um email de teste</strong></p>
