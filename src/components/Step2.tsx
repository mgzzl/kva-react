import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const paymentOptions = [
    { value: 'Teilzahlung', label: 'Mit Anzahlung (25%)' },
    { value: 'Gesamtsumme', label: 'Ohne Anzahlung (Gesamtsumme)' }
];

const usageTypes = [
    { value: 'Eingeschränkte Ausschließlichkeit', label: 'Eingeschränkte Ausschließlichkeit' }
];

const usageDurations = [
    { value: '1 Jahr', label: '1 Jahr' },
    { value: '2 Jahre', label: '2 Jahre' },
    { value: 'unbegrenzt', label: 'Unbegrenzt' }
];

const usageScopes = [
    { value: 'umfangreich', label: 'Umfangreich (keine Eingeschränkungen)' },
    { value: 'eingeschränkt', label: 'Eingeschränkt' }
];

const usageAreas = [
    { value: 'europa', label: 'Europa' },
    { value: 'global', label: 'Global' }
];


interface FormData {
    titel: string;
    auftrag: string;
    optionalText: string;
    anzahlKorrekturschleifen: number;
    preisKorrekturschleifen: number,
    paymentOptions: string;
    usageTypes: string;
    usageDurations: string;
    usageScopes: string;
    usageAreas: string;
}

interface Step2Props {
    values: FormData;
    onChange: (value: FormData) => void;
  }

  const Step2: React.FC<Step2Props> = ({ values, onChange }) => {
    const [formData, setFormData] = useState<FormData>(
    values || {
        titel: '',
        auftrag: '',
        optionalText: '',
        anzahlKorrekturschleifen: 1,
        preisKorrekturschleifen: 140,
        paymentOptions: 'Gesamtsumme',
        usageTypes: 'Eingeschränkte Ausschließlichkeit',
        usageDurations: 'unbegrenzt',
        usageScopes: 'umfangreich',
        usageAreas: 'global'
    });

    useEffect(() => {
        onChange(formData);
      }, [formData]);
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="container mt-5">
            <form className="needs-validation" noValidate>
            <div className="mt-5 mb-3">
                <h4 className="mb-3">Angebot</h4>
                <label htmlFor="titel" className="form-label">Titel:</label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="titel" 
                    name="titel"
                    placeholder="adidas Retail Cup Trophy" 
                    value={formData.titel}
                    onChange={handleChange}
                    required 
                />
                <div className="invalid-feedback">
                    Bitte geben Sie den Titel ein.
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="auftrag" className="form-label">Auftrag:</label>
                <textarea 
                    className="form-control" 
                    id="auftrag" 
                    name="auftrag"
                    placeholder="- Entwicklung drei verschiedener visueller Ansätze für den Adidas Retail Cup Pokal und Anlieferung Druckfertiger 3D Daten."
                    value={formData.auftrag}
                    onChange={handleChange}
                    required 
                ></textarea>
                <div className="invalid-feedback">
                    Bitte geben Sie den Auftrag ein.
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="optionalText" className="form-label">Optionaler Text:</label>
                <textarea 
                    className="form-control" 
                    id="optionalText" 
                    name="optionalText"
                    placeholder="Optionaler Text.."
                    value={formData.optionalText}
                    onChange={handleChange} 
                    aria-describedby="optionalTextHelp"
                ></textarea>
                {/* <div className="invalid-feedback">
                    Bitte geben Sie einen optionalen Text ein, falls nötig.
                </div> */}
                <small id="optionalTextHelp" className="form-text text-muted">Füge einen optionalen Text hinzu, falls nötig.</small>
            </div>
            <hr />
            <h6 className="mb-3">Korrektur</h6>
            <div className="row">
                <div className="col mb-3">
                    <label htmlFor="anzahlKorrekturschleifen" className="form-label">Anzahl gewährter Korrekturschleifen:</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        id="anzahlKorrekturschleifen"
                        name="anzahlKorrekturschleifen" 
                        value={formData.anzahlKorrekturschleifen} 
                        min="0" 
                        onChange={handleChange}
                        required 
                    />
                    <div className="invalid-feedback">
                        Bitte geben Sie eine Anzahl an gewährten Korrekturschleifen ein.
                    </div>
                </div>
                <div className="col mb-3">
                    <label htmlFor="preisKorrekturschleifen" className="form-label">Preis pro darüber hinausgehende Korrekturschleife (in €):</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        id="preisKorrekturschleifen"
                        name="preisKorrekturschleifen" 
                        value={formData.preisKorrekturschleifen} 
                        readOnly 
                    />
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="paymentOptions" className="form-label">Zahlungsbedingungen:</label>
                <select 
                    className="form-select" 
                    id="paymentOptions" 
                    name="paymentOptions"
                    value={formData.paymentOptions}
                    onChange={handleChange}
                    required
                >
                    <option value="">Bitte wählen</option>
                    {paymentOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="invalid-feedback">
                    Bitte wählen Sie die Zahlungsbedingungen.
                </div>
            </div>
            <div className="mb-3">
                <h6 className="mb-3">Nutzungsrechte</h6>
                <div className="row">
                    <div className="col mb-3">
                        <label htmlFor="usageTypes" className="form-label">Nutzungsart:</label>
                        <select 
                            className="form-select" 
                            id="usageTypes" 
                            name="usageTypes"
                            value={formData.usageTypes}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Bitte wählen</option>
                            {usageTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            Bitte wählen Sie die Nutzungsart.
                        </div>
                    </div>
                    <div className="col mb-3">
                        <label htmlFor="usageDurations" className="form-label">Nutzungsdauer:</label>
                        <select 
                            className="form-select" 
                            id="usageDurations" 
                            name="usageDurations"
                            value={formData.usageDurations}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Bitte wählen</option>
                            {usageDurations.map(duration => (
                                <option key={duration.value} value={duration.value}>
                                    {duration.label}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            Bitte wählen Sie die Nutzungsdauer.
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <label htmlFor="usageScopes" className="form-label">Nutzungsumfang:</label>
                        <select 
                            className="form-select" 
                            id="usageScopes" 
                            name="usageScopes"
                            value={formData.usageScopes}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Bitte wählen</option>
                            {usageScopes.map(scope => (
                                <option key={scope.value} value={scope.value}>
                                    {scope.label}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            Bitte wählen Sie den Nutzungsumfang.
                        </div>
                    </div>
                    <div className="col mb-3">
                        <label htmlFor="usageAreas" className="form-label">Nutzungsgebiet:</label>
                        <select 
                            className="form-select" 
                            id="usageAreas" 
                            name="usageAreas"
                            value={formData.usageAreas}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Bitte wählen</option>
                            {usageAreas.map(area => (
                                <option key={area.value} value={area.value}>
                                    {area.label}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            Bitte wählen Sie das Nutzungsgebiet.
                        </div>
                    </div>
                </div>
            </div>
        </form>
        </div>
    );
}

export default Step2;
