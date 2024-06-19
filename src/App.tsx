import React, { useState } from 'react';
import './App.css';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import logo from './kg_logo.svg'
import Tabs from './components/Tabs';

const App: React.FC = () => {
  const [tabValues, setTabValues] = useState(new Map<number, any>());

  const updateTabValues = (index: number, value: any) => {
    setTabValues((prevValues) => new Map(prevValues.set(index, value)));
  };

  const tabData = [
    {
      label: 'Header',
      content: <Step1 values={tabValues.get(0)} onChange={(value: any) => updateTabValues(0, value)} />,
    },
    {
      label: 'Angebot',
      content: <Step2 values={tabValues.get(1)} onChange={(value: any) => updateTabValues(1, value)} />,
    },
    {
      label: 'Kostenaufstellung',
      content: <Step3 values={tabValues.get(2)} onChange={(value: any) => updateTabValues(2, value)} />,
    },
  ];

  return (
    <div className='App'>
      <div className='text-center'>
        <img className='col-2 container m-3' src={logo} alt="logo" />
      </div>
      <h1>KVA Generator</h1>
      <div className='container'>
        <Tabs tabs={tabData} />
      </div>
    </div>
  );
}

export default App;
