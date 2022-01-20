import React, { Component } from "react";
import UploadService from "../services/upload-files.service";

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);
    this.handleAuthor = this.handleAuthor.bind(this);

    this.state = {
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "", 
      fileInfos: [],
      authorName: ""
    };
  }

  componentDidMount() {
    UploadService.getFiles().then((response) => {
      this.setState({
        fileInfos: response.data,
      });
    });
  }

  selectFile(event) {
    this.setState({
      selectedFiles: event.target.files,
    });
  }

  handleAuthor(event) {
      
     this.setState( {authorName: event.target.value});
  }


  upload() {
    let currentFile = this.state.selectedFiles[0]; 
    let authorName = this.state.authorName;
    this.setState({
      progress: 0,
      currentFile: currentFile,
    });
     
   
   
    UploadService.upload(currentFile,authorName, (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    }).then((response) => {
        this.setState({
          message: response.data.message,
        });
        return UploadService.getFiles();
      }).then((files) => {
        console.log(files.data);
        this.setState({
          fileInfos: files.data, 
        });
        
       
      }).catch(() => {
        this.setState({
          progress: 0,
          message: "Could not upload the file!",
          currentFile: undefined,
        });
      });

    this.setState({
      selectedFiles: undefined,
    });
     
  }

  render() {
    const {
      selectedFiles,
      currentFile,
      progress,
      message,
      fileInfos,
      authorName,
    } = this.state;

    return (
      <div>
        {currentFile && (
          <div className="progress">
            <div
              className="progress-bar progress-bar-info progress-bar-striped"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: progress + "%" }}
            >
              {progress}%
            </div>
          </div>
        )}

        <label className="btn btn-default">
          <input type="file" onChange={this.selectFile} />
        </label>
        <label  >
          <input name="authorName" type="text" required placeholder="Author Name" onChange={this.handleAuthor}/>
        </label>

        <button
          className="btn btn-success"
          disabled={!selectedFiles || authorName ===""}
          onClick={this.upload}
        >
          Upload
        </button>

        <div className="alert alert-light" role="alert">
          {message}
        </div>

        <div className="card">
          <div className="card-header">List of Files</div>
          <ul className="list-group list-group-flush">
            {fileInfos &&
              fileInfos.map((file, index) => (
                <li className="list-group-item" key={index}>
                  <a href={file.url}>{file.name} - Author : {file.authorName}</a>
 
                </li>
                 
              ))}
          </ul>
           
        </div>
      </div>
    );
  }
}
