-- CreateTable
CREATE TABLE "Memorys_Usuario" (
    "id" TEXT NOT NULL,
    "foto_de_perfil" TEXT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Memorys_Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memorys_Mensagem" (
    "id" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "foto_de_perfil" TEXT,
    "nome" TEXT NOT NULL,
    "data_de_publicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "texto_da_mensagem" TEXT NOT NULL,

    CONSTRAINT "Memorys_Mensagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memorys_Likes" (
    "id" TEXT NOT NULL,
    "id_mensagem" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,

    CONSTRAINT "Memorys_Likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memorys_Deslikes" (
    "id" TEXT NOT NULL,
    "id_mensagem" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,

    CONSTRAINT "Memorys_Deslikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memorys_Foto" (
    "id" TEXT NOT NULL,
    "id_mensagem" TEXT NOT NULL,
    "fotos" TEXT NOT NULL,
    "nome_user" TEXT NOT NULL,

    CONSTRAINT "Memorys_Foto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memorys_Video" (
    "id" TEXT NOT NULL,
    "id_mensagem" TEXT NOT NULL,
    "videos" TEXT NOT NULL,
    "nome_user" TEXT NOT NULL,

    CONSTRAINT "Memorys_Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memorys_Comentarios" (
    "id" TEXT NOT NULL,
    "id_mensagem" TEXT NOT NULL,
    "email_do_usuário" TEXT NOT NULL,
    "texto_da_mensagem" TEXT NOT NULL,

    CONSTRAINT "Memorys_Comentarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memorys_Resposta_comentario" (
    "id" TEXT NOT NULL,
    "id_comentario" TEXT NOT NULL,
    "email_do_usuário" TEXT NOT NULL,
    "texto_da_mensagem" TEXT NOT NULL,

    CONSTRAINT "Memorys_Resposta_comentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memorys_Seguidores" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "foto_de_perfil" TEXT,
    "nome" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Memorys_Seguidores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memorys_Seguindo" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "foto_de_perfil" TEXT,
    "nome" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Memorys_Seguindo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Memorys_Usuario_id_key" ON "Memorys_Usuario"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Memorys_Usuario_nome_key" ON "Memorys_Usuario"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Memorys_Usuario_email_key" ON "Memorys_Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Memorys_Mensagem_id_key" ON "Memorys_Mensagem"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Memorys_Likes_id_key" ON "Memorys_Likes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Memorys_Deslikes_id_key" ON "Memorys_Deslikes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Memorys_Foto_id_key" ON "Memorys_Foto"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Memorys_Video_id_key" ON "Memorys_Video"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Memorys_Comentarios_id_key" ON "Memorys_Comentarios"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Memorys_Resposta_comentario_id_key" ON "Memorys_Resposta_comentario"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Memorys_Seguidores_id_key" ON "Memorys_Seguidores"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Memorys_Seguindo_id_key" ON "Memorys_Seguindo"("id");

-- AddForeignKey
ALTER TABLE "Memorys_Mensagem" ADD CONSTRAINT "Memorys_Mensagem_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Memorys_Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memorys_Mensagem" ADD CONSTRAINT "Memorys_Mensagem_nome_fkey" FOREIGN KEY ("nome") REFERENCES "Memorys_Usuario"("nome") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memorys_Likes" ADD CONSTRAINT "Memorys_Likes_id_mensagem_fkey" FOREIGN KEY ("id_mensagem") REFERENCES "Memorys_Mensagem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memorys_Deslikes" ADD CONSTRAINT "Memorys_Deslikes_id_mensagem_fkey" FOREIGN KEY ("id_mensagem") REFERENCES "Memorys_Mensagem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memorys_Foto" ADD CONSTRAINT "Memorys_Foto_id_mensagem_fkey" FOREIGN KEY ("id_mensagem") REFERENCES "Memorys_Mensagem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memorys_Foto" ADD CONSTRAINT "Memorys_Foto_nome_user_fkey" FOREIGN KEY ("nome_user") REFERENCES "Memorys_Usuario"("nome") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memorys_Video" ADD CONSTRAINT "Memorys_Video_id_mensagem_fkey" FOREIGN KEY ("id_mensagem") REFERENCES "Memorys_Mensagem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memorys_Video" ADD CONSTRAINT "Memorys_Video_nome_user_fkey" FOREIGN KEY ("nome_user") REFERENCES "Memorys_Usuario"("nome") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memorys_Comentarios" ADD CONSTRAINT "Memorys_Comentarios_id_mensagem_fkey" FOREIGN KEY ("id_mensagem") REFERENCES "Memorys_Mensagem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memorys_Resposta_comentario" ADD CONSTRAINT "Memorys_Resposta_comentario_id_comentario_fkey" FOREIGN KEY ("id_comentario") REFERENCES "Memorys_Comentarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memorys_Seguidores" ADD CONSTRAINT "Memorys_Seguidores_userid_fkey" FOREIGN KEY ("userid") REFERENCES "Memorys_Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memorys_Seguindo" ADD CONSTRAINT "Memorys_Seguindo_userid_fkey" FOREIGN KEY ("userid") REFERENCES "Memorys_Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
