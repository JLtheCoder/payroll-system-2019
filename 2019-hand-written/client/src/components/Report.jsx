import React, { Component } from 'react';
import {
  Button,
  Label,
  Input,
} from 'reactstrap';
import ReportTable from './ReportTable';
import {
  getReportList,
  getReport,
} from '../services/payroll';

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
      reportSelected: null,
      dropdownOpen: false,
      selectedReportData: null,
    };
  }

  toggleDropdown = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  componentDidMount() {
    getReportList()
      .then((result) => {
        this.setState({
          reports: result.data.data,
        });
      });
  }

  reportOptionOnSelect = (e) => {
    this.setState({
      reportSelected: e.target.value,
    });
  }

  onGetReportClick = () => {
    getReport(this.state.reportSelected)
      .then((result) => {
        this.setState({
          selectedReportData: result.data.data,
        });
      });
  }

  render() {
    return (
      <div>
        <Label>Payroll Report</Label>
        <Input
          type="select"
          onChange={this.reportOptionOnSelect}
        >
          <option
            disabled={this.state.reportSelected !== null}
            value=""
          >
            Choose one of the report
          </option>
          {
            this.state.reports.map((value, index) => {
              return (
                <option 
                  value={value.report_id}
                  key={index}
                >
                  {value.report_id}
                </option>
              );
            })
          }
        </Input>
        <Button
          className="report-button"
          onClick={this.onGetReportClick}
        >
          Get Report
        </Button>
        {
          this.state.selectedReportData && (
            <ReportTable
              reportData={this.state.selectedReportData}
            />
          )
        }
      </div>
    );
  }
}

export default Report;