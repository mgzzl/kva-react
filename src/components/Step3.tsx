import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getInputCookie, setInputCookie } from '../utils/cookies';


const options = {
    "Bitte wählen": [],
    "Client Services": ["Project Manager", "Account Manager"],
    "Creative": ["Creative Director", "Creative", "Designer", "Motion Designer", "Copywriter"],
    "Print": ["Graphic Designer", "Layouter"],
    "Pre Production": ["Location Scout"],
    "Production": ["Director", "Creative Producer", "DOP", "1st AC", "VFX / 3D-Supervisor", "DIT"],
    "CGI & VFX": ["3D / VFX Art Director", "3D Generalist", "3D Animator", "3D Simulator", "Digital Fashion Designer", "Texture Artist", "Render & Lighting Artist", "3D Character Animator"],
    "Animation": ["2D Animator", "Background Artist", "Character Animator", "Key Frame Animator"],
    "Post Production": ["Post Producer", "Editor", "Roto / Paint Artist", "Colourist", "3D Compositor", "Sound Designer", "Graphic Designer"],
    "Other": ["Workstation", "Licensing", "Render fee", "Travel fee", "Rental"]
} as const;

const rates = {
    "Project Manager": 80,
    "Account Manager": 80,
    "Creative Director": 140,
    "Creative": 90,
    "Designer": 75,
    "Motion Designer": 85,
    "Copywriter": 80,
    "Graphic Designer": 85,
    "Layouter": 85,
    "Location Scout": 90,
    "Director": 150,
    "Creative Producer": 120,
    "DOP": 100,
    "1st AC": 85,
    "VFX / 3D-Supervisor": 100,
    "DIT": 90,
    "3D / VFX Art Director": 125,
    "3D Generalist": 100,
    "3D Animator": 110,
    "3D Simulator": 115, 
    "Digital Fashion Designer": 100,
    "Texture Artist": 80,
    "Render & Lighting Artist":100,
    "3D Character Animator": 115,
    "2D Animator": 95,
    "Background Artist": 85,
    "Character Animator": 110, 
    "Key Frame Animator": 100,
    "Post Producer": 85, 
    "Editor": 130, 
    "Roto / Paint Artist": 90, 
    "Colourist": 110, 
    "3D Compositor": 110, 
    "Sound Designer": 90, 
    "Workstation": 800,
    "Licensing": 0,
    "Render fee": 0,
    "Travel fee": 0,
    "Rental": 0
};

type OptionsKeys = keyof typeof options;
type RatesKeys = keyof typeof rates;

interface SubItem {
    name: RatesKeys;
    rate: number;
    hours: number;
    total: number;
    checked: boolean;
}

interface Item {
    id: number;
    position: OptionsKeys;
    subItems: SubItem[];
}

interface Step3Props {
    values: Item[];
    onChange: (items: Item[]) => void;
}

