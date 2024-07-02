import React, { useState } from 'react';
import{ pdf } from '@react-pdf/renderer';
import Quotation from './Quotation';
import QuotationEnglish from './QuotationEnglish';
import { saveAs } from 'file-saver';
import Invoice from './Invoice';
import InvoiceEnglish from './InvoiceEnglish';
import ErrorModal from './ErrorModal';


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
  const [showErrorModal, setShowErrorModal] = React.useState(false);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
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
  const handleCloseError = () => {
    setShowErrorModal(false);
  };

  const handleDownload = async () => {
    const allValues = Array.from(tabValues.entries()).reduce<Record<number, any>>((acc, [index, values]) => {
      acc[index] = values;
      return acc;
    }, {});
    console.log("All Values: ", allValues)
    const QuotationData = {
      customer: allValues[0]?.customer || {},
      keingarten: allValues[0]?.keingarten || {},
      project: allValues[1] || {},
      items: allValues[2] || []
    };

    const customerEnglish = QuotationData.customer.english
    const customerReverseCharge = QuotationData.customer.reverseCharge
    const invoiceNr = QuotationData.keingarten.invoiceNr

    const taxRate = customerReverseCharge ? 0 : 19;  // if reverse charge true tax rate is 0 else 19
    const doc = customerEnglish 
    ? <QuotationEnglish data={QuotationData} taxRate={taxRate} /> 
    : <Quotation data={QuotationData} taxRate={taxRate} />;    
    const blob = await pdf(doc).toBlob();
    const keingartenDate = QuotationData.keingarten.date.replace(/-/g, ''); // Remove dashes from date
    console.log(keingartenDate)
    const customerName = QuotationData.customer.name.replace(/\s+/g, ''); // Remove spaces from customer name
    console.log(customerName)
    // const projectTitle = QuotationData.project.titel != undefined && QuotationData.project.titel.replace(/\s+/g, '');
    // console.log(QuotationData.project.titel === undefined );
    if (QuotationData.project.titel !== undefined ){
      const projectTitle = QuotationData.project.titel.replace(/\s+/g, '') 
      console.log(projectTitle)
      const pdfPath = customerEnglish ? `${keingartenDate}-Quotation-${customerName}-${projectTitle}-keingarten.pdf` : `${keingartenDate}-KVA-${customerName}-${projectTitle}-keingarten.pdf`;  
      saveAs(blob, pdfPath);

      if (invoiceNr !== null){
        const docInvoice = customerEnglish 
        ? <InvoiceEnglish data={QuotationData} taxRate={taxRate} /> 
        : <Invoice data={QuotationData} taxRate={taxRate} />; 
        const blobInvoice = await pdf(docInvoice).toBlob();
        const pdfPathInvoice = customerEnglish ? `${keingartenDate}-Invoice-${customerName}-${projectTitle}-keingarten.pdf` : `${keingartenDate}-Rechnung-${customerName}-${projectTitle}-keingarten.pdf`;  
        saveAs(blobInvoice, pdfPathInvoice);
      }
    } else {
      setShowErrorModal(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Custom Bootstrap validation

    if (await isFormValid()) {
      handleDownload();
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
      <ErrorModal show={showErrorModal} handleClose={handleCloseError} message='Can not get title. Please go through all tabs once.' />; 
    </div>
  );
};

export default Tabs;
