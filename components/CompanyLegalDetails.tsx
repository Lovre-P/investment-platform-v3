import React from 'react';

const CompanyLegalDetails: React.FC = () => (
  <section className="bg-secondary-50 p-6 rounded-lg border border-secondary-200">
    <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Company details</h2>
    <dl className="space-y-2 text-secondary-700">
      <div>
        <dt className="font-semibold">Registered name</dt>
        <dd>MEGA INVEST društvo s ograničenom odgovornošću za građevinarstvo i usluge, turistička agencija</dd>
      </div>
      <div>
        <dt className="font-semibold">Short name</dt>
        <dd>MEGA INVEST d.o.o.</dd>
      </div>
      <div>
        <dt className="font-semibold">Registered office</dt>
        <dd>Put Gvozdenova 283, 22000 Šibenik, Croatia</dd>
      </div>
      <div>
        <dt className="font-semibold">Court and registration number</dt>
        <dd>Commercial Court in Zadar – Permanent Service in Šibenik; MBS 110125015</dd>
      </div>
      <div>
        <dt className="font-semibold">OIB</dt>
        <dd>94198216157</dd>
      </div>
      <div>
        <dt className="font-semibold">VAT identification number</dt>
        <dd>HR94198216157</dd>
      </div>
      <div>
        <dt className="font-semibold">Share capital</dt>
        <dd>€2,500.00, paid in full</dd>
      </div>
      <div>
        <dt className="font-semibold">Management and representation</dt>
        <dd>Ivan Maretić, member of the management board and authorised representative</dd>
      </div>
      <div>
        <dt className="font-semibold">Bank account</dt>
        <dd>RAIFFEISENBANK AUSTRIA d.d., Magazinska cesta 69, 10000 Zagreb, Croatia</dd>
        <dd>IBAN: HR72 2484 0081 1354 5631 8; BIC/SWIFT: RZBHHR2X</dd>
      </div>
    </dl>
  </section>
);

export default CompanyLegalDetails;
