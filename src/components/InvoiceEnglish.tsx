import React, { Fragment } from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image, Line, Svg, Link } from '@react-pdf/renderer';
import logo from '../kg_logo_black_192px.png'
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

const styles = StyleSheet.create({
  page: {
    fontFamily: 'OpenSans',
    fontSize: 10,
    // paddingVertical: '13mm',
    paddingTop: '13mm',
    paddingBottom: '40mm',
    paddingHorizontal: '15.5mm',
    // paddingLeft: '15.5mm',
    // paddingRight: '15.5mm',
    lineHeight: 1.25,
    flexDirection: 'column',
    position: 'relative', // To position the footer absolutely
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
  right: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
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
  },
  footer: {
    color: 'grey',
    fontSize: 9,
    // flex: 1, 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    justifyContent: 'space-between'
  },
  footerPosition: {
    position: 'absolute',
    bottom: '14mm', // Position the footer above the page number
    left: '15.5mm', // Match the horizontal padding of the page
    right: '15.5mm', // Match the horizontal padding of the page
  }

});

interface InvoiceProps {
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
      invoiceNr: number;
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

const InvoiceEnglish: React.FC<InvoiceProps> = ({ data, taxRate }) => {
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
          <Text style={styles.categoryTitle}>Invoice #{keingarten.invoiceNr}</Text>
          <Text>"{project.titel}"</Text>
        </View>
        <View>
          <Text style={styles.categoryTitle}>Contact person</Text>
          <Text>{keingarten.contactPerson}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.categoryTitle}>{new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).format(new Date(keingarten.date))}</Text>
          <View style={styles.right}>
            <Text style={styles.categoryTitle}>Performance period</Text>
            <Text style={styles.text}>{new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }).format(new Date(keingarten.date))} - {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }).format(new Date(keingarten.date))}</Text>
          </View>
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

  const Footer = () => (
      <View style={[styles.address, styles.container, styles.footer]}>
        <View>
          <Text style={styles.categoryTitle}>keingarten</Text>
          <Text>Bissantz, Lörinc, Lorenz, Brozmann GbR</Text>
          <Text>{keingarten.street} {keingarten.streetNumber}</Text>
          <Text>{keingarten.zip} {keingarten.city}</Text>
          <Text>Mail: hello@keingarten.de</Text>
        </View>
        <View>
          <Text style={styles.categoryTitle}>Bank details</Text>
          <Text>Banque de France</Text>
          <Text>IBAN: DE88 1001 0123 7595 0200 99</Text>
          <Text>BIC: QNTODEB2XXX</Text>
          <Text></Text>
        </View>
        <View>
          <Text style={styles.categoryTitle}>Tex number</Text>
          <Text>240/152/79806</Text>
          <Text>Tax office</Text>
          <Text>Nürnberg-Süd</Text>
          <Text>VAT: DE330237679</Text>
        </View>
      </View>
  );

  const BaseText2 = () => (
    <View style={styles.container} wrap={false}>
      <Text style={[styles.text, styles.container]}>Thank you very much for your cooperation and the trust you have placed in us!</Text>
      <Text style={[styles.text]}>Payable within 10 days of invoicing to the account stated below.</Text>
      <Text style={[styles.text, { marginTop: 20 }]}>Best regards</Text>
      <Text style={[styles.text]}>keingarten</Text>
      <Image style={styles.signatureLogo} src={signature} />
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

  return (
    <Document>
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
      	<View style={styles.footerPosition} fixed>
      		<Footer />
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

export default InvoiceEnglish;