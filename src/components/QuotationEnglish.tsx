// src/Quotation.tsx
import React, { Fragment } from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image, Line, Svg, Link } from '@react-pdf/renderer';
import logo from '../kg_logo_black_192px.png'
import signature from '../kg_signe.png'
import OpenSansRegular from '../assets/fonts/OpenSans-Regular.ttf'
import OpenSansBold from '../assets/fonts/OpenSans-Bold.ttf'
import Acumin from '../assets/fonts/Acumin_Variable_Concept.ttf'


// Register fonts
Font.register({
  family: 'OpenSans',
  fonts: [
    { src: OpenSansRegular, fontWeight: 'normal' },
    { src: OpenSansBold, fontWeight: 'bold' },
  ],
});

const translate = {
  "Teilzahlung": "partial payment",
  "Gesamtsumme": "total",
  "Eingeschränkte Ausschließlichkeit": 'limited exclusivity',
  "unbegrenzt": "unlimited",
  "1 Jahr": "1 Year",
  "2 Jahre": "2 Years",
  "umfangreich": "non-exclusive",
  "eingeschränkt": "exclusive",
  "global": "global",
  "europa": "europe"
};
type TranslateKeys = keyof typeof translate;


const styles = StyleSheet.create({
  page: {
    fontFamily: 'OpenSans',
    fontSize: 10,
    paddingVertical: '13mm',
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
    marginTop: 10
  },
  logo: {
    width: 120
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

const QuotationEnglish: React.FC<QuotationProps> = ({ data, taxRate }) => {
  const { customer, keingarten, project, items } = data;

  const filteredItems = items.flatMap(item =>
    item.subItems.filter(subItem => subItem.checked).map(subItem => ({
      position: item.position,
      ...subItem
    }))
  );

  const subtotal = filteredItems.reduce((sum, item) => {
    const rate = item.position === 'Other' && item.rate === 0 ? 'flat-rate' : item.rate;
    console.log("subtotal rate", rate)
    const hours = item.position === 'Other' ? 1 : item.hours; // Adjust hours if necessary based on condition
    console.log("subtotal hours", hours)

    // If rate is 'flat-rate', handle the calculation accordingly. flat-rate means 0 for simplicity
    const rateValue = rate === 'flat-rate' ? 0 : rate;

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
          <Text style={styles.categoryTitle}>Quotation</Text>
          <Text>"{project.titel}"</Text>
        </View>
        <View>
          <Text style={styles.categoryTitle}>Contact person</Text>
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
        <Text></Text>
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
        <Text style={styles.offerTitle}>Offer "{project.titel}"</Text>
        <View style={styles.container}>
          <Text style={styles.text}>This is a non-binding offer. Prices may vary until the project is completed. The customer will be informed immediately in the event of a significant cost overrun.</Text>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.categoryTitle}>Order:</Text>
        <Text style={styles.text}>{project.auftrag}</Text>
      </View>
    </View>
  );

  const Korrektur = () => {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.categoryTitle}>Feedback:</Text>
          {project.anzahlKorrekturschleifen > 1 && (
            <Text style={styles.text}>The offer includes {project.anzahlKorrekturschleifen} feedback loops.</Text>
          )}
          {project.anzahlKorrekturschleifen < 1 && (
            <Text style={styles.text}>The offer does not include feedback loops.</Text>
          )}
          {project.anzahlKorrekturschleifen === 1 && (
            <Text style={styles.text}>The offer includes one feedback loop.</Text>
          )}
          <Text style={styles.text}>Additional feedback will be charged at {project.preisKorrekturschleifen} € per hour.</Text>
        </View>
      </View>
    );
  };

  const Abgabe = () => (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>Delivery:</Text>
      <Text style={styles.text}>The delivery of the data takes place after mutual agreement.</Text>
    </View>
  );

  const Zahlungsbedingungen = () => (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>Terms of payment:</Text>
      <View style={styles.row}>
        <Text style={[styles.text, { width: '45%' }]}>Final payment after delivery of the data:</Text>
        <Text style={[styles.text, { width: '50%' }]}>{translate[project.paymentOptions as TranslateKeys]}</Text>
      </View>
    </View>
  );

  const Nutzungsrechte = () => (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>Rights of use:</Text>
      <View style={styles.row}>
        <Text style={[styles.text, styles.ul]}>Type of use:</Text>
        <Text style={[styles.text, styles.value]}>{translate[project.usageTypes as TranslateKeys]}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.text, styles.ul]}>Period of use:</Text>
        <Text style={[styles.text, styles.value]}>{translate[project.usageDurations as TranslateKeys]}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.text, styles.ul]}>Scope of use:</Text>
        <Text style={[styles.text, styles.value]}>{translate[project.usageScopes as TranslateKeys]}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.text, styles.ul]}>Area of use:</Text>
        <Text style={[styles.text, styles.value]}>{translate[project.usageAreas as TranslateKeys]}</Text>
      </View>
    </View>
  );

  const BaseText = () => (
    <View style={styles.container} wrap={false}>
      <Text style={[styles.text, styles.container]}>This granting of rights includes the right to further transfer to third parties after approval by the contractor. Open work files are excluded.</Text>
      <Text style={[styles.text, styles.container]}>Sketches and illustrations for viewing are not part of the delivery and no rights of use are granted to them. They only serve the purpose of coordination between the contractor and the client. No legal advice is provided and the technical provision does not entail any legal warranty. The legal examination of the website is the responsibility of the customer.</Text>
      <Text style={[styles.text, styles.container]}>The Designer is entitled to use all work produced in fulfillment of the contract for the purpose of self-promotion in all media, naming the Client, and otherwise to refer to the work performed for the Client, unless the Designer has been informed in writing of any conflicting confidentiality interests of the Client.</Text>
      <Text style={[styles.text, styles.container]}>The transfer of the above-mentioned rights of use takes place after full payment of the Quotation.</Text>
      <Text style={[styles.text]}>The General Terms and Conditions apply at: <Link src='https://keingarten.com/agb/'>general terms and conditions</Link></Text>
    </View>
  );

  const BaseText2 = () => (
    <View style={styles.container} wrap={false}>
      <Text style={[styles.text, styles.container]}>This is a non-binding offer. The price may vary until the project is completed. In the event of a significant cost overrun, the customer will be informed immediately.</Text>
      <Text style={[styles.text, { marginTop: 20 }]}>We would be very happy to realize the project together!</Text>
      <Text style={[styles.text]}>Please do not hesitate to contact us if you have any questions.</Text>
      <Text style={[styles.text, styles.container]}>Best regards</Text>
      <Text style={[styles.text]}>keingarten</Text>
      <Image style={styles.signatureLogo} src={signature} />
    </View>
  );

  const Signature = () => (
    <View style={[styles.pageBottom, styles.container]}>
      <Text style={[styles.categoryTitle, styles.container]}>Acceptance of the General Terms and Conditions</Text>
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
          <Text style={styles.signatureText}>Place, date</Text>
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
          <Text style={styles.signatureText}>Signature of client</Text>
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
          <Text >Description</Text>
        </View>
        <View style={[styles.theader, styles.rightAligned]}>
          <Text>Rate</Text>
        </View>
        <View style={[styles.theader, styles.centered]}>
          <Text>Hours</Text>
        </View>
        <View style={[styles.theader, styles.rightAligned]}>
          <Text>Total</Text>
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
                        ? 'flat-rate'
                        : subItem.rate.toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' €'}
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
                        : subItem.total.toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' €'}
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
        <Text >Sub Total</Text>
      </View>
      <View style={[styles.theader, styles.centered]}>
        <Text></Text>
      </View>
      <View style={[styles.theader, styles.centered]}>
        <Text></Text>
      </View>
      <View style={[styles.theader, styles.rightAligned]}>
        <Text>
          {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} €
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
        <Text >19% Tax rate</Text>
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
            {tax.toLocaleString('en-US', { minimumFractionDigits: 2 })} €
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
        <Text >Total</Text>
      </View>
      <View style={[styles.theader, styles.centered]}>
        <Text></Text>
      </View>
      <View style={[styles.theader, styles.centered]}>
        <Text></Text>
      </View>
      <View style={[styles.theader, styles.rightAligned]}>
        <Text>
          {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} €
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
      <Text style={styles.categoryTitle}>Optional text</Text>
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
          `Page ${pageNumber} of ${totalPages}`
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
          `Page ${pageNumber} of ${totalPages}`
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
            `Page ${pageNumber} of ${totalPages}`
          )} fixed />
        </Page>
      ) : null}
    </Document>
  );
};

export default QuotationEnglish;
