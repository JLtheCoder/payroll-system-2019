import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  FormText,
  Alert,
} from 'reactstrap';
import ReportTable from '../components/ReportTable';
import { uploadCsv } from '../services/payroll';

class PayloadUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      reportData: null,
    };
  }

  setCsvFile = (file) => {
    this.csvFile = file;
  }

  onSubmitUpload = (e) => {
    const formData = new FormData();
    const csvReport = this.csvFile.files[0];
    formData.append('csv', csvReport);
    uploadCsv(formData)
      .then((result) => {
        this.setState({
          error: '',
          reportData: result.data.data,
        });
      })
      .catch((err) => {
        this.setState({
          error: err.response.data.error,
        });
      });
  }

  render() {
    return (
      <Form encrypt="multipart/form-data">
        <FormGroup>
          <Label>Payroll File</Label>
          <div>
            <input type="file" id="csv" ref={this.setCsvFile} />
          </div>
          <FormText color="muted">
            Upload your payroll file in csv format.
          </FormText>
        </FormGroup>
        <Button
          className="payroll-button"
          onClick={this.onSubmitUpload}
        >
          Submit
        </Button>
        {
          this.state.error && (
            <Alert color="danger">
              {this.state.error}
            </Alert>
          )
        }
        {
          this.state.reportData && (
            <ReportTable
              reportData={this.state.reportData}
            />
          )
        }
      </Form>
    );
  }
};

export default PayloadUpload;
