import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const contactPersons = [
    { value: 'Johannes Bissantz', label: 'Johannes Bissantz' },
    { value: 'Andreas Lörinc', label: 'Andreas Lörinc' },
    { value: 'Artur Brozmann', label: 'Artur Brozmann' }
];

interface FormData {
    customer: {
        name: string;
        street: string;
        streetNumber: string;
        zip: string;
        city: string;
        country: string;
        reverseCharge: boolean;
        english: boolean;
    };
    keingarten: {
        contactPerson: string;
        date: string;
        street: string;
        streetNumber: string;
        zip: string;
        city: string;
        country: string;
        invoiceNr: number;
    };
}

interface Step1Props {
    values: FormData;
    onChange: (value: FormData) => void;
}

const Step1: React.FC<Step1Props> = ({ values, onChange }) => {
    const [formData, setFormData] = useState<FormData>(
        values || {
            customer: {
                name: '',
                street: '',
                streetNumber: '',
                zip: '',
                city: '',
                country: '',
                reverseCharge: false,
                english: false
            },
            keingarten: {
                contactPerson: '',
                date: new Date().toISOString().split('T')[0],
                // date: new Date().toLocaleDateString('de'),
                street: 'Schreyerstraße',
                streetNumber: '21',
                zip: '90443',
                city: 'Nürnberg',
                country: 'Deutschland',
                invoiceNr: null
            }
        }
    );

    useEffect(() => {
        onChange(formData);
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            if (name.startsWith('customer.')) {
                const field = name.split('.')[1];
                setFormData(prevState => ({
                    ...prevState,
                    customer: {
                        ...prevState.customer,
                        [field]: checked
                    }
                }));
            } else if (name.startsWith('keingarten.')) {
                const field = name.split('.')[1];
                setFormData(prevState => ({
                    ...prevState,
                    keingarten: {
                        ...prevState.keingarten,
                        [field]: checked
                    }
                }));
            }
        } else {
            if (name.startsWith('customer.')) {
                const field = name.split('.')[1];
                setFormData(prevState => ({
                    ...prevState,
                    customer: {
                        ...prevState.customer,
                        [field]: value
                    }
                }));
            } else if (name.startsWith('keingarten.')) {
                const field = name.split('.')[1];
                setFormData(prevState => ({
                    ...prevState,
                    keingarten: {
                        ...prevState.keingarten,
                        [field]: value
                    }
                }));
            }
        }
    };
    

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     console.log(formData)
    // };

    return (
        <div className="container mt-5">
            <form className="needs-validation" noValidate>
                <div className="row">
                    <div className="col-5">
                        <div className="mb-3">
                            <h4 className="mb-3">Kunde</h4>
                            <label className="form-label">
                                Firmenname:</label>
                            <input
                                type="text"
                                value={formData.customer.name}
                                className="form-control"
                                placeholder="Musterfirma GmbH"
                                name="customer.name"
                                onChange={handleChange}
                                required
                            />

                            <div className="invalid-feedback">
                                Bitte geben Sie den Firmennamen ein.
                            </div>
                        </div>
                        <div className="mb-3">
                            <h6 className="mb-3">Firmenadresse</h6>
                            <div className="row">
                                <div className="col">
                                    <label className="form-label">
                                        Straße:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Musterstraße"
                                        name="customer.street"
                                        value={formData.customer.street}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Bitte geben Sie die Straße ein.
                                    </div>
                                </div>
                                <div className="col-3">
                                    <label className="form-label">
                                        Hausnummer:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="42"
                                        name="customer.streetNumber"
                                        value={formData.customer.streetNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Bitte geben Sie die Hausnummer ein.
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <label className="form-label mt-3">
                                        PLZ:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="90420"
                                        name="customer.zip"
                                        value={formData.customer.zip}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Bitte geben Sie die Postleitzahl ein.
                                    </div>
                                </div>
                                <div className="col">
                                    <label className="form-label mt-3">
                                        Ort:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Musterstadt"
                                        name="customer.city"
                                        value={formData.customer.city}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Bitte geben Sie den Ort ein.
                                    </div>
                                </div>
                            </div>
                            <label className="form-label mt-3">
                                Land:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Musterland"
                                name="customer.country"
                                value={formData.customer.country}
                                onChange={handleChange}
                                required
                            />
                            <div className="invalid-feedback">
                                Bitte geben Sie das Land ein.
                            </div>
                            <div className="form-check mt-3">
                                <label className="form-check-label">Reverse-Charge</label>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="customer.reverseCharge"
                                    checked={formData.customer.reverseCharge}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-check mt-3">
                                <label className="form-check-label">Englisch</label>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="customer.english"
                                    checked={formData.customer.english}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* <div className="d-flex align-items-center">
                            </div>
                                <label className="form-label mt-3">
                                Reverse Charge:</label>
                                <input 
                                    type="checkbox" 
                                    className="form-check-input" 
                                    name="customer.reverseCharge" 
                                    checked={formData.customer.reverseCharge}
                                    onChange={handleChange}  
                                />
                                    reverse charge */}
                        </div>
                    </div>
                    <div className="vr"></div>
                    <div className="col">
                        <h4 className="mb-3">Intern</h4>
                        <div className="row mb-3">
                            <div className="col">
                                <label className="form-label">
                                    Kontaktperson:</label>
                                <select
                                    className="form-select"
                                    name="keingarten.contactPerson"
                                    value={formData.keingarten.contactPerson}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Bitte wählen</option>
                                    {contactPersons.map(person => (
                                        <option key={person.value} value={person.value}>
                                            {person.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">
                                    Bitte geben Sie die Kontaktperson ein.
                                </div>
                            </div>
                            <div className="col">
                                <label className="form-label">
                                    Datum:</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="keingarten.date"
                                    value={formData.keingarten.date}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="invalid-feedback">
                                    Bitte wählen Sie ein Datum.
                                </div>
                            </div>
                        </div>
                        <h6 className="mb-3">Adresse</h6>
                        <div className="row">
                            <div className="col">
                                <label className="form-label">
                                    Straße:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="keingarten.street"
                                    value={formData.keingarten.street}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="invalid-feedback">
                                    Bitte geben Sie die Straße ein.
                                </div>
                            </div>
                            <div className="col-3">
                                <label className="form-label">
                                    Hausnummer:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="keingarten.streetNumber"
                                    value={formData.keingarten.streetNumber}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="invalid-feedback">
                                    Bitte geben Sie die Hausnummer ein.
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <label className="form-label mt-3">
                                    PLZ:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="keingarten.zip"
                                    value={formData.keingarten.zip}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="invalid-feedback">
                                    Bitte geben Sie die Postleitzahl ein.
                                </div>
                            </div>
                            <div className="col">
                                <label className="form-label mt-3">
                                    Ort:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="keingarten.city"
                                    value={formData.keingarten.city}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="invalid-feedback">
                                    Bitte geben Sie den Ort ein.
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label mt-3">
                                Land:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="keingarten.country"
                                value={formData.keingarten.country}
                                onChange={handleChange}
                                required
                            />
                            <div className="invalid-feedback">
                                Bitte geben Sie das Land ein.
                            </div>
                        </div>
                        <div>
                            <h6 className='mb-3'>Rechnung?</h6>
                            <label htmlFor="invoiceNr" className="form-label">Rechnungsnummer:</label>
                            <input 
                            type="number" 
                            id="invoiceNr"
                            className="form-control" 
                            name="keingarten.invoiceNr"
                            placeholder='123'
                            value={formData.keingarten.invoiceNr} 
                            onChange={handleChange}
                            aria-describedby="invoiceHelp"
                            />
                            <small id="invoiceHelp" className="form-text text-muted">Füge eine Rechnungsnummer hinzu, falls eine Rechnung benötigt wird.</small>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Step1;
