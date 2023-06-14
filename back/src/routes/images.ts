import { exec } from "child_process";
import { FastifyPluginAsync } from "fastify";
import { unlinkSync, readFileSync, promises } from "fs";

const images: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/api/images/:fileName", async function (request, reply) {
    const { fileName } = request.params as any;
    const { width, height } = request.query as {
      width: string;
      height: string;
    };
    const data = await request.file();

    const file = data?.file ?? "";

    const filePath = `${__dirname}/${fileName}`;
    await promises.writeFile(filePath, file);

    const resizedFilePath = `${__dirname}/resized_${fileName}`;
    const resizeCommand = `ffmpeg -i ${filePath} -vf "scale=${width}:${height}" ${resizedFilePath}`;

    exec(resizeCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao redimensionar imagem: ${error.message}`);
        reply.code(500).send("Erro ao redimensionar imagem");
        return;
      }

      const resizedData = readFileSync(resizedFilePath);

      reply.code(200).header("Content-Type", "image/jpeg").send(resizedData);

      unlinkSync(filePath);
      unlinkSync(resizedFilePath);
    });
  });
};

export default images;
