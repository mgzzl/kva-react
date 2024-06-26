// src/Quotation.tsx
import React, { Fragment } from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image, Line, Svg, Link } from '@react-pdf/renderer';
import logo from '../kg_logo.png'
import signature from '../kg_signe.png'
import OpenSansRegular from '../assets/fonts/OpenSans-Regular.ttf'
import OpenSansBold from '../assets/fonts/OpenSans-Bold.ttf'


// Register fonts
Font.register({
  family: 'OpenSans',
  fonts: [
    { src: OpenSansRegular, fontWeight: 'normal' },
    { src: OpenSansBold, fontWeight: 'bold' },
  ],
});

// Register fonts
// Font.register({
//   family: 'Acumin',
//   fonts: [
//     { src: Acumin, fontWeight: 'normal' },
//     { src: Acumin, fontWeight: 'bold' },
//   ],
// });

const styles = StyleSheet.create({
  page: {
    fontFamily: 'OpenSans',
    fontSize: 10,
    // paddingVertical: '13mm',
    paddingTop: '8mm',
    paddingBottom: '15mm',
    paddingHorizontal: '15.5mm',
    lineHeight: 1.25,
    flexDirection: 'column'
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  container: {
    paddingTop: 10
  },
  logo: {
    width: 100,
    paddingBottom: '3mm'
  },
  address: {
    lineHeight: 1.5
  },
  theader: {
    fontSize: 10,
    flex: 1
  },
  theader2: {
    flex: 2
  },
  tbody: {
    fontSize: 9,
    paddingTop: 4,
    paddingLeft: 0,
    flex: 1
  },
  tbody2: {
    flex: 2
  },
  offerTitle: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  categoryTitle: {
    fontWeight: 'bold'
  },
  text: {
    fontSize: 10,
  },
  signatureText: {
    margin: 10,
    marginTop: 3,
    fontSize: 10,
    textAlign: 'justify',
  },
  signatureLogo: {
    marginTop: '6.5mm',
    width: 30
  },
  pageBottom: {
    position: 'relative',
    left: 0,
    bottom: 0,
    right: 0,
    lineHeight: 1.25,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightAligned: {
    flexDirection: 'row-reverse',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 9,
    bottom: '7mm',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  ul: {
    width: '30%',
  },
  value: {
    width: '70%'
  }

});

interface QuotationProps {
  data: {
    customer: {
      name: string;
      secname: string;
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
    };
    project: {
      titel: string;
      auftrag: string;
      optionalText?: string;
      anzahlKorrekturschleifen: number;
      preisKorrekturschleifen: number,
      paymentOptions: string;
      usageTypes: string;
      usageDurations: string;
      usageScopes: string;
      usageAreas: string;
    };
    items: Array<{
      id: number;
      position: string;
      subItems: Array<{
        name: string;
        rate: number;
        hours: number;
        total: number;
        checked: boolean;
      }>;
    }>;
  };
  // logo: string;
  taxRate: number;
}

const Quotation: React.FC<QuotationProps> = ({ data, taxRate }) => {
  const { customer, keingarten, project, items } = data;

  const filteredItems = items.flatMap(item =>
    item.subItems.filter(subItem => subItem.checked).map(subItem => ({
      position: item.position,
      ...subItem
    }))
  );

  const subtotal = filteredItems.reduce((sum, item) => {
    const rate = item.position === 'Other' && item.rate === 0 ? 'pauschal' : item.rate;
    console.log("subtotal rate", rate)
    const hours = item.position === 'Other' ? 1 : item.hours; // Adjust hours if necessary based on condition
    console.log("subtotal hours", hours)

    // If rate is 'pauschal', handle the calculation accordingly. pauschal means 0 for simplicity
    const rateValue = rate === 'pauschal' ? 0 : rate;

    return sum + rateValue * hours;
  }, 0);

  const tax = subtotal * (taxRate / 100);
  const grandTotal = subtotal + tax;

  const Header = () => (
    <View style={styles.centered}>
      <Image style={styles.logo} src={logo} />
    </View>
  );

  const SubHeader = () => (
    <View style={styles.container}>
      <View style={[styles.label, styles.address]}>
        <View>
          <Text style={styles.categoryTitle}>Kostenvoranschlag</Text>
          <Text>"{project.titel}"</Text>
        </View>
        <View>
          <Text style={styles.categoryTitle}>Kontaktperson</Text>
          <Text>{keingarten.contactPerson}</Text>
        </View>
        <View>
          <Text style={styles.categoryTitle}>{new Intl.DateTimeFormat('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).format(new Date(keingarten.date))}</Text>
        </View>
      </View>
    </View>
  );

  const Address = () => (
    <View style={[styles.address, styles.container]}>
      <View style={styles.label}>
        <Text style={styles.categoryTitle}>{customer.name}</Text>
        <Text style={styles.categoryTitle}>keingarten</Text>
      </View>
      <View style={styles.label}>
        <Text>{customer.secname}</Text>
        <Text>Bissantz, Lörinc, Lorenz, Brozmann GbR</Text>
      </View>
      <View style={styles.label}>
        <Text>{customer.street} {customer.streetNumber}</Text>
        <Text>{keingarten.street} {keingarten.streetNumber}</Text>
      </View>
      <View style={styles.label}>
        <Text>{customer.zip} {customer.city}</Text>
        <Text>{keingarten.zip} {keingarten.city}</Text>
      </View>
      <View style={styles.label}>
        <Text>{customer.country}</Text>
        <Text>{keingarten.country}</Text>
      </View>
      <View style={styles.label}>
        <Text></Text>
        <Text>hello@keingarten.de</Text>
      </View>
    </View>
  );

  const Angebot = () => (
    <View>
      <View style={styles.container}>
        <Text style={styles.offerTitle}>Angebot "{project.titel}"</Text>
        <View style={styles.container}>
          <Text style={styles.text}>Dies ist ein unverbindliches Angebot. Die Preise können bis Abschluss des Projektes abweichen. Bei einer wesentlichen Kostenüberschreitung wird der Kunde unverzüglich in Kenntnis gesetzt.</Text>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.categoryTitle}>Auftrag:</Text>
        <Text style={styles.text}>{project.auftrag}</Text>
      </View>
    </View>
  );

  const Korrektur = () => {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.categoryTitle}>Korrekturen:</Text>
          {project.anzahlKorrekturschleifen > 1 && (
            <Text style={styles.text}>Im Angebot sind {project.anzahlKorrekturschleifen} Korrekturschleifen enthalten.</Text>
          )}
          {project.anzahlKorrekturschleifen < 1 && (
            <Text style={styles.text}>Im Angebot sind keine Korrekturschleifen enthalten.</Text>
          )}
          {project.anzahlKorrekturschleifen === 1 && (
            <Text style={styles.text}>Im Angebot ist eine Korrekturschleife enthalten.</Text>
          )}
          <Text style={styles.text}>Darüberhinausgehende Korrekturen werden mit {project.preisKorrekturschleifen} € je Stunde berechnet.</Text>
        </View>
      </View>
    );
  };

  const Abgabe = () => (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>Abgabe:</Text>
      <Text style={styles.text}>Die Lieferung der Daten erfolgt nach gemeinsamer Absprache.</Text>
    </View>
  );

  const Zahlungsbedingungen = () => (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>Zahlungsbedingungen:</Text>
      <View style={styles.row}>
        <Text style={[styles.text, { width: '45%' }]}>Abschlusszahlung nach Lieferung der Daten:</Text>
        <Text style={[styles.text, { width: '50%' }]}>{project.paymentOptions}</Text>
      </View>
    </View>
  );

  const Nutzungsrechte = () => (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>Nutzungsrechte:</Text>
      <View style={styles.row}>
        <Text style={[styles.text, styles.ul]}>Nutzungsart:</Text>
        <Text style={[styles.text, styles.value]}>{project.usageTypes}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.text, styles.ul]}>Nutzungsdauer:</Text>
        <Text style={[styles.text, styles.value]}>{project.usageDurations}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.text, styles.ul]}>Nutzungsumfang:</Text>
        <Text style={[styles.text, styles.value]}>{project.usageScopes}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.text, styles.ul]}>Nutzungsgebiet:</Text>
        <Text style={[styles.text, styles.value]}>{project.usageAreas}</Text>
      </View>
    </View>
  );

  const BaseText = () => (
    <View style={styles.container} wrap={false}>
      <Text style={[styles.text, styles.container]}>Diese Rechteeinräumung umfasst das Recht auf Weiterübertragung an Dritte nach Genehmigung des Auftragnehmers. Ausgeschlossen sind offene Arbeitsdateien.</Text>
      <Text style={[styles.text, styles.container]}>Skizzen und Darstellungen zur Ansicht sind nicht Bestandteil der Lieferung und an ihnen werden keine Nutzungsrechte eingeräumt. Sie dienen nur der Abstimmung zwischen Auftragnehmer und Auftraggeber. Es wird keine Rechtsberatung geleistet und die technische Bereitstellung bringt keine rechtliche Gewährleistung mit sich. Die rechtliche Prüfung der Webseite obliegt dem Kunden.</Text>
      <Text style={[styles.text, styles.container]}>Der Designer ist berechtigt, sämtliche in Erfüllung des Vertrages entstehenden Arbeiten zum Zwecke der Eigenwerbung in sämtlichen Medien unter namentlicher Nennung des Auftraggebers zu verwenden und im übrigen auf das Tätigwerden für den Auftraggeber hinzuweisen, sofern der Designer nicht über ein etwaiges entgegenstehendes Geheimhaltungsinteresse des Auftraggebers schriftlich in Kenntnis gesetzt wurde.</Text>
      <Text style={[styles.text, styles.container]}>Die Übertragung der vorgenannten Nutzungsrechte erfolgt nach vollständiger Bezahlung der Rechnung.</Text>
      <Text style={[styles.text]}>Es gelten die Allgemeinen Geschäftsbedingungen: <Link src='https://keingarten.com/agb/'>AGB</Link></Text>
    </View>
  );

  const BaseText2 = () => (
    <View style={styles.container} wrap={false}>
      <Text style={[styles.text, styles.container]}>Dies ist ein unverbindliches Angebot. Der Preis kann bis Abschluss des Projektes abweichen. Bei einer wesentlichen Kostenüberschreitung wird der Kunde unverzüglich in Kenntnis gesetzt.</Text>
      <Text style={[styles.text, { marginTop: 20 }]}>Wir würden uns sehr freuen das Projekt gemeinsam zu realisieren!</Text>
      <Text style={[styles.text]}>Für Rückfragen stehen wir gerne jederzeit zur Verfügung.</Text>
      <Text style={[styles.text, styles.container]}>Beste Grüße</Text>
      <Text style={[styles.text]}>keingarten</Text>
      <Image style={styles.signatureLogo} src={signature} />
    </View>
  );

  const Signature = () => (
    <View style={[styles.pageBottom, styles.container]}>
      <Text style={[styles.categoryTitle, styles.container]}>Einverständnis der Allgemeinen Geschäftsbedingungen</Text>
      <View style={styles.label}>
        <View>
          <Svg height="50" width="500">
            <Line
              x1={10} y1={50}
              x2={200} y2={50}
              stroke="black"
              strokeWidth={1}
            />
          </Svg>
          <Text style={styles.signatureText}>Ort, Datum</Text>
        </View>
        <View>
          <Svg height="50" width="500">
            <Line
              x1={10} y1={50}
              x2={200} y2={50}
              stroke="black"
              strokeWidth={1}
            />
          </Svg>
          <Text style={styles.signatureText}>Unterschrift Auftraggeber</Text>
        </View>
      </View>
    </View>
  );

  const TableHead = () => (
    <View style={{ marginTop: 5 }}>
      <Svg height={20} width="100%">
        <Line
          x1={0} y1={10}
          x2={1000} y2={10}
          stroke="black"
          strokeWidth={1}
        />
      </Svg>
      <View style={{ width: '100%', flexDirection: 'row' }}>
        <View style={styles.theader}>
          <Text>Pos.</Text>
        </View>
        <View style={[styles.theader, styles.theader2]}>
          <Text >Name</Text>
        </View>
        <View style={[styles.theader, styles.theader2]}>
          <Text >Beschreibung</Text>
        </View>
        <View style={[styles.theader, styles.rightAligned]}>
          <Text>Satz</Text>
        </View>
        <View style={[styles.theader, styles.centered]}>
          <Text>Stunden</Text>
        </View>
        <View style={[styles.theader, styles.rightAligned]}>
          <Text>Gesamt</Text>
        </View>
      </View>
      <Svg height={20} width="100%">
        <Line
          x1={0} y1={10}
          x2={1000} y2={10}
          stroke="black"
          strokeWidth={1}
        />
      </Svg>
    </View>
  );


  const TableBody = () => (
    <View>
      {items.flatMap(item => { // for each item in the items array, we flatmap to get a new array with subItems
        const filteredSubItems = item.subItems.filter(subItem => subItem.checked); // filter the checked subItems

        return ( // return the JSX elements for this item and its filtered subItems
          <View key={item.id} wrap={false}>
            {filteredSubItems.map((subItem, index) => ( // map over each filtered subItem
              <Fragment key={`${item.id}-${index}`}>
                <View style={{ width: '100%', flexDirection: 'row', paddingBottom: index === filteredSubItems.length - 1 ? 10 : 0 }}> {/* add some padding at the bottom of the last row */}
                  <View style={[styles.tbody]}>
                    {index === 0 && <Text>{item.id}</Text>}
                  </View>
                  <View style={[styles.tbody, styles.tbody2]}>
                    {index === 0 && <Text>{item.position}</Text>}
                  </View>
                  <View style={[styles.tbody, styles.tbody2]}>
                    <Text>{subItem.name}</Text>
                  </View>
                  <View style={[styles.tbody, styles.rightAligned]}>
                    <Text>
                      {item.position === 'Other' && subItem.rate === 0
                        ? 'pauschal'
                        : subItem.rate.toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' €'}
                    </Text>
                  </View>
                  <View style={[styles.tbody, styles.centered]}>
                    <Text>{item.position === 'Other'
                      ? ''
                      : subItem.hours}</Text>
                  </View>
                  <View style={[styles.tbody, styles.rightAligned]}>
                    <Text>
                      {item.position === 'Other' && subItem.rate === 0
                        ? 'pro bono'
                        : subItem.total.toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' €'}
                    </Text>
                  </View>
                </View>
              </Fragment>
            ))}
          </View>
        );
      })}
    </View>
  );

  const SubTotal = () => (
    <View style={{ width: '100%', flexDirection: 'row', lineHeight: 1.5 }}>
      <View style={styles.theader}>
        <Text></Text>
      </View>
      <View style={[styles.theader, styles.theader2]}>
        <Text ></Text>
      </View>
      <View style={[styles.theader, styles.theader2]}>
        <Text >Zwischensumme</Text>
      </View>
      <View style={[styles.theader, styles.centered]}>
        <Text></Text>
      </View>
      <View style={[styles.theader, styles.centered]}>
        <Text></Text>
      </View>
      <View style={[styles.theader, styles.rightAligned]}>
        <Text>
          {subtotal.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
        </Text>
      </View>
    </View>
  );

  const TaxTotal = () => (
    <View style={{ width: '100%', flexDirection: 'row' }}>
      <View style={styles.theader}>
        <Text></Text>
      </View>
      <View style={[styles.theader, styles.theader2]}>
        <Text ></Text>
      </View>
      <View style={[styles.theader, styles.theader2]}>
        <Text >Steuersatz 19%</Text>
      </View>
      <View style={[styles.theader, styles.centered]}>
        <Text></Text>
      </View>
      <View style={[styles.theader, styles.centered]}>
        <Text></Text>
      </View>
      {customer.reverseCharge
        ?
        <View style={[styles.tbody, styles.rightAligned, {paddingTop: 0}]}>
          <Text>
            Reverse charge
          </Text>
        </View>
        :
        <View style={[styles.theader, styles.rightAligned]}>
          <Text>
            {tax.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
          </Text>
        </View>
      }
    </View>
  );

  const GradTotal = () => (
    <View style={{ width: '100%', flexDirection: 'row' }}>
      <View style={styles.theader}>
        <Text></Text>
      </View>
      <View style={[styles.theader, styles.theader2]}>
        <Text ></Text>
      </View>
      <View style={[styles.theader, styles.theader2]}>
        <Text >Gesamt</Text>
      </View>
      <View style={[styles.theader, styles.centered]}>
        <Text></Text>
      </View>
      <View style={[styles.theader, styles.centered]}>
        <Text></Text>
      </View>
      <View style={[styles.theader, styles.rightAligned]}>
        <Text>
          {grandTotal.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
        </Text>
      </View>
    </View>
  );

  const TableTotal = () => (
    <View wrap={false}>
      <Svg height={20} width="100%">
        <Line
          x1={0} y1={10}
          x2={1000} y2={10}
          stroke="black"
          strokeWidth={1}
        />
      </Svg>
      <SubTotal />
      <TaxTotal />
      <Svg height={20} width="100%">
        <Line
          x1={0} y1={10}
          x2={1000} y2={10}
          stroke="black"
          strokeWidth={2}
        />
      </Svg>
      <GradTotal />
      <Svg height={25} width="100%">
        <Line
          x1={0} y1={10}
          x2={1000} y2={10}
          stroke="black"
          strokeWidth={1}
        />
      </Svg>
    </View>
  );
  const OptionalText = () => (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.categoryTitle}>Optionaler Text</Text>
      <Text style={[styles.text, styles.container]}>{project.optionalText}</Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View fixed>
          <Header />
        </View>
        <View >
          <Angebot />
          <Korrektur />
          <Abgabe />
          <Zahlungsbedingungen />
          <Nutzungsrechte />
          <BaseText />
          <Signature />
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Seite ${pageNumber} von ${totalPages}`
        )} fixed />
      </Page>
      <Page size="A4" style={styles.page}>
        <View fixed>
          <Header />
          <Address />
          <SubHeader />
          <TableHead />
        </View>
        <TableBody />
        <View wrap={false}>
          <TableTotal />
          <BaseText2 />
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Seite ${pageNumber} von ${totalPages}`
        )} fixed />
      </Page>
      {project.optionalText !== "" ? (
        <Page size="A4" style={styles.page}>
          <View fixed>
            <Header />
            <Address />
            <SubHeader />
          </View>
          <OptionalText />
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `Seite ${pageNumber} von ${totalPages}`
          )} fixed />
        </Page>
      ) : null}
    </Document>
  );
};

export default Quotation;
