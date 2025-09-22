import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer"
import sgMail from "@sendgrid/mail"
import dotenv from "dotenv"

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

export function enviar_email(destino, titulo, texto, html, sendgrid_or_gmail)
{
    try {
        const msg = {
            //   from: '"Memorys" <memorys@ethereal.email>',
            from: "memorys224@gmail.com",
            to: destino,
            subject: titulo,
            text: texto,
            html: html,
        }

        switch (sendgrid_or_gmail) {
            case "gmail":
            // nodemailer.createTestAccount((err, account) => {
                let transporter = nodemailer.createTransport({
                    // host: 'smtp.ethereal.email',
                    // port: 587,
                    service: 'gmail',
                    secure: false,
                    // auth: {
                    //     user: account.user,
                    //     pass: account.pass
                    // }
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.SENHA
                    }
                });

                async function main() {
                    const info = await transporter.sendMail(msg);
                
                    // console.log(nodemailer.getTestMessageUrl(info));
                }
                
                main().catch(console.error);
            // });
                break

            case "sendgrid":
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                sgMail.send(msg);
                break
        }

        return true

    } catch (e) {
        return false
    }
}