const Step3: React.FC<Step3Props> = ({ values, onChange }) => {
    const getInitialItemsFromCookie = (): Item[] => {
        const cookieItems: Item[] = [];
        const cookieNames = document.cookie.split(';').map(cookie => cookie.trim());
        cookieNames.forEach(cookieName => {
            // console.log('Cookie name:', cookieName)
            if (cookieName.startsWith('item_')) {
                // console.log('Cookie found:', cookieName)
                const itemId = parseInt(cookieName.substring(5));
                // console.log('item id', itemId)
                const cookieValue = getInputCookie(`item_${itemId}`);
                console.log(cookieValue)
                if (cookieValue) {
                    try {
                        const parsedItem = JSON.parse(cookieValue);
                        cookieItems.push(parsedItem);
                    } catch (error) {
                        console.error(`Error parsing cookie for item_${itemId}:`, error);
                    }
                }
            }
        });
        return cookieItems;
    };
    // const [items, setItems] = useState<Item[]>(values || [{ id: 1, position: 'Bitte wählen', subItems: []}]);
    const [items, setItems] = useState<Item[]>(() => {
        const initialItems = getInitialItemsFromCookie(); // Function to retrieve initial items from cookie
        return initialItems.length > 0 ? initialItems : values || [{ id: 1, position: 'Bitte wählen', subItems: [] }];
    })
    const [subTotal, setSubTotal] = useState(0);

    useEffect(() => {
        onChange(items);
        updateSubTotal(items);
        console.log(items);
        items.forEach(item => {
            setInputCookie(`item_${item.id}`, JSON.stringify(item));
            console.log(`item_${item.id}`, JSON.stringify(item));
        });
    }, [items]);



    const handleAddItem = () => {
        setItems([...items, { id: items.length + 1, position: 'Bitte wählen', subItems: []}]);
      };

      const handleDeleteAllItems = () => {
        setItems([]);
        updateSubTotal([]);
    };
    

    const handleDeleteItem = (id: number) => {
        const newItems = items.filter(item => item.id !== id);
        setItems(updateItemIds(newItems));
        updateSubTotal(newItems);
    };

    const updateItemIds = (items: Item[]) => {
        return items.map((item, index) => ({
            ...item,
            id: index + 1
        }));
    };

    const handlePositionChange = (index: number, value: OptionsKeys) => {
        const newItems = [...items];
        newItems[index].position = value;
        newItems[index].subItems = options[value].map(subItem => ({
            name: subItem as RatesKeys,
            rate: rates[subItem as RatesKeys],
            hours: 0,
            total: 0,
            checked: false
        }));
        setItems(newItems);
        updateSubTotal(newItems);
    };

    const handleSubItemChange = (itemIndex: number, subItemIndex: number, checked: boolean, hours: number, rate:number) => {
        const newItems = [...items];
        const subItem = newItems[itemIndex].subItems[subItemIndex];
        subItem.checked = checked;
        subItem.rate = rate

        if (newItems[itemIndex].position === 'Other') {
            subItem.total = checked ? subItem.rate : 0;
            subItem.hours = 0; // Hours are irrelevant for Workstation
        } else {
            subItem.hours = checked ? (hours === 0 ? 1 : hours) : 0;
            subItem.total = checked ? subItem.rate * subItem.hours : 0;
        }
        setItems(newItems);
        updateSubTotal(newItems);
    };
    

    const updateSubTotal = (items: Item[]) => {
        const subtotal = items.reduce((acc, item) => acc + item.subItems.reduce((subAcc, subItem) => subAcc + subItem.total, 0), 0);
        setSubTotal(subtotal);
    };

    const tax = subTotal * 0.19;
    const total = subTotal + tax;

    return (
        <div className="container mt-5">
            <form method="POST" action="/" className="needs-validation" noValidate>
                <div className="table-responsive-xl">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="col-1">Position</th>
                                <th className="col-3">Positionsname</th>
                                <th className="col-3">Unterposition</th>
                                <th className="col-2">Satz (€/h)</th>
                                <th className="col-1">Stunden</th>
                                <th className="col-2">Gesamt (€)</th>
                            </tr>
                        </thead>
                        <tbody id="kostenaufstellungBody">
                            {items.map((item, itemIndex) => (
                                <React.Fragment key={item.id}>
                                    <tr>
                                        <td>{item.id}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                    <button type="button" className="btn-close me-2" aria-label="Close" onClick={() => handleDeleteItem(item.id)}></button>
                                                    <select
                                                        className="form-select"
                                                        value={item.position}
                                                        onChange={e => handlePositionChange(itemIndex, e.target.value as OptionsKeys)}
                                                        required
                                                    >
                                                        {Object.keys(options).map(option => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                        </td>
                                        <td colSpan={4}></td>
                                    </tr>
                                    {item.subItems.map((subItem, subItemIndex) => (
                                        <tr key={subItemIndex}>
                                            <td></td>
                                            <td></td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={subItem.checked} 
                                                        onChange={e => handleSubItemChange(itemIndex, subItemIndex, e.target.checked, subItem.hours, subItem.rate)}
                                                        style={{ marginRight: '10px' }}
                                                    />
                                                    {subItem.name}
                                                </div>
                                            </td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    className="form-control" 
                                                    value={subItem.rate} 
                                                    onChange={e => handleSubItemChange(itemIndex, subItemIndex, subItem.checked, subItem.hours, parseFloat(e.target.value))}
                                                    disabled={!subItem.checked}
                                                    min="0"
                                                />

                                            </td>
                                            <td>
                                                {item.position === 'Other' ? (
                                                    <input 
                                                        type="number" 
                                                        className="form-control" 
                                                        value="" 
                                                        onChange={e => handleSubItemChange(itemIndex, subItemIndex, subItem.checked, parseFloat(e.target.value), subItem.rate)}
                                                        disabled={true}
                                                    />
                                                ) : (
                                                    <input 
                                                        type="number" 
                                                        className="form-control" 
                                                        value={subItem.hours} 
                                                        onChange={e => handleSubItemChange(itemIndex, subItemIndex, subItem.checked, parseFloat(e.target.value), subItem.rate)}
                                                        disabled={!subItem.checked}
                                                        min="0"
                                                    />
                                                )}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>{subItem.total.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'right' }}>Sub Total:</td>
                                <td style={{ textAlign: 'right' }}>{subTotal.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'right' }}>19% Steuer:</td>
                                <td style={{ textAlign: 'right' }}>{tax.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'right' }}>Total:</td>
                                <td style={{ textAlign: 'right' }}>{total.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="d-grid gap-2">
                    <button className="btn btn-primary" type="button" onClick={handleAddItem}>Position hinzufügen</button>
                    <button className="btn btn-danger" type="button" onClick={handleDeleteAllItems}>Alle Positionen löschen</button>
                </div>
            </form>
        </div>
    );
};

export default Step3;
