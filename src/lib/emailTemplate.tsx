/**
 * Genera una plantilla de correo HTML para diferentes propósitos
 * @param codigo - Código de verificación
 * @param tipo - Tipo de correo ('password' o 'register')
 * @returns HTML del correo electrónico
 */
export function generateEmailTemplate(codigo: string, tipo: "password" | "register") {
  // Determinar título y mensaje según el tipo
  const titulo = tipo === "password" ? "Cambio de Contraseña" : "Verificación de Cuenta"

  const mensaje =
    tipo === "password"
      ? "Hemos recibido una solicitud para cambiar tu contraseña. Utiliza el siguiente código para completar el proceso:"
      : "Gracias por registrarte en Suplementación Deportiva. Para verificar tu cuenta, utiliza el siguiente código:"

  const footerMensaje =
    tipo === "password"
      ? "Si no has solicitado este cambio, puedes ignorar este correo."
      : "Este código expirará en 30 minutos. Si no has solicitado esta verificación, puedes ignorar este correo."

  // HTML del correo
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${titulo}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          border: 1px solid #e5e5e5;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 2px solid #FF5500;
        }
        .logo {
          background: linear-gradient(135deg, #ffffff, #ffd3bb);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px; /* Asegura centrado horizontal */
        }

        .logoImage {
          width: 36px;
          height: 36px;
          object-fit: contain;
        }

        .title {
          color: #333333;
          margin: 10px 0;
          font-size: 28px;
        }
        .content {
          padding: 30px 20px;
          text-align: center;
        }
        .message {
          color: #555555;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 25px;
        }
        .code-container {
          background-color: #f7f7f7;
          padding: 20px;
          border-radius: 8px;
          margin: 25px 0;
          border: 1px dashed #dddddd;
        }
        .code {
          font-size: 36px;
          font-weight: bold;
          color: #FF5500;
          letter-spacing: 8px;
        }
        .note {
          color: #777777;
          font-size: 14px;
          margin-top: 25px;
          font-style: italic;
        }
        .footer {
          background-color: #f7f7f7;
          padding: 20px;
          text-align: center;
          border-radius: 0 0 8px 8px;
          color: #999999;
          font-size: 13px;
        }
        .contact {
          margin-top: 10px;
        }
        .contact a {
          color: #FF5500;
          text-decoration: none;
        }
        .social {
          margin-top: 15px;
        }
        .social-icon {
          display: inline-block;
          margin: 0 10px;
          width: 30px;
          height: 30px;
          background-color: #FF5500;
          border-radius: 50%;
        }
        .banner {
          margin-top: 20px;
          padding: 15px;
          background-color: #FFF1EB;
          border-radius: 8px;
          color: #FF5500;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header" style="text-align: center;">
          <div class="logo" style="margin: 0 auto 15px; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #ffffff, #ffd3bb); display: flex; align-items: center; justify-content: center;">
            <img src="https://q2qwccah9hqmefmy.public.blob.vercel-storage.com/logoAlante-NzQGFTX4gHf09i3Hj2pfbl2hSBIzwv.png" alt="Logo" width="36" height="36" style="display: block; margin: auto;" />
          </div>
          <h1 class="title" style="color: #333333; margin: 10px 0; font-size: 28px;">${titulo}</h1>
        </div>
        
        <div class="content">
          <p class="message">${mensaje}</p>
          
          <div class="code-container">
            <div class="code">${codigo}</div>
          </div>
          
          <p class="note">${footerMensaje}</p>
          
          <div class="banner">
            ${
              tipo === "register"
                ? "¡Bienvenido al Club! Disfruta de descuentos exclusivos y reservas premium."
                : "¡Recupera tu acceso! Recuerda mantener segura tu nueva contraseña."
            }
          </div>
        </div>
        
        <div class="footer">
          <p>© 2024 Suplementación Deportiva. Todos los derechos reservados.</p>
          <p class="contact">
            ¿Necesitas ayuda? Contáctanos en 
            <a href="mailto:soporte@suplementaciondeportiva.es">soporte@suplementaciondeportiva.es</a>
          </p>
          <div class="social">
            <span class="social-icon"></span>
            <span class="social-icon"></span>
            <span class="social-icon"></span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
