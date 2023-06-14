import React, { useState } from "react";

function Home() {
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [imageUrl, setImageUrl] = useState<any>();
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);

    // Exibir miniatura da imagem selecionada
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader?.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleWidthChange = (e: any) => {
    setWidth(e.target.value);
  };

  const handleHeightChange = (e: any) => {
    setHeight(e.target.value);
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    if (!file || !width || !height) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `/api/images/image.jpg?width=${width}&height=${height}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setDownloadUrl(imageUrl);
      } else {
        alert("Erro ao redimensionar a imagem");
      }
    } catch (error) {
      console.error("Erro ao fazer a solicitação:", error);
      alert("Erro ao fazer a solicitação");
    }
  };

  const handleDownloadClick = () => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "imagem_redimensionada.jpg";
      link.click();
    }
  };

  return (
    <div>
      <h1>API Integration Example</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="file">Selecione a imagem:</label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Imagem Selecionada"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          )}
        </div>
        <div>
          <label htmlFor="width">Largura:</label>
          <input
            type="text"
            id="width"
            value={width}
            onChange={handleWidthChange}
          />
        </div>
        <div>
          <label htmlFor="height">Altura:</label>
          <input
            type="text"
            id="height"
            value={height}
            onChange={handleHeightChange}
          />
        </div>
        <button type="submit">Enviar</button>
      </form>
      {downloadUrl && (
        <div>
          <h2>Imagem redimensionada:</h2>
          <img
            src={downloadUrl}
            alt="Imagem Redimensionada"
            style={{ maxWidth: "400px" }}
          />
          <button onClick={handleDownloadClick}>Download</button>
        </div>
      )}
    </div>
  );
}

export default Home;
