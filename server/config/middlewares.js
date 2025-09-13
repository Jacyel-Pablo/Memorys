import multer from "multer";
import { randomBytes } from "node:crypto";
import z from "zod"
import path from "node:path";

function dividir_string(string)
{
  string = string.split(".")

  return string
}

export function storage(formatos_aceitos, dir)
{
  const dest = multer.diskStorage({
    destination: function (req, file, cb) {
      switch (file.fieldname) {
        case "videos":
          cb(null, path.resolve(path.dirname('') + "/config/files/videos"))
          break

        default:
          cb(null, path.resolve(path.dirname('') + dir))
          break
      }
      
    },
    filename: function (req, file, cb) {
      const string = dividir_string(file.originalname)
      cb(null, dividir_string(file.originalname)[0] + '-' + randomBytes(16).toString("hex") + "." + string[string.length - 1])
    }
  })

  function fileFilter (req, file, cb) {

    switch (file.fieldname) {
      case "videos":

        if (["video/mp4", "video/x-matroska"].includes(file.mimetype)) {
          cb(null, true)

        } else {

          cb(new Error('Alguma coisa deu errado'))

        }

        break

      default:

        if (formatos_aceitos.includes(file.mimetype)) {
          cb(null, true)

        } else {

          cb(new Error('Alguma coisa deu errado'));

        }

        break
    }
      
  }
      
  const upload = multer({ storage: dest, fileFilter: fileFilter })
  
  return upload

}

export function validar(esquema)
{
  return ( req, res, next ) => {
    try {
      esquema.parse({
        query: req.query,
        body: req.body
      })
  
      next()

    } catch (e) {
      console.log(e)
      res.status(404).send(false)
    }
  }
}