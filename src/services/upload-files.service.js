import http from "../http-common";

class UploadFilesService {
  upload(file, authorName, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);
    formData.append("author",authorName);

    return http.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getFiles() {
    return http.get("/files");
  }
}

export default new UploadFilesService();
