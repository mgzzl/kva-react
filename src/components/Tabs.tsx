import React, { useState } from 'react';
import ReactPDF, { PDFViewer, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import Invoice from './Invoice';
import { saveAs } from 'file-saver';


interface TabProps {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabProps[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [tabValues, setTabValues] = useState(new Map<number, any>());
  const [inputErrors, setInputErrors] = useState({});
  const [showPDF, setShowPDF] = useState(false);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    // setTabValues((prevValues) => prevValues.set(index, { ...prevValues.get(index), }));
  };

  const handleNext = () => {
    if (activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const handleBack = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleFormChange = (index: number, values: any) => {
    setTabValues(prevValues => new Map(prevValues).set(index, values));
  };

  const handlePrintValues = () => {
    const allValues = Array.from(tabValues.entries()).reduce<Record<number, any>>((acc, [index, values]) => {
      acc[index] = values;
      return acc;
    }, {});
    console.log(allValues);
  };

  const isFormValid = async (): Promise<boolean> => {
    console.log('isFormValid started');
    const entries = Array.from(tabValues.entries());
    console.log("Entries: ", entries)
    for (const [index, values] of entries) {
      console.log(`Processing tab ${index}`);
      for (const key in values) {
        if (key === 'optionalText') continue; // Skip validation for optionalText
        console.log(`Checking value for key ${key}`);
        if (typeof values[key] === 'object') {
          for (const subKey in values[key]) {
            console.log(`Checking value for subkey ${subKey}`);
            if (values[key][subKey] === '' || values[key][subKey] === 'Bitte wählen') {
              console.log(`Invalid value found at tab ${index}`);
              await setActiveTab(index);  // Ensure the tab is set before returning false
              return false;
            }
          }
        } else {
          if (values[key] === '' || values[key] === 'Bitte wählen') {
            console.log('Invalid value found at tab', index);
            await setActiveTab(index);  // Ensure the tab is set before returning false
            return false;
          }
        }
      }
    }
    console.log('isFormValid finished');
    return true;
  };

  const handleDownload = async () => {
    const allValues = Array.from(tabValues.entries()).reduce<Record<number, any>>((acc, [index, values]) => {
      acc[index] = values;
      return acc;
    }, {});
    console.log("All Values: ", allValues)
    const invoiceData = {
      customer: allValues[0]?.customer || {},
      keingarten: allValues[0]?.keingarten || {},
      project: allValues[1] || {},
      items: allValues[2] || []
    };

    const taxRate = 19;  // Example tax rate
    const doc = <Invoice data={invoiceData} taxRate={taxRate} />;
    const blob = await pdf(doc).toBlob();
    saveAs(blob, 'invoice.pdf');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Custom Bootstrap validation

    if (await isFormValid()) {
      handlePrintValues();
      setShowPDF(true);
      handleDownload();
      // const currentForm = document.querySelector<HTMLFormElement>(`.needs-validation`);
      // if (currentForm){
      //   currentForm.querySelectorAll('.form-control, .form-select').forEach((input) => {
      //     if ((input as HTMLInputElement).value === '' || (input as HTMLInputElement).value === 'Bitte wählen') {
      //       input.classList.add('is-invalid');
      //     } else {
      //       input.classList.remove('is-invalid');
      //     }
      //   });
      // }
    } else {
      // Trigger Bootstrap invalid feedback
      document.querySelectorAll('.form-control, .form-select').forEach((input) => {
        if ((input as HTMLInputElement).value === '' || (input as HTMLInputElement).value === 'Bitte wählen') {
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
        }
      });
    }
  };

  const allValues = Array.from(tabValues.entries()).reduce<Record<number, any>>((acc, [index, values]) => {
    acc[index] = values;
    return acc;
  }, {});

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   handlePrintValues();
  //   // Further logic for submission or PDF generation
  // };

  return (
    <div>
      <ul className="nav nav-tabs justify-content-center">
        {tabs.map((tab, index) => (
          <li className="nav-item" key={index}>
            <a
              className={`nav-link ${activeTab === index ? 'active' : ''}`}
              onClick={() => handleTabClick(index)}
            >
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {React.cloneElement(tabs[activeTab].content as React.ReactElement<any>, {
          values: tabValues.get(activeTab),
          onChange: (values: any) => handleFormChange(activeTab, values)
        })}
        <div className="container d-flex justify-content-between mt-3 mb-5">
          {activeTab > 0 && (
            <button className="btn btn-secondary" onClick={handleBack}>
              Back
            </button>
          )}
          {activeTab < tabs.length - 1 && (
            <button className="btn btn-primary ml-auto" onClick={handleNext}>
              Next
            </button>
          )}
          {activeTab === tabs.length - 1 && (
            <button className="btn btn-success" onClick={handleSubmit}>
              PDF generieren
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
