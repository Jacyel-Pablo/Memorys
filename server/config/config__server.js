import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer"

export async function criar_token(email)
{
    const token = await jsonwebtoken.sign({ email, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, process.env.PULO)

    return token
}

export async function verificar_token(token)
{
    try {
        const verificar = await jsonwebtoken.verify(token, process.env.PULO)

        return true

    } catch (e) {
        return false
    }
}

export function enviar_email(destino, titulo, texto, html)
{
    try {
        nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            async function main() {
                const info = await transporter.sendMail({
                  from: '"Memorys" <memorys@ethereal.email>',
                  to: destino,
                  subject: titulo,
                  text: texto,
                  html: html,
                });
              
                console.log(nodemailer.getTestMessageUrl(info));
            }
              
            main().catch(console.error);
        });

        return true

    } catch (e) {
        return false
    }
}